
import React from "react"
import { useState } from "react"
import Sidebar     from "./components/messenger/Sidebar"
import MessageList from "./components/messenger/MessageList"
import ChatWindow  from "./components/messenger/ChatWindow"
import LoginForm   from "./components/messenger/LoginForm"
import CallModal   from "./components/messenger/CallModal"
import { SocketProvider, useSocketContext } from "./context/SocketContext"
import "./App.css"

const mockContacts = [
  {
    id: "user_alice",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey there! How are you?",
    time: "2m",
    isTyping: false,
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "user_bob",
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Let's discuss the project",
    time: "5m",
    isTyping: false,
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "user_kretya",
    name: "Kretya Studio",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Victor is typing...",
    time: "4m",
    isTyping: true,
    unreadCount: 12,
    isOnline: true,
  },
  {
    id: "user_pm_okta",
    name: "PM Okta",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I see, okay noted! I...",
    time: "10m",
    isTyping: false,
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "user_lead_frans",
    name: "Lead Frans",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "ok, thanks!",
    time: "1h",
    isTyping: false,
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "user_victor",
    name: "Victor Yoga",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "You can check it...",
    time: "now",
    isTyping: false,
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: "user_devon",
    name: "Devon Lane",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'll try my best von",
    time: "4m",
    isTyping: false,
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "user_guy",
    name: "Guy Hawkins",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "okaay notedd bro!",
    time: "7m",
    isTyping: false,
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "user_kristin",
    name: "Kristin Watson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "nice.",
    time: "23m",
    isTyping: false,
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "user_theresa",
    name: "Theresa Web",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'll come to you asap...",
    time: "1h",
    isTyping: false,
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "user_floyd",
    name: "Floyd Miles",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey there!",
    time: "12h",
    isTyping: false,
    unreadCount: 0,
    isOnline: false,
  },
]

const AppContent = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const {
    socket,
    incomingCall,
    activeCall,
    localStream,
    remoteStream,
    isCallConnected,
    isVideoEnabled,
    isAudioEnabled,
    handleAcceptCall,
    handleRejectCall,
    handleEndCall,
    toggleVideo,
    toggleAudio,
  } = useSocketContext()

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    const availableContacts = mockContacts.filter((contact) => contact.id !== userData.id)
    if (availableContacts.length > 0) {
      setSelectedContact(availableContacts[0])
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setSelectedContact(null)
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  const availableContacts = mockContacts.filter((contact) => contact.id !== currentUser.id)
  const filteredContacts = availableContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get contact info for calls
  const getContactById = (id) => availableContacts.find((contact) => contact.id === id)

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar currentUser={currentUser} onLogout={handleLogout} />
        <MessageList
          contacts={filteredContacts}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {selectedContact && <ChatWindow contact={selectedContact} />}
      </div>

      {/* Incoming Call Modal */}
      {incomingCall && (
        <CallModal
          isOpen={true}
          callType={incomingCall.callType}
          isIncoming={true}
          caller={incomingCall.caller}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          onEndCall={handleEndCall}
          socket={socket}               
          currentUser={currentUser} 
        />
      )}

      {/* Active Call Modal */}
      {activeCall && (
        <CallModal
          isOpen={true}
          callType={activeCall.callType}
          isIncoming={activeCall.isIncoming}
          caller={activeCall.caller}
          recipient={getContactById(activeCall.recipientId)}
          onEndCall={handleEndCall}
          localStream={localStream}
          remoteStream={remoteStream}
          isConnected={isCallConnected}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          onToggleVideo={toggleVideo}
          onToggleAudio={toggleAudio}
           socket={socket}                
          currentUser={currentUser} 
        />
      )}
    </>
  )
}

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  if (!currentUser) {
    return <LoginForm onLogin={setCurrentUser} />
  }

  return (
    <SocketProvider currentUser={currentUser}>
      <AppContent />
    </SocketProvider>
  )
}

export default App