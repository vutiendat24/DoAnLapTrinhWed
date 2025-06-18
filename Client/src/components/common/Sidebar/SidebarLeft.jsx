"use client"
import React from "react"
import {
  User,
  Users,
  UsersRound,
  ShoppingBag,
  Play,
  Camera,
  Bookmark,
  FileText,
  Calendar,
  Gamepad2,
  Cloud,
  Clock,
  Heart,
  ChevronDown,
  Settings,
} from "lucide-react"
import { useState } from "react"

const SidebarLeft = () => {
  const [activeItem, setActiveItem] = useState("")
  const [showMore, setShowMore] = useState(false)

  const handleItemClick = (itemId) => {
    setActiveItem(itemId)
  }

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="p-4">
        {/* Main Menu Items */}
        <ul className="space-y-1">
          {/* Profile */}
          <li>
            <button
              onClick={() => handleItemClick("profile")}
              className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                activeItem === "profile"
                  ? "bg-pink-50 text-pink-500"
                  : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              <div className="w-9 h-9 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>
              <span
                className={`font-medium text-sm flex-1 text-left ${
                  activeItem === "profile" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                }`}
              >
                Nguyễn Văn A
              </span>
            </button>
          </li>

          {/* Friends */}
          <li>
            <button
              onClick={() => handleItemClick("friends")}
              className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                activeItem === "friends"
                  ? "bg-pink-50 text-pink-500"
                  : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activeItem === "friends" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                }`}
              >
                <Users
                  className={`h-5 w-5 ${activeItem === "friends" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                />
              </div>
              <span
                className={`font-medium text-sm flex-1 text-left ${
                  activeItem === "friends" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                }`}
              >
                Bạn bè
              </span>
            </button>
          </li>

          {/* Groups */}
          <li>
            <button
              onClick={() => handleItemClick("groups")}
              className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                activeItem === "groups"
                  ? "bg-pink-50 text-pink-500"
                  : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activeItem === "groups" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                }`}
              >
                <UsersRound
                  className={`h-5 w-5 ${activeItem === "groups" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                />
              </div>
              <span
                className={`font-medium text-sm flex-1 text-left ${
                  activeItem === "groups" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                }`}
              >
                Nhóm
              </span>
            </button>
          </li>

          {/* Marketplace */}
          <li>
            <button
              onClick={() => handleItemClick("marketplace")}
              className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                activeItem === "marketplace"
                  ? "bg-pink-50 text-pink-500"
                  : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activeItem === "marketplace" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                }`}
              >
                <ShoppingBag
                  className={`h-5 w-5 ${activeItem === "marketplace" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                />
              </div>
              <span
                className={`font-medium text-sm flex-1 text-left ${
                  activeItem === "marketplace" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                }`}
              >
                Marketplace
              </span>
            </button>
          </li>

          {/* Watch */}
          <li>
            <button
              onClick={() => handleItemClick("watch")}
              className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                activeItem === "watch"
                  ? "bg-pink-50 text-pink-500"
                  : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activeItem === "watch" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                }`}
              >
                <Play
                  className={`h-5 w-5 ${activeItem === "watch" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                />
              </div>
              <span
                className={`font-medium text-sm flex-1 text-left ${
                  activeItem === "watch" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                }`}
              >
                Watch
              </span>
            </button>
          </li>

          {/* Memories */}
          <li>
            <button
              onClick={() => handleItemClick("memories")}
              className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                activeItem === "memories"
                  ? "bg-pink-50 text-pink-500"
                  : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activeItem === "memories" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                }`}
              >
                <Camera
                  className={`h-5 w-5 ${activeItem === "memories" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                />
              </div>
              <span
                className={`font-medium text-sm flex-1 text-left ${
                  activeItem === "memories" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                }`}
              >
                Kỷ niệm
              </span>
            </button>
          </li>
        </ul>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* See More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-all duration-200 group cursor-pointer"
        >
          <div className="w-9 h-9 bg-gray-100 group-hover:bg-pink-100 rounded-full flex items-center justify-center">
            <ChevronDown
              className={`h-5 w-5 text-gray-600 group-hover:text-pink-500 transition-transform duration-200 ${
                showMore ? "rotate-180" : ""
              }`}
            />
          </div>
          <span className="font-medium text-sm flex-1 text-left group-hover:text-pink-500">
            {showMore ? "Ẩn bớt" : "Xem thêm"}
          </span>
        </button>

        {/* More Menu Items */}
        {showMore && (
          <ul className="space-y-1 mt-2">
            {/* Saved */}
            <li>
              <button
                onClick={() => handleItemClick("saved")}
                className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                  activeItem === "saved"
                    ? "bg-pink-50 text-pink-500"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeItem === "saved" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <Bookmark
                    className={`h-5 w-5 ${activeItem === "saved" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                  />
                </div>
                <span
                  className={`font-medium text-sm flex-1 text-left ${
                    activeItem === "saved" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                  }`}
                >
                  Đã lưu
                </span>
              </button>
            </li>

            {/* Pages */}
            <li>
              <button
                onClick={() => handleItemClick("pages")}
                className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                  activeItem === "pages"
                    ? "bg-pink-50 text-pink-500"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeItem === "pages" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <FileText
                    className={`h-5 w-5 ${activeItem === "pages" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                  />
                </div>
                <span
                  className={`font-medium text-sm flex-1 text-left ${
                    activeItem === "pages" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                  }`}
                >
                  Trang
                </span>
              </button>
            </li>

            {/* Events */}
            <li>
              <button
                onClick={() => handleItemClick("events")}
                className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                  activeItem === "events"
                    ? "bg-pink-50 text-pink-500"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeItem === "events" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <Calendar
                    className={`h-5 w-5 ${activeItem === "events" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                  />
                </div>
                <span
                  className={`font-medium text-sm flex-1 text-left ${
                    activeItem === "events" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                  }`}
                >
                  Sự kiện
                </span>
              </button>
            </li>

            {/* Gaming */}
            <li>
              <button
                onClick={() => handleItemClick("gaming")}
                className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                  activeItem === "gaming"
                    ? "bg-pink-50 text-pink-500"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeItem === "gaming" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <Gamepad2
                    className={`h-5 w-5 ${activeItem === "gaming" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                  />
                </div>
                <span
                  className={`font-medium text-sm flex-1 text-left ${
                    activeItem === "gaming" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                  }`}
                >
                  Trò chơi
                </span>
              </button>
            </li>

            {/* Weather */}
            <li>
              <button
                onClick={() => handleItemClick("weather")}
                className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                  activeItem === "weather"
                    ? "bg-pink-50 text-pink-500"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeItem === "weather" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <Cloud
                    className={`h-5 w-5 ${activeItem === "weather" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                  />
                </div>
                <span
                  className={`font-medium text-sm flex-1 text-left ${
                    activeItem === "weather" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                  }`}
                >
                  Thời tiết
                </span>
              </button>
            </li>

            {/* Recent Activity */}
            <li>
              <button
                onClick={() => handleItemClick("recent")}
                className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                  activeItem === "recent"
                    ? "bg-pink-50 text-pink-500"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeItem === "recent" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <Clock
                    className={`h-5 w-5 ${activeItem === "recent" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                  />
                </div>
                <span
                  className={`font-medium text-sm flex-1 text-left ${
                    activeItem === "recent" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                  }`}
                >
                  Hoạt động gần đây
                </span>
              </button>
            </li>

            {/* Favorites */}
            <li>
              <button
                onClick={() => handleItemClick("favorites")}
                className={`w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${
                  activeItem === "favorites"
                    ? "bg-pink-50 text-pink-500"
                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-500"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeItem === "favorites" ? "bg-pink-100" : "bg-gray-100 group-hover:bg-pink-100"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${activeItem === "favorites" ? "text-pink-500" : "text-gray-600 group-hover:text-pink-500"}`}
                  />
                </div>
                <span
                  className={`font-medium text-sm flex-1 text-left ${
                    activeItem === "favorites" ? "text-pink-500" : "text-gray-700 group-hover:text-pink-500"
                  }`}
                >
                  Yêu thích
                </span>
              </button>
            </li>
          </ul>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Shortcuts Section */}
        <div className="mb-3">
          <div className="flex items-center justify-between px-2 py-2">
            <h3 className="text-gray-500 font-semibold text-sm">Lối tắt của bạn</h3>
            <Settings className="h-4 w-4 text-gray-400 hover:text-pink-500 cursor-pointer" />
          </div>
        </div>

        {/* Shortcuts List */}
        <ul className="space-y-1">
          <li>
            <button className="w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-all duration-200 group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm group-hover:text-pink-500">Nhóm React Developers</div>
                <div className="text-xs text-gray-500">15.2K thành viên</div>
              </div>
            </button>
          </li>

          <li>
            <button className="w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-all duration-200 group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm group-hover:text-pink-500">Cộng đồng Lập trình</div>
                <div className="text-xs text-gray-500">8.7K thành viên</div>
              </div>
            </button>
          </li>

          <li>
            <button className="w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-all duration-200 group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm group-hover:text-pink-500">Trang công nghệ</div>
                <div className="text-xs text-gray-500">25.1K người theo dõi</div>
              </div>
            </button>
          </li>
        </ul>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-400 leading-relaxed cursor-default">
            Trang Social Media của Tiến Đạt - Nguyễn Trí· PTIT © 2025
          </div>
        </div>
      </div>
    </div>
  )
}

export default SidebarLeft;
