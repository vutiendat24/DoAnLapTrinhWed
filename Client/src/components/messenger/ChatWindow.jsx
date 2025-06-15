"use client"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { Phone, Video, MoreHorizontal, Smile, Paperclip, Send, ImageIcon, Mic } from "lucide-react"
import { useSocketContext } from "../../context/SocketContext"

const ChatWindow = ({ contact }) => {
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const {
    isConnected,
    currentUser,
    handleSendMessage,
    handleSendTyping,
    handleStartCall,
    getMessagesForUser,
    getTypingStatus,
  } = useSocketContext()

  const messages = getMessagesForUser(contact.id)
  const typingStatus = getTypingStatus(contact.id)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessageClick = () => {
    if (newMessage.trim()) {
      handleSendMessage(contact.id, newMessage)
      setNewMessage("")

      if (isTyping) {
        handleSendTyping(contact.id, false)
        setIsTyping(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessageClick()
    }
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)

    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true)
      handleSendTyping(contact.id, true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        handleSendTyping(contact.id, false)
      }
    }, 1000)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      handleSendMessage(contact.id, imageUrl, "image")
    }
  }

  const handleVoiceCall = async () => {
    console.log("Starting voice call with:", contact.name)
    const success = await handleStartCall(contact.id, "voice")
    if (!success) {
      alert("Failed to start voice call. Please check your microphone permissions.")
    }
  }

  const handleVideoCall = async () => {
    console.log("Starting video call with:", contact.name)
    const success = await handleStartCall(contact.id, "video")
    if (!success) {
      alert("Failed to start video call. Please check your camera and microphone permissions.")
    }
  }

  const ConnectionStatus = () => (
    <div className={`flex items-center space-x-2 text-xs ${isConnected ? "text-green-600" : "text-red-600"}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
      <span>{isConnected ? "Connected" : "Disconnected"}</span>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={contact.avatar || "/placeholder.svg"}
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{contact.name}</h2>
              <div className="flex items-center space-x-2">
                {typingStatus && <p className="text-sm text-green-500 italic">{typingStatus.username} is typing...</p>}
                <ConnectionStatus />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleVideoCall}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Start video call"
            >
              <Video size={20} className="text-gray-600" />
            </button>
            <button
              onClick={handleVoiceCall}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Start voice call"
            >
              <Phone size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Header */}
        <div className="text-center">
          <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-500 border">Today, March 12</span>
        </div>

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-medium text-gray-900 mb-2">Start a conversation with {contact.name}</h3>
              <p className="text-gray-600 text-sm">Send a message or start a call to begin chatting!</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                message.isOwn ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              {!message.isOwn && (
                <img
                  src={message.avatar || "/placeholder.svg"}
                  alt={message.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
                {!message.isOwn && <span className="text-sm font-medium text-gray-900 mb-1">{message.sender}</span>}

                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isOwn ? "bg-blue-500 text-white" : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  {message.messageType === "image" ? (
                    <img
                      src={message.message || "/placeholder.svg"}
                      alt="Shared image"
                      className="max-w-xs rounded-lg"
                    />
                  ) : (
                    <p className="text-sm">{message.message}</p>
                  )}
                </div>

                <span className="text-xs text-gray-500 mt-1">{message.time}</span>
              </div>

              {message.isOwn && (
                <img
                  src={currentUser?.avatar || "/placeholder.svg"}
                  alt="You"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip size={20} className="text-gray-600" />
          </button>

          <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <ImageIcon size={20} className="text-gray-600" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${contact.name}...`}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />

            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded">
              <Smile size={18} className="text-gray-600" />
            </button>
          </div>

          {newMessage.trim() ? (
            <button
              onClick={handleSendMessageClick}
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <Send size={20} className="text-white" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-lg transition-colors ${
                isRecording ? "bg-red-500 hover:bg-red-600" : "hover:bg-gray-100"
              }`}
            >
              <Mic size={20} className={isRecording ? "text-white" : "text-gray-600"} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatWindow