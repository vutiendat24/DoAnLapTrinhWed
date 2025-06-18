"use client"
import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import useSocket from "../hook/useSocket"
import useWebRTC from "../hook/useWebRTC"

const SocketContext = createContext()

export const useSocketContext = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children, currentUser }) => {
  const [messages, setMessages] = useState({})
  const [typingUsers, setTypingUsers] = useState({})
  const [incomingCall, setIncomingCall] = useState(null)
  const [activeCall, setActiveCall] = useState(null)

  const { socket, isConnected, users, joinRoom, sendMessage, sendTyping } = useSocket()
  const {
    localStream,
    remoteStream,
    isCallActive,
    isConnected: isCallConnected,
    startCall,
    answerCall,
    handleAnswer,
    handleIceCandidate,
    endCall,
  } = useWebRTC(socket, currentUser)

  useEffect(() => {
    if (socket && currentUser) {
      // Join room when socket connects
      joinRoom(currentUser.id, currentUser.username)

      // Listen for incoming messages
      socket.on("private_message", (data) => {
        const { senderId, message, messageType, timestamp, senderInfo } = data

        setMessages((prev) => ({
          ...prev,
          [senderId]: [
            ...(prev[senderId] || []),
            {
              id: Date.now() + Math.random(),
              sender: senderInfo.username,
              avatar: senderInfo.avatar || "/placeholder.svg?height=32&width=32",
              message,
              messageType,
              time: new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isOwn: false,
            },
          ],
        }))

        // Play notification sound (optional)
        if (Notification.permission === "granted") {
          new Notification(`New message from ${senderInfo.username}`, {
            body: messageType === "image" ? "Sent an image" : message,
            icon: senderInfo.avatar,
          })
        }
      })

      // Listen for typing indicators
      socket.on("user_typing", (data) => {
        const { senderId, isTyping, senderInfo } = data
        setTypingUsers((prev) => ({
          ...prev,
          [senderId]: isTyping ? senderInfo : null,
        }))

        if (isTyping) {
          setTimeout(() => {
            setTypingUsers((prev) => ({
              ...prev,
              [senderId]: null,
            }))
          }, 3000)
        }
      })

      // Listen for call events
      socket.on("call_offer", (data) => {
        const { offer, callType, callerInfo } = data
        console.log("Received call offer from:", callerInfo.name)

        setIncomingCall({
          offer,
          callType,
          caller: callerInfo,
        })
      })

      socket.on("call_answer", (data) => {
        const { answer } = data
        console.log("Received call answer")
        handleAnswer(answer)
      })

      socket.on("ice_candidate", (data) => {
        const { candidate } = data
        handleIceCandidate(candidate)
      })

      socket.on("call_ended", () => {
        console.log("Call ended by remote user")
        endCall()
        setActiveCall(null)
        setIncomingCall(null)
      })

      socket.on("call_rejected", () => {
        console.log("Call rejected")
        endCall()
        setActiveCall(null)
      })

      // Listen for user status updates
      socket.on("user_joined", (data) => {
        // console.log("User joined:", data)
      })

      socket.on("user_left", (data) => {
        console.log("User left:", data)
      })

      return () => {
        socket.off("private_message")
        socket.off("user_typing")
        socket.off("call_offer")
        socket.off("call_answer")
        socket.off("ice_candidate")
        socket.off("call_ended")
        socket.off("call_rejected")
        socket.off("user_joined")
        socket.off("user_left")
      }
    }
  }, [socket, currentUser, handleAnswer, handleIceCandidate, endCall])

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const handleSendMessage = (recipientId, messageText, messageType = "text") => {
    if (!messageText.trim()) return

    const messageData = sendMessage(recipientId, messageText, messageType)

    if (messageData) {
      setMessages((prev) => ({
        ...prev,
        [recipientId]: [
          ...(prev[recipientId] || []),
          {
            id: Date.now() + Math.random(),
            sender: currentUser.username,
            avatar: currentUser.avatar,
            message: messageText,
            messageType,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isOwn: true,
          },
        ],
      }))
    }
  }

  const handleSendTyping = (recipientId, isTyping) => {
    sendTyping(recipientId, isTyping)
  }

  const handleStartCall = async (recipientId, callType) => {
    const success = await startCall(recipientId, callType)
    console.log(recipientId)
    console.log(callType)
    if (success) {
      setActiveCall({
        recipientId,
        callType,
        isIncoming: false,
      })
    }
    return success
  }

  const handleAcceptCall = async () => {
    if (incomingCall) {
      const success = await answerCall(incomingCall.offer, incomingCall.caller.id, incomingCall.callType)
      console.log(incomingCall.caller.id)
      if (success) {
        setActiveCall({
          recipientId: incomingCall.caller.id,
          callType: incomingCall.callType,
          isIncoming: true,
          caller: incomingCall.caller,
        })
        setIncomingCall(null)
      }
    }
  }

  const handleRejectCall = () => {
    if (socket && incomingCall) {
      socket.emit("call_rejected", {
        callerId: incomingCall.caller.id,
      })
    }
    setIncomingCall(null)
  }

  const handleEndCall = () => {
    
    endCall()
    setActiveCall(null)
    setIncomingCall(null)
  }

  const getMessagesForUser = (userId) => {
    return messages[userId] || []
  }

  const getTypingStatus = (userId) => {
    return typingUsers[userId]
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        currentUser,
        users,
        messages,
        typingUsers,
        incomingCall,
        activeCall,
        localStream,
        remoteStream,
        isCallActive,
        isCallConnected,
        handleSendMessage,
        handleSendTyping,
        handleStartCall,
        handleAcceptCall,
        handleRejectCall,
        handleEndCall,
        getMessagesForUser,
        getTypingStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}