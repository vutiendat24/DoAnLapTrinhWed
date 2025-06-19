"use client"

import React from "react"
import { useState, useRef } from "react"
import {
  ImageIcon,
  Video,
  Smile,
  MapPin,
  X,
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  Upload,
  Send,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"

const Post = () => {
  const [posts, setPosts] = useState([])
  const [userId, setUserId] = useState("")
  const fileInputRef = useRef(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState(null)

  // State cho comment - cải thiện UX
  const [expandedPosts, setExpandedPosts] = useState({}) // Track bài post nào đang mở comments
  const [commentInputs, setCommentInputs] = useState({}) // Nội dung comment cho từng post
  const [postComments, setPostComments] = useState({}) // Danh sách comment cho từng post
  const [isSubmittingComment, setIsSubmittingComment] = useState({}) // Track trạng thái submit
  const [likedPosts, setLikedPosts] = useState([]) // Track posts đã like

  // Lấy userId từ token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const uid = decoded.userId
        setUserId(uid)

        // Lấy danh sách posts đã like
        const savedLikedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]")
        setLikedPosts(savedLikedPosts)

        setFormData({
          author: uid,
          text: "",
          selectedFiles: [],
          privacy: "friends",
          location: "",
          device: "Laptop",
          source: "direct",
        })

        // Fetch posts
        const fetchPostsByUser = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/posts/author/${uid}`)
            const postsData = response.data.posts || []
            setPosts(postsData)

            // Fetch comments cho từng post
            const commentsData = {}
            for (const post of postsData) {
              try {
                const commentResponse = await  axios.get(`http://localhost:5000/posts/${post._id}/comments`)
               
                console.log(post._id)
                commentsData[post._id] = commentResponse.data.comments || []
              } catch (error) {
                console.error(`Lỗi khi lấy comment cho post ${post._id}:`, error)
                commentsData[post._id] = []
              }
            }
            setPostComments(commentsData)
          } catch (error) {
            console.error("Lỗi khi lấy bài viết:", error)
          }
        }

        fetchPostsByUser()
      } catch (error) {
        console.error("Không thể giải mã token:", error)
      }
    }
  }, [])

  if (!formData) return null

  // Toggle hiển thị comments khi click vào bài post
  const togglePostExpansion = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  // Handle like/unlike
  const handleLikeToggle = async (postId) => {
    const hasLiked = likedPosts.includes(postId)
    const action = hasLiked ? "unlike" : "like"

    try {
      const res = await axios.put(`http://localhost:5000/posts/${postId}/like`, { action })
      const updatedLikes = res.data.interactions.likes

      // Cập nhật state
      const updatedLikedPosts = hasLiked ? likedPosts.filter((id) => id !== postId) : [...likedPosts, postId]

      setLikedPosts(updatedLikedPosts)
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts))

      // Cập nhật UI
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, interactions: { ...post.interactions, likes: updatedLikes } } : post,
        ),
      )
    } catch (err) {
      console.error("Like toggle error:", err)
    }
  }

  // Handle submit comment
  const handleSubmitComment = async (postId) => {
    const commentContent = commentInputs[postId]?.trim()
    if (!commentContent) return

    setIsSubmittingComment((prev) => ({ ...prev, [postId]: true }))

    try {
      const token = localStorage.getItem("token")
      const decoded = jwtDecode(token)
      const userId = decoded.userId

      const res = await axios.post(`http://localhost:5000/posts/${postId}/comments`, {
        userId,
        content: commentContent,
      })

      // Cập nhật comments
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data.comment],
      }))

      // Cập nhật số lượng comment trong post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                interactions: {
                  ...post.interactions,
                  comments: [...(post.interactions.comments || []), res.data.comment],
                },
              }
            : post,
        ),
      )

      // Reset input
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error)
      alert("Không thể gửi bình luận!")
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }))
  }

  const handleCommentKeyPress = (e, postId) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment(postId)
    }
  }

  // Modal functions (giữ nguyên từ code gốc)
  const handleOpenPostModal = () => setShowPostModal(true)

  const handleClosePostModal = () => {
    setShowPostModal(false)
    setFormData({
      author: userId,
      text: "",
      selectedFiles: [],
      privacy: "friends",
      location: "",
      device: "Laptop",
      source: "direct",
    })
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        selectedFiles: [...prev.selectedFiles, ...imageFiles],
      }))
    }
    e.target.value = ""
  }

  const removeFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter((_, index) => index !== indexToRemove),
    }))
  }

  const handleDragOver = (e) => e.preventDefault()

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        selectedFiles: [...prev.selectedFiles, ...imageFiles],
      }))
    }
  }

  const createPreviewUrl = (file) => {
    return URL.createObjectURL(file)
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault()
    if (!formData.author || !formData.text.trim()) {
      alert("Vui lòng nhập nội dung bài viết!")
      return
    }

    setIsUploading(true)

    try {
      const uploadData = new FormData()
      uploadData.append("author", formData.author)
      uploadData.append("text", formData.text)
      uploadData.append("privacy", formData.privacy)
      uploadData.append("location", formData.location)
      uploadData.append("device", formData.device)
      uploadData.append("source", formData.source)

      formData.selectedFiles.forEach((file) => {
        uploadData.append("media", file)
      })

      const response = await axios.post("http://localhost:5000/posts/create", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      alert("Tạo bài viết thành công!")
      setPosts((prev) => [response.data.post, ...prev])
    } catch (error) {
      console.error("Error creating post:", error)
      alert(error.response?.data?.message || "Đã có lỗi xảy ra!")
    } finally {
      setIsUploading(false)
      handleClosePostModal()
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 sm:px-0">
      {/* Create Post Section */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">A</span>
            </div>
            <button
              onClick={handleOpenPostModal}
              className="bg-gray-100 hover:bg-gray-200 rounded-full py-2.5 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors text-left text-gray-500"
            >
              Bạn đang nghĩ gì?
            </button>
          </div>
          <div className="border-t border-gray-200 mt-4 pt-3">
            <div className="flex justify-between">
              <button
                onClick={handleOpenPostModal}
                className="flex items-center justify-center space-x-2 py-1.5 px-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Video className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-600">Video trực tiếp</span>
              </button>
              <button
                onClick={handleOpenPostModal}
                className="flex items-center justify-center space-x-2 py-1.5 px-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ImageIcon className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Ảnh/video</span>
              </button>
              <button
                onClick={handleOpenPostModal}
                className="flex items-center justify-center space-x-2 py-1.5 px-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Smile className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">Cảm xúc</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Creation Modal - giữ nguyên từ code gốc */}
      {showPostModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClosePostModal}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-800">Tạo bài viết</h2>
              <button
                onClick={handleClosePostModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="p-4 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">A</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Nguyễn Văn A</h3>
                  <select
                    value={formData.privacy}
                    onChange={(e) => handleFormChange("privacy", e.target.value)}
                    className="mt-1 text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 border-0 focus:ring-2 focus:ring-pink-500"
                    disabled={isUploading}
                  >
                    <option value="public">🌍 Công khai</option>
                    <option value="friends">👥 Bạn bè</option>
                    <option value="private">🔒 Chỉ mình tôi</option>
                  </select>
                </div>
              </div>

              <div>
                <textarea
                  value={formData.text}
                  onChange={(e) => handleFormChange("text", e.target.value)}
                  placeholder="Bạn đang nghĩ gì?"
                  className="w-full min-h-[120px] p-3 border-0 focus:outline-none resize-none text-lg placeholder-gray-500"
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Thêm vào bài viết của bạn</h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      disabled={isUploading}
                    >
                      <ImageIcon className="w-6 h-6 text-green-500" />
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />

                {formData.selectedFiles.length === 0 && (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Thêm ảnh</p>
                    <p className="text-sm text-gray-500">hoặc kéo và thả</p>
                  </div>
                )}

                {formData.selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={createPreviewUrl(file) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-70 rounded-full text-white hover:bg-opacity-90 transition-all opacity-0 group-hover:opacity-100"
                            disabled={isUploading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                        disabled={isUploading}
                      >
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Thêm ảnh</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleFormChange("location", e.target.value)}
                    placeholder="Bạn đang ở đâu?"
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thiết bị</label>
                <div className="flex space-x-2">
                  {[
                    { value: "Laptop", icon: Monitor },
                    { value: "Mobile", icon: Smartphone },
                    { value: "Tablet", icon: Tablet },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleFormChange("device", value)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
                        formData.device === value
                          ? "bg-pink-100 border-pink-500 text-pink-700"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                      disabled={isUploading}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!formData.text.trim() || isUploading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    formData.text.trim() && !isUploading
                      ? "bg-pink-500 hover:bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang đăng...</span>
                    </div>
                  ) : (
                    "Đăng"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Display Posts - Cải thiện UX */}
      {[...posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((post, index) => (
          <div key={post._id || index} className="bg-white rounded-xl shadow mb-6 overflow-hidden">
            {/* Post Header */}
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">
                    {post.author?.profile?.fullName?.charAt(0) || post.author?.username?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {post.author?.profile?.fullName || post.author?.username || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Post Content - Click để mở comments */}
              <div
                className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => togglePostExpansion(post._id)}
              >
                <p className="mb-3 text-gray-800">{post.text}</p>

                {post.meta?.location && (
                  <p className="text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {post.meta.location}
                  </p>
                )}
              </div>
            </div>

            {/* Post Media */}
            {post.media && post.media.length > 0 && (
              <div className="mb-3">
                {post.media.length === 1 ? (
                  <img
                    src={post.media[0].url || "/placeholder.svg"}
                    alt="Post media"
                    className="w-full max-h-96 object-cover cursor-pointer"
                    onClick={() => togglePostExpansion(post._id)}
                  />
                ) : (
                  <div
                    className={`grid gap-1 cursor-pointer ${post.media.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}
                    onClick={() => togglePostExpansion(post._id)}
                  >
                    {post.media.slice(0, 4).map((media, mediaIndex) => (
                      <div key={mediaIndex} className="relative">
                        <img
                          src={media.url || "/placeholder.svg"}
                          alt={`Post media ${mediaIndex + 1}`}
                          className="w-full h-48 object-cover"
                        />
                        {mediaIndex === 3 && post.media.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">+{post.media.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Post Stats */}
            <div className="px-4 pb-2">
              <div className="text-sm text-gray-500 mb-1">
                Privacy: {post.privacy} • Device: {post.meta?.device}
              </div>

              <div className="text-sm text-gray-600 flex justify-between mt-2 mb-1">
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  {post.interactions?.likes || 0} lượt thích
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1 text-blue-500" />
                  {postComments[post._id]?.length || 0} bình luận
                </span>
                <span className="flex items-center">
                  <Share2 className="w-4 h-4 mr-1 text-green-500" />
                  {post.interactions?.shares || 0} lượt chia sẻ
                </span>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-around text-sm font-semibold text-gray-600">
                <button
                  onClick={() => handleLikeToggle(post._id)}
                  className={`hover:bg-gray-100 px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                    likedPosts.includes(post._id) ? "text-red-500" : ""
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.includes(post._id) ? "fill-current" : ""}`} />
                  {likedPosts.includes(post._id) ? "Đã thích" : "Thích"}
                </button>
                <button
                  onClick={() => togglePostExpansion(post._id)}
                  className="hover:bg-gray-100 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Bình luận
                </button>
                <button className="hover:bg-gray-100 px-4 py-2 rounded flex items-center gap-2 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Chia sẻ
                </button>
              </div>

              {/* Comments Section - Hiển thị khi expanded */}
              {expandedPosts[post._id] && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  {/* Comment Input */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">U</span>
                    </div>
                    <div className="flex-1 flex items-end space-x-2">
                      <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
                        <textarea
                          value={commentInputs[post._id] || ""}
                          onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                          onKeyPress={(e) => handleCommentKeyPress(e, post._id)}
                          placeholder="Viết bình luận..."
                          className="w-full bg-transparent resize-none focus:outline-none text-sm"
                          rows="1"
                          disabled={isSubmittingComment[post._id]}
                        />
                      </div>
                      <button
                        onClick={() => handleSubmitComment(post._id)}
                        disabled={!commentInputs[post._id]?.trim() || isSubmittingComment[post._id]}
                        className={`p-2 rounded-full transition-colors ${
                          commentInputs[post._id]?.trim() && !isSubmittingComment[post._id]
                            ? "text-pink-500 hover:bg-pink-50"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isSubmittingComment[post._id] ? (
                          <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  {postComments[post._id] && postComments[post._id].length > 0 && (
                    <div className="space-y-3">
                      {postComments[post._id].map((comment, commentIndex) => (
                        <div key={comment._id || commentIndex} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {comment.user?.profile?.fullName?.charAt(0) || comment.user?.username?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-100 rounded-2xl px-4 py-2">
                              <p className="font-semibold text-sm text-gray-800">
                                {comment.user?.profile?.fullName || comment.user?.username || "Người dùng"}
                              </p>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 ml-4">
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                              <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold">Thích</button>
                              <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold">
                                Phản hồi
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No comments message */}
                  {(!postComments[post._id] || postComments[post._id].length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}

export default Post
