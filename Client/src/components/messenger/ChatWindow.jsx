"use client"
import React from "react"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { Phone, Video, MoreHorizontal, Smile, Paperclip, Send, ImageIcon, Mic } from "lucide-react"
import { useSocketContext } from "../../context/SocketContext"

const ChatWindow = ({ contact }) => {
  // console.log(contact)
  const [newMessage, setNewMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const [chatHistory, setChatHistory] = useState([]); 

  const {
    socket,
    isConnected,
    currentUser,
    handleSendMessage,
    handleSendTyping,
    handleStartCall,
    getMessagesForUser,
    getTypingStatus,
  } = useSocketContext()

  const messages =  getMessagesForUser(contact.id);
  const typingStatus = getTypingStatus(contact.id)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchChatHistory = async (userId1, userId2) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${userId1}/${userId2}`);
      

      return res.data; // dữ liệu từ MongoDB
    } catch (err) {
      console.error('Error fetching chat history:', err);
      return [];
    }
  };

  useEffect(() => {
    const loadChatHistory = async () => {
      const history = await fetchChatHistory(currentUser.id, contact.id);
  
      setChatHistory(history); // lưu vào state mới
    };

    if (currentUser && contact.id) {
      loadChatHistory();
    }
  }, [messages]);
  useEffect(() => {
    const handleIncomingMessage = (data) => {
      const { senderId, recipientId } = data;

        // Nếu tin nhắn là của cuộc trò chuyện hiện tại:
      if (senderId === contact.id || recipientId === contact.id) {
        setChatHistory((prev) => [...prev, data]);
      }
    };

    socket.on("private_message", handleIncomingMessage);

    return () => socket.off("private_message", handleIncomingMessage);
  }, [socket, contact.id, currentUser.id]);


  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

const handleSendMessageClick = async () => {
  if (newMessage.trim()) {
    const formData = new FormData();
    formData.append('senderId', currentUser.id);
    formData.append('recipientId', contact.id);
    formData.append('messageType', 'text');
    formData.append('message', newMessage);

    try {
      const res = await axios.post('http://localhost:5000/api/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setChatHistory(prev => [...prev, res.data]); // update chatHistory
      handleSendMessage(contact.id, res.data.message); // socket emit
    } catch (err) {
      console.error('Send message error:', err);
    }

    setNewMessage("");
    if (isTyping) {
      handleSendTyping(contact.id, false);
      setIsTyping(false);
    }
  }
};


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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('senderId', currentUser.id);
      formData.append('recipientId', contact.id);
      formData.append('messageType', 'image');
      formData.append('image', file);

      try {
        const res = await axios.post('http://localhost:5000/api/messages', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setChatHistory(prev => [...prev, res.data]); // update chatHistory
        handleSendMessage(contact.id, res.data.imageUrl, 'image');
      } catch (err) {
        console.error('Send image error:', err);
      }
    }
  };


  const handleVoiceCall = async () => {
    console.log("Starting voice call with:", contact.username)
    const success = await handleStartCall(contact.id, "voice")
    if (!success) {
      alert("Failed to start voice call. Please check your microphone permissions.")
    }
  }

  const handleVideoCall = async () => {
    console.log("Starting video call with:", contact.username)
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
                alt={contact.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{contact.username}</h2>
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
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-medium text-gray-900 mb-2">Start a conversation with {contact.username}</h3>
              <p className="text-gray-600 text-sm">Send a message or start a call to begin chatting!</p>
            </div>
          </div>
        )}

        {/* Messages */}
   {chatHistory.map((message) => {
      const isOwnMessage = message.senderId === currentUser.id;

      // Lấy avatar + tên phù hợp:
      const senderInfo = isOwnMessage
        ? { avatar: currentUser.avatar, username: currentUser.username }
        : { avatar: contact.avatar, username: contact.username };

      return (
        <div key={message._id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
          <div
            className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
              isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <img
              src={senderInfo.avatar || "/placeholder.svg"}
              alt={senderInfo.username}
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
              <span className="text-sm font-medium text-gray-900 mb-1">{senderInfo.username}</span>

              <div
                className={`px-4 py-2 rounded-2xl ${
                  isOwnMessage ? "bg-blue-500 text-white" : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                {message.messageType === "image" ? (
                  <img
                    src={message.imageUrl || "/placeholder.svg"} // Đúng ảnh Cloudinary
                    alt="Shared image"
                    className="max-w-xs rounded-lg"
                  />
                ) : (
                  <p className="text-sm">{message.message}</p>
                )}
              </div>

              <span className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>
      );
    })}
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
              placeholder={`Message ${contact.username}...`}
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