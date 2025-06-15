"use client"

import { useState, useRef, useCallback, useEffect } from "react"

const useWebRTC = (socket, currentUser, remoteVideoRef = null) => {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const peerConnection = useRef(null)
  const localStreamRef = useRef(null)
  const pendingIceCandidates = useRef([])
  const peerIdRef = useRef(null) // 👈 Đối phương (người nhận/người gọi)

  const servers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  }

  const createPeerConnection = useCallback((targetId) => {
    if (peerConnection.current) {
      peerConnection.current.close()
    }

    peerIdRef.current = targetId
    const pc = new RTCPeerConnection(servers)
    peerConnection.current = pc

    pc.ontrack = (event) => {
      console.log("📡 Received remote stream")
      const [stream] = event.streams
      setRemoteStream(stream)
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socket && peerIdRef.current) {
        socket.emit("ice_candidate", {
          candidate: event.candidate,
          recipientId: peerIdRef.current,
        })
      }
    }

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState
      console.log("Connection state:", state)
      setIsConnected(state === "connected")
    }

    return pc
  }, [socket])

  const getMediaStream = async (video = false) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video,
      })
      setLocalStream(stream)
      localStreamRef.current = stream
      return stream
    } catch (error) {
      console.error("🎙️ Error accessing media devices:", error)
      throw error
    }
  }

  const startCall = async (recipientId, callType = "voice") => {
    try {
      const stream = await getMediaStream(callType === "video")
      const pc = createPeerConnection(recipientId)

      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      socket?.emit("call_offer", {
        recipientId,
        offer,
        callType,
        callerInfo: {
          id: currentUser?.id,
          name: currentUser?.username,
          avatar: currentUser?.avatar,
        },
      })

      setIsCallActive(true)
      return true
    } catch (error) {
      console.error("❌ Error starting call:", error)
      return false
    }
  }

  const answerCall = async (offer, callerId, callType = "voice") => {
    try {
      const stream = await getMediaStream(callType === "video")
      const pc = createPeerConnection(callerId)

      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      await pc.setRemoteDescription(new RTCSessionDescription(offer))

      // Xử lý ICE candidate pending
      while (pendingIceCandidates.current.length > 0) {
        const candidate = pendingIceCandidates.current.shift()
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
      }

      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket?.emit("call_answer", {
        callerId,
        answer,
      })

      setIsCallActive(true)
      return true
    } catch (error) {
      console.error("❌ Error answering call:", error)
      return false
    }
  }

  const handleAnswer = async (answer) => {
    try {
      const pc = peerConnection.current
      if (!pc) return

      await pc.setRemoteDescription(new RTCSessionDescription(answer))

      while (pendingIceCandidates.current.length > 0) {
        const candidate = pendingIceCandidates.current.shift()
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
      }
    } catch (error) {
      console.error("❌ Error handling answer:", error)
    }
  }

  const handleIceCandidate = async (candidate) => {
    try {
      const pc = peerConnection.current
      if (!pc) return

      if (!pc.remoteDescription || pc.remoteDescription.type === "") {
        console.warn("🕓 ICE candidate received before remoteDescription set. Queuing.")
        pendingIceCandidates.current.push(candidate)
        return
      }

      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error("❌ Error handling ICE candidate:", error)
    }
  }
const endCall = () => {
  console.log("📴 Ending call")

  if (peerConnection.current) {
    peerConnection.current.close()
    peerConnection.current = null
  }

  if (localStreamRef.current) {
    localStreamRef.current.getTracks().forEach((track) => track.stop())
    localStreamRef.current = null
  }

  if (peerIdRef.current && socket) {
    socket.emit("call_ended", { recipientId: peerIdRef.current })
  }

  peerIdRef.current = null
  setLocalStream(null)
  setRemoteStream(null)
  setIsCallActive(false)
  setIsConnected(false)
}


  // 💡 Optional: gán remoteStream vào video tag
  useEffect(() => {
    if (remoteVideoRef?.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream, remoteVideoRef])
// 💡 Gán local stream vào localVideoRef
  useEffect(() => {
      if (localStreamRef?.current && localStream) {
          localStreamRef.current.srcObject = localStream;
      }
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    isCallActive,
    isConnected,
    startCall,
    answerCall,
    handleAnswer,
    handleIceCandidate,
    endCall,
  }
}

export default useWebRTC