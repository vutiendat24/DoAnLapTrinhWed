"use client"
import React from "react"
import { useState } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ThumbsUp,
  MessageCircle,
  Share2,
  Smile,
  Camera,
  MoreHorizontal,
  Clock,
  Eye,
  Bookmark,
} from "lucide-react"

const Watch = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Nguyễn Văn A",
      text: "Video rất hay và bổ ích! Cảm ơn bạn đã chia sẻ 👍",
      time: "2 phút trước",
      avatar: "A",
    },
    {
      id: 2,
      user: "Trần Thị B",
      text: "Mình đã học được nhiều điều từ video này. Chờ đợi video tiếp theo!",
      time: "5 phút trước",
      avatar: "B",
    },
  ])

  const suggestedVideos = [
    {
      id: 1,
      title: "Hướng dẫn React Hooks từ cơ bản đến nâng cao",
      creator: "Tech Channel",
      views: "125K",
      time: "15:30",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "10 mẹo thiết kế UI/UX cho người mới bắt đầu",
      creator: "Design Pro",
      views: "89K",
      time: "12:45",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 3,
      title: "Cách tối ưu hóa website để tăng tốc độ tải",
      creator: "Web Master",
      views: "67K",
      time: "18:20",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim() === "") return

    const newComment = {
      id: Date.now(),
      user: "Nguyễn Văn A",
      text: commentText,
      time: "Vừa xong",
      avatar: "A",
    }

    setComments([newComment, ...comments])
    setCommentText("")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex">
        {/* Video Player Area */}
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden mb-4 relative group">
              <div className="aspect-video relative">
                <img
                  src="/placeholder.svg?height=480&width=854"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <button
                    onClick={handlePlayPause}
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all duration-200 transform group-hover:scale-110"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-gray-800" />
                    ) : (
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    )}
                  </button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button onClick={handlePlayPause} className="text-white hover:text-pink-300 transition-colors">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button onClick={handleMuteToggle} className="text-white hover:text-pink-300 transition-colors">
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <span className="text-white text-sm">5:30 / 15:45</span>
                    </div>
                    <button className="text-white hover:text-pink-300 transition-colors">
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
                    <div className="bg-pink-500 h-1 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">TC</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Tech Channel</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>1.2M người theo dõi</span>
                      <span>•</span>
                      <span>2 giờ trước</span>
                    </div>
                  </div>
                </div>
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Theo dõi
                </button>
              </div>

              <h1 className="text-xl font-bold text-gray-800 mb-2">
                Hướng dẫn xây dựng ứng dụng React từ A đến Z - Phần 1: Thiết lập dự án
              </h1>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>45.2K lượt xem</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>15:45</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                Trong video này, chúng ta sẽ học cách thiết lập một dự án React từ đầu, bao gồm cài đặt các công cụ cần
                thiết, cấu hình môi trường phát triển và tạo component đầu tiên. Video phù hợp cho người mới bắt đầu học
                React.
              </p>

              {/* Video Actions */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                    <span className="font-medium">2.1K</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">156</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">Chia sẻ</span>
                  </button>
                </div>
                <button className="text-gray-600 hover:text-pink-500 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Bình luận ({comments.length})</h3>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">A</span>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      placeholder="Viết bình luận công khai..."
                      className="w-full bg-gray-100 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-colors resize-none"
                      rows="3"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                      <button type="button" className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <Smile className="w-5 h-5 text-gray-500" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <Camera className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setCommentText("")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        commentText.trim()
                          ? "bg-pink-500 hover:bg-pink-600 text-white"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!commentText.trim()}
                    >
                      Bình luận
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{comment.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <h4 className="font-semibold text-sm text-gray-800">{comment.user}</h4>
                        <p className="text-gray-700 text-sm mt-1">{comment.text}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{comment.time}</span>
                        <button className="hover:text-pink-500 transition-colors">Thích</button>
                        <button className="hover:text-pink-500 transition-colors">Phản hồi</button>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Videos Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-4">Video tiếp theo</h3>
          <div className="space-y-4">
            {suggestedVideos.map((video) => (
              <div
                key={video.id}
                className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {video.time}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">{video.title}</h4>
                  <p className="text-xs text-gray-500 mb-1">{video.creator}</p>
                  <p className="text-xs text-gray-500">{video.views} lượt xem</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Watch
