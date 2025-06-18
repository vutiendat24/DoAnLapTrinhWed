import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express()
const PORT = process.env.PORT || 3001
const server = http.createServer(app)


const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
    credentials: true,
  },
})

import connectDB from '../src/config/mongo.js';
import authRoutes from '../src/routes/auth.js';
import messageRoutes from '../src/routes/chat.js';

import userRoutes from '../src/routes/users.js'

connectDB()
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json())


app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', messageRoutes);

// Store connected users: Map<socketId, { userId, username, socketId, avatar }>
const connectedUsers = new Map()
app.set('io', io);
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id)

  socket.on("join", (userData) => {
    const { userId, username } = userData

    connectedUsers.set(socket.id, {
      userId,
      username,
      socketId: socket.id,
      avatar: `/placeholder.svg?height=32&width=32`,
    })

    socket.join(userId) // join room = userId

    // console.log(`👤 ${username} joined with ID: ${userId}`)

    io.emit("users_list", Array.from(connectedUsers.values()))
    socket.broadcast.emit("user_joined", {
      userId,
      username,
      socketId: socket.id,
    })
  })

  socket.on("private_message", (data) => {
    const { recipientId, message, messageType, timestamp } = data
    const sender = connectedUsers.get(socket.id)

    if (sender) {
      io.to(recipientId).emit("private_message", {
        senderId: sender.userId,
        senderInfo: {
          username: sender.username,
          avatar: sender.avatar,
        },
        message,
        messageType,
        timestamp,
      })

      // io.to(sender.userId).emit("private_message", {
      //   senderId: sender.userId,
      //   senderInfo: {
      //     username: sender.username,
      //     avatar: sender.avatar,
      //   },
      //   message,
      //   messageType,
      //   timestamp,
      // });
      console.log(`✉️ Message from ${sender.username} to ${recipientId}: ${message}`)
    }
  })

  socket.on("typing", (data) => {
    const { recipientId, isTyping } = data
    const sender = connectedUsers.get(socket.id)

    if (sender) {
      io.to(recipientId).emit("user_typing", {
        senderId: sender.userId,
        senderInfo: {
          username: sender.username,
          avatar: sender.avatar,
        },
        isTyping,
      })
    }
  })

  // ==== WebRTC signaling ====
  socket.on("call_offer", (data) => {
    const { recipientId, offer, callType, callerInfo } = data
    console.log(`📞 Call offer from ${callerInfo.name} to ${recipientId}`)
    io.to(recipientId).emit("call_offer", {
      offer,
      callType,
      callerInfo,
    })
  })

  socket.on("call_answer", (data) => {
    const { callerId, answer } = data
    console.log(`📲 Call answered by ${callerId}`)
    io.to(callerId).emit("call_answer", { answer })
  })

  socket.on("ice_candidate", (data) => {
    const { recipientId, candidate } = data
    io.to(recipientId).emit("ice_candidate", { candidate })
  })

  socket.on("call_rejected", ({ callerId }) => {
    console.log(`🚫 Call rejected`)
    io.to(callerId).emit("call_rejected")
  })

socket.on("call_ended", (data) => {
  const sender = connectedUsers.get(socket.id)
  const recipientId = data?.recipientId

  if (!recipientId) {
    console.warn("⚠️ call_ended event missing recipientId")
    return
  }

  console.log(`📴 Call ended by ${sender?.username || socket.id}`)

  io.to(recipientId).emit("call_ended", {
    senderId: sender?.userId || socket.id,
  })
})


  // ==== File sharing ====
  socket.on("share_file", (data) => {
    const { recipientId, fileData, fileName, fileType } = data
    const sender = connectedUsers.get(socket.id)

    if (sender) {
      io.to(recipientId).emit("file_received", {
        senderId: sender.userId,
        senderInfo: {
          username: sender.username,
          avatar: sender.avatar,
        },
        fileData,
        fileName,
        fileType,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // ==== Disconnection ====
  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id)
    if (user) {
      console.log(`❌ ${user.username} disconnected`)
      connectedUsers.delete(socket.id)

      socket.broadcast.emit("user_left", {
        userId: user.userId,
        username: user.username,
      })

      io.emit("users_list", Array.from(connectedUsers.values()))
    }
  })
})



server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 Socket.IO signaling server ready`)
})
