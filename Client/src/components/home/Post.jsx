"use client"
import React from "react"
import { useState, useRef } from "react"
import { ImageIcon, Video, Smile, MapPin, X, Smartphone, Monitor, Tablet, Plus, Upload } from "lucide-react"
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

  // Lấy userId từ token
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);

      const uid = decoded.userId;
      setUserId(uid);

      // Cập nhật dữ liệu form mặc định
      setFormData({
        author: uid,
        text: "",
        selectedFiles: [],
        privacy: "friends",
        location: "",
        device: "Laptop",
        source: "direct",
      });

      // Gọi API lấy tất cả bài viết của user
      const fetchPostsByUser = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/posts/author/${uid}`);
          setPosts(response.data.posts || []);
        } catch (error) {
          console.error("Lỗi khi lấy bài viết người dùng:", error);
        }
      };

      fetchPostsByUser();

    } catch (error) {
      console.error("Không thể giải mã token:", error);
    }
  }
}, []);

  
 

  if (!formData) return null

  const handleLikeToggle = async (postId) => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    const hasLiked = likedPosts.includes(postId);

    const action = hasLiked ? "unlike" : "like";

    try {
      const res = await axios.put(`http://localhost:5000/posts/${postId}/like`, { action });

      const updatedLikes = res.data.interactions.likes;

      // Cập nhật trạng thái đã like trong localStorage
      const updatedLikedPosts = hasLiked
        ? likedPosts.filter(id => id !== postId)
        : [...likedPosts, postId];
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));

      // Cập nhật UI
      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, likes: updatedLikes }
            : post
        )
      );
    } catch (err) {
      console.error("Like toggle error:", err);
    }
  };


  // Mở modal
  const handleOpenPostModal = () => setShowPostModal(true)

  // Đóng modal và reset form
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

  // Thay đổi nội dung form
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Chọn file từ input
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

  // Xoá ảnh đã chọn
  const removeFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      selectedFiles: prev.selectedFiles.filter((_, index) => index !== indexToRemove),
    }))
  }

  // Drag & Drop
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
  // Tạo preview URL từ File object
  const createPreviewUrl = (file) => {
    return URL.createObjectURL(file)
  }

  // Tạo bài viết
  const handleSubmitPost = async (e) => {
    e.preventDefault()
    console.log(formData.author)
    if (!formData.author) {
      alert("Không tìm thấy thông tin người dùng!")
      return
    }

    if (!formData.text.trim()) {
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
        uploadData.append("media", file) // ✅ không dùng "media[]"
      })

      const response = await axios.post("http://localhost:5000/posts/create", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Post created successfully:", response.data)
      alert("Tạo bài viết thành công!")
      setPosts((prev) => [response.data.post, ...prev])
    } catch (error) {
      console.error("Error creating post:", error)
      alert(error.response?.data?.message || "Đã có lỗi xảy ra khi tạo bài viết!")
    } finally {
      setIsUploading(false)
      handleClosePostModal()
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 sm:px-0">
      {/* Create Post */}
      <div className="bg-white rounded-xl shadow mb-6">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">A</span>
            </div>
            <button
              onClick={handleOpenPostModal}
              className="bg-gray-100 hover:bg-gray-200 rounded-full py-2.5 px-4 flex-1 focus:outline-none focus:ring-pink-500 transition-colors text-left text-gray-500"
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

      {/* Post Creation Modal */}
      {showPostModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClosePostModal}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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

            {/* Modal Body - Form */}
            <form onSubmit={handleSubmitPost} className="p-4 space-y-4">
              {/* Author Info */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">A</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Nguyễn Văn A</h3>
                  <select
                    value={formData.privacy}
                    onChange={(e) => handleFormChange("privacy", e.target.value)}
                    className="mt-1 text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 border-0 focus:ring-pink-500"
                    disabled={isUploading}
                  >
                    <option value="public">🌍 Công khai</option>
                    <option value="friends">👥 Bạn bè</option>
                    <option value="private">🔒 Chỉ mình tôi</option>
                  </select>
                </div>
              </div>

              {/* Main Text Content */}
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

              {/* Photo Upload Section */}
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

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />

                {/* Drop Zone */}
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

                {/* Selected Images Preview */}
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
                          <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name}
                          </div>
                        </div>
                      ))}

                      {/* Add More Button */}
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

                    <p className="text-sm text-gray-500">Đã chọn {formData.selectedFiles.length} ảnh</p>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleFormChange("location", e.target.value)}
                    placeholder="Bạn đang ở đâu?"
                    className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-pink-500"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Device Selection */}
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

              {/* Submit Button */}
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

      {/* Display Posts */}
      {[...posts]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((post, index) => (
    <div key={post._id || index} className="bg-white rounded-xl shadow mb-6">
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
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <p className="mb-3 text-gray-800">{post.text}</p>

        {post.meta?.location && (
          <p className="text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 inline mr-1" />
            {post.meta.location}
          </p>
        )}
      </div>

      {post.media && post.media.length > 0 && (
        <div className="mb-3">
          {post.media.length === 1 ? (
            <img
              src={post.media[0].url || "/placeholder.svg"}
              alt="Post media"
              className="w-full max-h-96 object-cover"
            />
          ) : (
            <div className={`grid gap-1 ${post.media.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}>
              {post.media.slice(0, 4).map((media, mediaIndex) => (
                <div key={mediaIndex} className="relative">
                  <img
                    src={media.url || "/placeholder.svg"}
                    alt={`Post media ${mediaIndex + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  {mediaIndex === 3 && post.media.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        +{post.media.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="px-4 pb-2">
        <div className="text-sm text-gray-500 mb-1">
          Privacy: {post.privacy} • Device: {post.meta?.device}
        </div>

        {/* Hiển thị tổng số tương tác */}
        <div className="text-sm text-gray-600 flex justify-between mt-2 mb-1">
          <span>❤️ {post.interactions.likes || 0} lượt thích</span>
          <span>💬 {post.interactions.comments || 0} bình luận</span>
          <span>🔁 {post.interactions.shares || 0} lượt chia sẻ</span>
        </div>

        {/* Giao diện các nút tương tác giống Facebook */}
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-around text-sm font-semibold text-gray-600">
          <button
            onClick={handleLikeToggle}
            className="hover:bg-gray-100 px-4 py-2 rounded flex items-center gap-1"
          >
            {JSON.parse(localStorage.getItem("likedPosts") || "[]").includes(post._id)
              ? "💔 Bỏ thích"
              : "❤️ Thích"}{" "}
          </button>
          <button
            onClick={() => console.log("Comment post:", post._id)}
            className="hover:bg-gray-100 px-4 py-2 rounded flex items-center gap-1"
          >
            💬 Bình luận
          </button>
          <button
            onClick={() => console.log("Share post:", post._id)}
            className="hover:bg-gray-100 px-4 py-2 rounded flex items-center gap-1"
          >
            🔁 Chia sẻ
          </button>
        </div>
      </div>
    </div>
))}

    </div>
  )
}

export default Post
