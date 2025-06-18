"use client"

import { useEffect, useState } from "react"
import { io } from "socket.io-client"

const useSocket = (serverUrl = "http://localhost:5000") => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const socketInstance = io(serverUrl, {
      transports: ["websocket"],
      autoConnect: true,
    })

    socketInstance.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    })

    socketInstance.on("users_list", (usersList) => {
      setUsers(usersList)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [serverUrl])

  const joinRoom = (userId, username) => {
    if (socket) {
      socket.emit("join", { userId, username })
    }
  }

  const sendMessage = (recipientId, message, messageType = "text") => {
    if (socket) {
      const messageData = {
        recipientId,
        message,
        messageType,
        timestamp: new Date().toISOString(),
      }
      socket.emit("private_message", messageData)
      return messageData
    }
  }

  const sendTyping = (recipientId, isTyping) => {
    if (socket) {
      socket.emit("typing", { recipientId, isTyping })
    }
  }

  return {
    socket,
    isConnected,
    users,
    joinRoom,
    sendMessage,
    sendTyping,
  }
}

export default useSocket