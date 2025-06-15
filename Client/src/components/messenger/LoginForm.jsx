"use client"
import React from "react"
import { useState } from "react"
import { User, Mail, Lock, MessageCircle } from "lucide-react"

const LoginForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  // Predefined test accounts
  const testAccounts = [
    {
      id: "user_alice",
      username: "Quốc Trí",
      email: "alice@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      password: "123456",
    },
    {
      id: "user_bob",
      username: "Tiến Đạt",
      email: "bob@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      password: "123456",
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isLogin) {
      // Login logic
      const user = testAccounts.find(
        (account) => account.email === formData.email && account.password === formData.password,
      )

      if (user) {
        onLogin({
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        })
      } else {
        alert(
          "Invalid credentials! Use test accounts:\nAlice: alice@example.com\nBob: bob@example.com\nPassword: 123456",
        )
      }
    } else {
      // Register logic (simplified)
      if (formData.username && formData.email && formData.password) {
        const newUser = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          username: formData.username,
          email: formData.email,
          avatar: "/placeholder.svg?height=40&width=40",
        }
        onLogin(newUser)
      } else {
        alert("Please fill all fields!")
      }
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const loginWithTestAccount = (account) => {
    onLogin({
      id: account.id,
      username: account.username,
      email: account.email,
      avatar: account.avatar,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to ChatApp</h1>
          <p className="text-gray-600 mt-2">{isLogin ? "Sign in to your account" : "Create a new account"}</p>
        </div>

        {/* Test Accounts */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Login (Test Accounts):</h3>
          <div className="space-y-2">
            {testAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => loginWithTestAccount(account)}
                className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
              >
                <img
                  src={account.avatar || "/placeholder.svg"}
                  alt={account.username}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <div className="font-medium text-gray-900">{account.username}</div>
                  <div className="text-sm text-gray-500">{account.email}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:text-blue-600 font-medium">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default LoginForm