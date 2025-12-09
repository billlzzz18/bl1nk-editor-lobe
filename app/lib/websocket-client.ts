// WebSocket Client Manager for Real-Time Features
import { io, Socket } from 'socket.io-client'

export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: number
  userId?: string
}

export interface PresenceData {
  userId: string
  username: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeen: number
  avatar?: string
}

class WebSocketClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Set<Function>> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect()
    }
  }

  connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
    
    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    })

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id)
      this.reconnectAttempts = 0
      this.emit('connection', { status: 'connected' })
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason)
      this.emit('connection', { status: 'disconnected', reason })
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
      this.emit('error', error)
    })

    this.socket.on('reconnect_attempt', (attempt) => {
      this.reconnectAttempts = attempt
      console.log(`🔄 Reconnection attempt ${attempt}/${this.maxReconnectAttempts}`)
    })

    // Listen for specific events
    this.socket.on('presence:update', (data: PresenceData) => {
      this.emit('presence:update', data)
    })

    this.socket.on('notification', (data: any) => {
      this.emit('notification', data)
    })

    this.socket.on('activity', (data: any) => {
      this.emit('activity', data)
    })

    this.socket.on('message', (data: WebSocketMessage) => {
      this.emit('message', data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  send(event: string, data: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('WebSocket not connected. Message not sent.')
    }
  }

  // Presence methods
  updatePresence(status: PresenceData['status']) {
    this.send('presence:update', { status, timestamp: Date.now() })
  }

  joinRoom(roomId: string) {
    this.send('room:join', { roomId })
  }

  leaveRoom(roomId: string) {
    this.send('room:leave', { roomId })
  }

  // Notification methods
  sendNotification(userId: string, notification: any) {
    this.send('notification:send', { userId, notification })
  }

  // Activity tracking
  trackActivity(activity: any) {
    this.send('activity:track', activity)
  }

  // Event listener system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      this.listeners.get(event)?.delete(callback)
    } else {
      this.listeners.delete(event)
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocketId(): string | undefined {
    return this.socket?.id
  }
}

// Singleton instance
const wsClient = new WebSocketClient()

export default wsClient
