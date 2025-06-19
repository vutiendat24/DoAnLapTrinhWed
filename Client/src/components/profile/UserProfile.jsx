"use client"
import React, { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, MapPin, Calendar, Users, UserPlus, UserCheck, UserX, Settings, Camera, Globe, Lock, MoreHorizontal, Send, ImageIcon, Video, Smile } from 'lucide-react'
import axios from "axios"

const UserProfile = ({ userId }) => {
  // States
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [friendshipStatus, setFriendshipStatus] = useState("none") // none, pending, friends, blocked
  const [expandedPosts, setExpandedPosts] = useState({})
  const [commentInputs, setCommentInputs] = useState({})
  const [postComments, setPostComments] = useState({})
  const [isSubmittingComment, setIsSubmittingComment] = useState({})
  const [likedPosts, setLikedPosts] = useState([])
  const [currentUserId, setCurrentUserId] = useState("")

   const storedUser = localStorage.getItem("user");
      const [presentUser, setPresentUser] = useState(storedUser ? JSON.parse(storedUser) : null);
      const presentUserId = presentUser?.id;
  // Mock data cho demo
  const mockUser = {
    _id: "685291accd056cd4fdb9fdac",
    username: "Tiến Đạt",
    email: "khachhang@gmail.com",
    avatar: "https://res.cloudinary.com/dsfgzdr5z/image/upload/v1749459249/NMCNPM/Avatar/a4awrffydayevtmliywj.jpg",
    isOnline: true,
    profile: {
      fullName: "Nguyễn Tiến Đạt",
      bio: "Yêu thích công nghệ và du lịch. Luôn tìm kiếm những trải nghiệm mới! 🚀✈️",
      friendsCount: 234,
      postsCount: 45,
      coverPhoto:"https://res.cloudinary.com/dsfgzdr5z/image/upload/v1749459249/NMCNPM/Avatar/a4awrffydayevtmliywj.jpg"
    }
  }

  const mockPosts = [
    {
      _id: "post1",
      author: {
        $oid: "685291accd056cd4fdb9fdac"
      },
      text: "Hôm nay thời tiết thật đẹp! Đi dạo công viên và chụp được những bức ảnh tuyệt vời. Cuộc sống thật tuyệt vời khi ta biết tận hưởng những khoảnh khắc nhỏ bé như thế này. 🌸✨",
      media: [
        {
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
          type: "image",
          _id: { $oid: "media1" }
        }
      ],
      interactions: {
        likes: 24,
        shares: 3,
        comments: []
      },
      privacy: "friends",
      meta: {
        location: "Công viên Thống Nhất",
        device: "Laptop",
        source: "direct"
      },
      createdAt: {
        $date: "2025-06-18T10:17:24.366Z"
      },
      updatedAt: {
        $date: "2025-06-18T10:17:24.366Z"
      }
    },
    {
      _id: "post2",
      author: {
        $oid: "685291accd056cd4fdb9fdac"
      },
      text: "Vừa hoàn thành dự án mới! Cảm ơn team đã hỗ trợ nhiệt tình. Tiếp tục phấn đấu cho những mục tiêu lớn hơn! 💪🎯",
      media: [],
      interactions: {
        likes: 18,
        shares: 2,
        comments: []
      },
      privacy: "public",
      meta: {
        location: "",
        device: "Mobile",
        source: "direct"
      },
      createdAt: {
        $date: "2025-06-17T15:30:12.123Z"
      },
      updatedAt: {
        $date: "2025-06-17T15:30:12.123Z"
      }
    }
  ]

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes} phút trước`
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`
    } else {
      return date.toLocaleDateString("vi-VN")
    }
  }

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case "public":
        return <Globe className="h-3 w-3" />
      case "friends":
        return <Users className="h-3 w-3" />
      case "private":
        return <Lock className="h-3 w-3" />
      default:
        return <Users className="h-3 w-3" />
    }
  }

  const getPrivacyText = (privacy) => {
    switch (privacy) {
      case "public":
        return "Công khai"
      case "friends":
        return "Bạn bè"
      case "private":
        return "Riêng tư"
      default:
        return "Bạn bè"
    }
  }

  // Effects
  useEffect(() => {
    const loadUserInfo = async() => {
        const userInfo = await axios.get(`http://localhost:5000/api/profile/user/${userId}?presentUserId=${presentUserId}`);
        setUser(userInfo.data);
        const posts = await axios.get(`http://localhost:5000/posts/mypost/${userId}`);
        setPosts(posts.data.posts);

    }
    loadUserInfo()
    setLoading(true)
    setTimeout(() => {
      // setUser(mockUser);
      setCurrentUserId("current-user-id")
      setFriendshipStatus("none") // Simulate not friends yet
      setLoading(false)
    }, 1000)

    // Load liked posts from localStorage
    const savedLikedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]")
    setLikedPosts(savedLikedPosts)
  }, [userId])

  // Friendship functions
  const handleSendFriendRequest = async () => {
    try {
      setFriendshipStatus("pending")
      // Simulate API call
      // await axios.post(`/api/friends/request`, { userId: user._id })
      console.log("Friend request sent to:", user.username)
    } catch (error) {
      console.error("Error sending friend request:", error)
      setFriendshipStatus("none")
    }
  }

  const handleCancelFriendRequest = async () => {
    try {
      setFriendshipStatus("none")
      // await axios.delete(`/api/friends/request/${user._id}`)
      console.log("Friend request cancelled")
    } catch (error) {
      console.error("Error cancelling friend request:", error)
    }
  }

  const handleAcceptFriendRequest = async () => {
    try {
      setFriendshipStatus("friends")
      // await axios.put(`/api/friends/accept/${user._id}`)
      console.log("Friend request accepted")
    } catch (error) {
      console.error("Error accepting friend request:", error)
    }
  }

  const handleUnfriend = async () => {
    try {
      setFriendshipStatus("none")
      // await axios.delete(`/api/friends/${user._id}`)
      console.log("Unfriended user")
    } catch (error) {
      console.error("Error unfriending user:", error)
    }
  }

  // Post interaction functions
  const togglePostExpansion = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const handleLikeToggle = async (postId) => {
    const hasLiked = likedPosts.includes(postId)
    const action = hasLiked ? "unlike" : "like"

    try {
      // Simulate API call
      // const res = await axios.put(`/api/posts/${postId}/like`, { action })
      
      // Update local state
      const updatedLikedPosts = hasLiked 
        ? likedPosts.filter((id) => id !== postId) 
        : [...likedPosts, postId]

      setLikedPosts(updatedLikedPosts)
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts))

      // Update posts
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId 
            ? { 
                ...post, 
                interactions: { 
                  ...post.interactions, 
                  likes: hasLiked ? post.interactions.likes - 1 : post.interactions.likes + 1 
                } 
              } 
            : post
        )
      )
    } catch (err) {
      console.error("Like toggle error:", err)
    }
  }

  const handleSubmitComment = async (postId) => {
    const commentContent = commentInputs[postId]?.trim()
    if (!commentContent) return

    setIsSubmittingComment((prev) => ({ ...prev, [postId]: true }))

    try {
      // Simulate API call
      const newComment = {
        _id: `comment-${Date.now()}`,
        content: commentContent,
        user: {
          _id: currentUserId,
          username: "Bạn",
          avatar: "/placeholder.svg"
        },
        createdAt: new Date().toISOString()
      }

      // Update comments
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }))

      // Reset input
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }))
    } catch (error) {
      console.error("Error submitting comment:", error)
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

  // Render friendship button
  const renderFriendshipButton = () => {
    if (currentUserId === user?._id) {
      return (
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Settings className="w-4 h-4" />
          Chỉnh sửa trang cá nhân
        </button>
      )
    }

    switch (friendshipStatus) {
      case "none":
        return (
          <button
            onClick={handleSendFriendRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Kết bạn
          </button>
        )
      case "pending":
        return (
          <button
            onClick={handleCancelFriendRequest}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <UserX className="w-4 h-4" />
            Hủy lời mời
          </button>
        )
      case "friends":
        return (
          <div className="flex gap-2">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <UserCheck className="w-4 h-4" />
              Bạn bè
            </button>
            <button
              onClick={handleUnfriend}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <UserX className="w-4 h-4" />
            </button>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải trang cá nhân...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy người dùng</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo & Profile Header */}
      <div className="bg-white shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-80 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
          {user.profile?.coverPhoto && (
            <img
              src={user.profile.coverPhoto || "/placeholder.svg"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-amber-50 bg-opacity-20"></div>
        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.username}
                  className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {user.isOnline && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                )}
                {currentUserId === user._id && (
                  <button className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.profile?.fullName || user.username}
                </h1>
                <p className="text-gray-600 mb-3 max-w-md">
                  {user.profile?.bio || "Chưa có tiểu sử"}
                </p>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 mb-4">
                  {user.profile?.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.profile.location}</span>
                    </div>
                  )}
                  
                </div>

                <div className="flex justify-center sm:justify-start gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-900">{user.profile?.postsCount || 0}</div>
                    <div className="text-gray-500">Bài viết</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-900">{user.profile?.friendsCount || 0}</div>
                    <div className="text-gray-500">Bạn bè</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {renderFriendshipButton()}
               
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Giới thiệu</h3>
              <div className="space-y-3">
                {user.profile?.bio && (
                  <p className="text-gray-700">{user.profile.bio}</p>
                )}
                {user.profile?.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Sống tại {user.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Tham gia vào {new Date(user.profile?.joinDate || Date.now()).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{user.profile?.friendsCount || 0} bạn bè</span>
                </div>
              </div>
            </div>

          
          </div>

          {/* Right Content - Posts */}
          <div className="lg:col-span-2">
            {/* Posts Header */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Bài viết của {user.profile?.fullName || user.username}</h2>
              <div className="text-sm text-gray-500">
                {posts.length} bài viết • Sắp xếp theo thời gian
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
                  <p className="text-gray-500">
                    {currentUserId === user._id 
                      ? "Hãy chia sẻ khoảnh khắc đầu tiên của bạn!" 
                      : `${user.username} chưa chia sẻ bài viết nào.`}
                  </p>
                </div>
              ) : (
                [...posts]
                  .sort((a, b) => new Date(b.createdAt.$date) - new Date(a.createdAt.$date))
                  .map((post, index) => (
                    <div key={post._id || index} className="bg-white rounded-xl shadow overflow-hidden">
                      {/* Post Header */}
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{user.profile?.fullName || user.username}</h3>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <span>{formatDate(post.createdAt.$date)}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                {getPrivacyIcon(post.privacy)}
                                <span>{getPrivacyText(post.privacy)}</span>
                              </div>
                              {post.meta?.device && (
                                <>
                                  <span>•</span>
                                  <span>{post.meta.device}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>

                        {/* Post Content */}
                        <div
                          className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                          onClick={() => togglePostExpansion(post._id)}
                        >
                          <p className="text-gray-800 mb-3">{post.text}</p>
                          {post.meta?.location && (
                            <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {post.meta.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Post Media */}
                      {post.media && post.media.length > 0 && (
                        <div className="mb-4">
                          {post.media.length === 1 ? (
                            <img
                              src={post.media[0].url || "/placeholder.svg"}
                              alt="Post media"
                              className="w-full max-h-96 object-cover cursor-pointer"
                              onClick={() => togglePostExpansion(post._id)}
                            />
                          ) : (
                            <div
                              className={`grid gap-1 cursor-pointer ${
                                post.media.length === 2 ? "grid-cols-2" : "grid-cols-2"
                              }`}
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

                      {/* Post Stats & Actions */}
                      <div className="px-6 pb-4">
                        <div className="text-sm text-gray-600 flex justify-between mb-3">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            {post.interactions?.likes || 0} lượt thích
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            {postComments[post._id]?.length || 0} bình luận
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4 text-green-500" />
                            {post.interactions?.shares || 0} lượt chia sẻ
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-gray-200 pt-3 flex justify-around text-sm font-semibold text-gray-600">
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

                        {/* Comments Section */}
                        {expandedPosts[post._id] && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            {/* Comment Input */}
                            <div className="flex items-start space-x-3 mb-4">
                              <img
                                src="/placeholder.svg"
                                alt="Your avatar"
                                className="w-8 h-8 rounded-full object-cover"
                              />
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
                                      ? "text-blue-500 hover:bg-blue-50"
                                      : "text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  {isSubmittingComment[post._id] ? (
                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Send className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Comments List */}
                            {postComments[post._id] && postComments[post._id].length > 0 ? (
                              <div className="space-y-3">
                                {postComments[post._id].map((comment, commentIndex) => (
                                  <div key={comment._id || commentIndex} className="flex items-start space-x-3">
                                    <img
                                      src={comment.user?.avatar || "/placeholder.svg"}
                                      alt={comment.user?.username}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                        <p className="font-semibold text-sm text-gray-800">
                                          {comment.user?.username || "Người dùng"}
                                        </p>
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                      </div>
                                      <div className="flex items-center space-x-4 mt-1 ml-4">
                                        <span className="text-xs text-gray-500">
                                          {formatDate(comment.createdAt)}
                                        </span>
                                        <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold">
                                          Thích
                                        </button>
                                        <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold">
                                          Phản hồi
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile