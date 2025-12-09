// WebSocket Server for Real-Time Features
const { Server } = require('socket.io')
const http = require('http')

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// Store connected users
const connectedUsers = new Map()
const rooms = new Map()

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`)

  // User joins with their info
  socket.on('user:join', (userData) => {
    connectedUsers.set(socket.id, {
      ...userData,
      socketId: socket.id,
      status: 'online',
      lastSeen: Date.now(),
    })

    // Broadcast to all users
    io.emit('presence:update', Array.from(connectedUsers.values()))
    
    console.log(`👤 User joined: ${userData.username} (${socket.id})`)
  })

  // Presence update
  socket.on('presence:update', (data) => {
    const user = connectedUsers.get(socket.id)
    if (user) {
      user.status = data.status
      user.lastSeen = Date.now()
      connectedUsers.set(socket.id, user)
      
      // Broadcast updated presence
      io.emit('presence:update', Array.from(connectedUsers.values()))
    }
  })

  // Room management
  socket.on('room:join', (data) => {
    const { roomId } = data
    socket.join(roomId)
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }
    rooms.get(roomId).add(socket.id)
    
    // Notify room members
    io.to(roomId).emit('room:user-joined', {
      socketId: socket.id,
      user: connectedUsers.get(socket.id),
      timestamp: Date.now(),
    })
    
    console.log(`🚪 User ${socket.id} joined room: ${roomId}`)
  })

  socket.on('room:leave', (data) => {
    const { roomId } = data
    socket.leave(roomId)
    
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id)
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId)
      }
    }
    
    // Notify room members
    io.to(roomId).emit('room:user-left', {
      socketId: socket.id,
      user: connectedUsers.get(socket.id),
      timestamp: Date.now(),
    })
    
    console.log(`🚪 User ${socket.id} left room: ${roomId}`)
  })

  // Notifications
  socket.on('notification:send', (data) => {
    const { userId, notification } = data
    
    // Find target user's socket
    for (const [socketId, user] of connectedUsers.entries()) {
      if (user.userId === userId) {
        io.to(socketId).emit('notification', {
          ...notification,
          timestamp: Date.now(),
        })
        break
      }
    }
    
    console.log(`📬 Notification sent to user: ${userId}`)
  })

  // Activity tracking
  socket.on('activity:track', (activity) => {
    // Broadcast activity to relevant users/rooms
    if (activity.roomId) {
      io.to(activity.roomId).emit('activity', {
        ...activity,
        user: connectedUsers.get(socket.id),
        timestamp: Date.now(),
      })
    } else {
      io.emit('activity', {
        ...activity,
        user: connectedUsers.get(socket.id),
        timestamp: Date.now(),
      })
    }
  })

  // Custom messages
  socket.on('message', (data) => {
    const { roomId, ...messageData } = data
    
    if (roomId) {
      io.to(roomId).emit('message', {
        ...messageData,
        user: connectedUsers.get(socket.id),
        timestamp: Date.now(),
      })
    } else {
      io.emit('message', {
        ...messageData,
        user: connectedUsers.get(socket.id),
        timestamp: Date.now(),
      })
    }
  })

  // Typing indicators
  socket.on('typing:start', (data) => {
    const { roomId } = data
    if (roomId) {
      socket.to(roomId).emit('typing:start', {
        user: connectedUsers.get(socket.id),
        timestamp: Date.now(),
      })
    }
  })

  socket.on('typing:stop', (data) => {
    const { roomId } = data
    if (roomId) {
      socket.to(roomId).emit('typing:stop', {
        user: connectedUsers.get(socket.id),
        timestamp: Date.now(),
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', (reason) => {
    const user = connectedUsers.get(socket.id)
    
    if (user) {
      // Remove from all rooms
      rooms.forEach((members, roomId) => {
        if (members.has(socket.id)) {
          members.delete(socket.id)
          io.to(roomId).emit('room:user-left', {
            socketId: socket.id,
            user,
            timestamp: Date.now(),
          })
        }
      })
      
      // Remove from connected users
      connectedUsers.delete(socket.id)
      
      // Broadcast updated presence
      io.emit('presence:update', Array.from(connectedUsers.values()))
      
      console.log(`❌ User disconnected: ${user.username} (${socket.id}) - Reason: ${reason}`)
    } else {
      console.log(`❌ Socket disconnected: ${socket.id} - Reason: ${reason}`)
    }
  })

  // Error handling
  socket.on('error', (error) => {
    console.error(`🔥 Socket error (${socket.id}):`, error)
  })
})

// Health check endpoint
const PORT = process.env.WS_PORT || 3001
server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════════╗
  ║                                                            ║
  ║   🚀 Bl1nkOS WebSocket Server Running!                    ║
  ║                                                            ║
  ║   Port: ${PORT}                                           
  ║   Status: ✅ Ready for connections                         ║
  ║                                                            ║
  ║   Features:                                                ║
  ║   • Real-time presence tracking                            ║
  ║   • Live notifications                                     ║
  ║   • Activity streaming                                     ║
  ║   • Room-based collaboration                               ║
  ║                                                            ║
  ╚════════════════════════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received: closing WebSocket server')
  server.close(() => {
    console.log('✅ WebSocket server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT signal received: closing WebSocket server')
  server.close(() => {
    console.log('✅ WebSocket server closed')
    process.exit(0)
  })
})
