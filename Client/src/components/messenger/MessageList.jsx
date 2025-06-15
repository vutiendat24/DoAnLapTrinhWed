
import React from "react" 
import { Search, Edit, MoreHorizontal, Pin, MessageCircle } from "lucide-react"
import { useSocketContext } from "../../context/SocketContext"
const MessageList = ({ contacts, selectedContact, onSelectContact, searchTerm, onSearchChange }) => {
  const { getTypingStatus, getMessagesForUser } = useSocketContext()

  const getLastMessage = (contact) => {
    const messages = getMessagesForUser(contact.id)
    const typingStatus = getTypingStatus(contact.id)

    if (typingStatus) {
      return `${typingStatus.username} is typing...`
    }

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      return lastMessage.message.length > 30 ? lastMessage.message.substring(0, 30) + "..." : lastMessage.message
    }

    return contact.lastMessage
  }

  const getUnreadCount = (contact) => {
    const messages = getMessagesForUser(contact.id)
    return messages.filter((msg) => !msg.isOwn && !msg.read).length || contact.unreadCount
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Edit size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Pinned Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-gray-500">
          <Pin size={16} />
          <span className="text-sm font-medium">Pinned</span>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => {
          const lastMessage = getLastMessage(contact)
          const unreadCount = getUnreadCount(contact)
          const isTyping = !!getTypingStatus(contact.id)

          return (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedContact.id === contact.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={contact.avatar || "/placeholder.svg"}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${isTyping ? "text-green-500 italic" : "text-gray-600"}`}>
                      {lastMessage}
                    </p>
                    {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* All Messages Section */}
        <div className="p-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <MessageCircle size={16} />
            <span className="text-sm font-medium">All Messages</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageList