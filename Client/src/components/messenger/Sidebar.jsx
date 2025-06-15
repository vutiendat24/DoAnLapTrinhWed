"use client"
import React from "react"
import { CheckCircle, Folder, Settings, Calendar, MessageCircle, BarChart3, Bell, LogOut } from "lucide-react"

const Sidebar = ({ currentUser, onLogout }) => {
  const menuItems = [
    { icon: CheckCircle, active: true },
    { icon: Folder, active: false },
    { icon: Settings, active: false },
    { icon: Calendar, active: false },
    { icon: MessageCircle, active: false },
    { icon: BarChart3, active: false },
    { icon: Bell, active: false },
  ]

  return (
    <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
      {menuItems.map((item, index) => {
        const Icon = item.icon
        return (
          <button
            key={index}
            className={`p-3 rounded-lg transition-colors ${
              item.active ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <Icon size={20} />
          </button>
        )
      })}

      <div className="flex-1"></div>

      {/* Current User Info */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative group">
          <img
            src={currentUser?.avatar || "/placeholder.svg?height=32&width=32"}
            alt={currentUser?.username}
            className="w-8 h-8 rounded-full object-cover border-2 border-green-500"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>

          {/* Tooltip */}
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {currentUser?.username}
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  )
}

export default Sidebar