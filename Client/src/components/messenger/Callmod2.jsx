"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2, User } from "lucide-react"
import { useSocketContext } from "../../context/SocketContext"

const CallModal = ({ isOpen, callType, isIncoming, caller, recipient, onAccept, onReject }) => {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video")
  const [callDuration, setCallDuration] = useState(0)
  const [callStatus, setCallStatus] = useState(isIncoming ? "incoming" : "calling")

  const callStartTimeRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)

  const { localStream, remoteStream, isCallConnected, handleEndCall } = useSocketContext()

  useEffect(() => {
    if (isCallConnected && !callStartTimeRef.current) {
      callStartTimeRef.current = Date.now()
      setCallStatus("connected")
    }
  }, [isCallConnected])

  useEffect(() => {
    let interval
    if (callStatus === "connected") {
      interval = setInterval(() => {
        if (callStartTimeRef.current) {
          setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000))
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getCallStatusText = () => {
    switch (callStatus) {
      case "incoming":
        return `Incoming ${callType} call`
      case "calling":
        return "Connecting..."
      case "connected":
        return formatDuration(callDuration)
      default:
        return ""
    }
  }

  if (!isOpen) return null

  const currentUser = isIncoming ? caller : recipient

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-md mx-auto">
        {/* Main Call Container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

          {/* Remote Video Background */}
          {callType === "video" && callStatus === "connected" && (
            <div className="absolute inset-0">
              {remoteStream ? (
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <User className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-slate-300 text-sm">Waiting for video...</p>
                  </div>
                </div>
              )}
              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 p-8">
            {/* User Avatar and Info */}
            <div className="text-center mb-8">
              {callType === "audio" || callStatus !== "connected" ? (
                <div className="mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-white/20">
                    <span className="text-4xl font-bold text-white">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{currentUser?.name || "Unknown User"}</h3>
                </div>
              ) : (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-white drop-shadow-lg">
                    {currentUser?.name || "Unknown User"}
                  </h3>
                </div>
              )}

              {/* Call Status */}
              <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                <p className="text-white/90 text-sm font-medium">{getCallStatusText()}</p>
              </div>
            </div>

            {/* Local Video (Picture-in-Picture) */}
            {callType === "video" && localStream && callStatus === "connected" && (
              <div className="absolute top-6 right-6 w-28 h-36 bg-slate-900 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <VideoOff className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>
            )}

            {/* Call Controls */}
            <div className="flex justify-center items-center space-x-6">
              {isIncoming && callStatus === "incoming" ? (
                <>
                  {/* Reject Button */}
                  <button
                    onClick={onReject}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>

                  {/* Accept Button */}
                  <button
                    onClick={onAccept}
                    className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95 animate-pulse"
                  >
                    <Phone className="w-7 h-7 text-white" />
                  </button>
                </>
              ) : (
                <>
                  {callStatus === "connected" && (
                    <>
                      {/* Mute Button */}
                      <button
                        onClick={toggleMute}
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95 ${
                          isMuted
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm"
                        }`}
                      >
                        {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                      </button>

                      {/* Video Toggle (for video calls) */}
                      {callType === "video" && (
                        <button
                          onClick={toggleVideo}
                          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95 ${
                            !isVideoEnabled
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm"
                          }`}
                        >
                          {isVideoEnabled ? (
                            <Video className="w-6 h-6 text-white" />
                          ) : (
                            <VideoOff className="w-6 h-6 text-white" />
                          )}
                        </button>
                      )}

                      {/* Speaker Button */}
                      <button className="w-14 h-14 bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95">
                        <Volume2 className="w-6 h-6 text-white" />
                      </button>
                    </>
                  )}

                  {/* End Call Button */}
                  <button
                    onClick={handleEndCall}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallModal
