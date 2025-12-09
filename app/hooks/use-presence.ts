// React Hook for User Presence System
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import wsClient, { PresenceData } from '@/lib/websocket-client'

export function usePresence() {
  const { data: session } = useSession()
  const [onlineUsers, setOnlineUsers] = useState<PresenceData[]>([])
  const [currentUser, setCurrentUser] = useState<PresenceData | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user) return

    // Initialize current user
    const user: PresenceData = {
      userId: session.user.id || session.user.email || 'anonymous',
      username: session.user.name || 'Anonymous',
      status: 'online',
      lastSeen: Date.now(),
      avatar: session.user.image || undefined,
    }
    setCurrentUser(user)

    // Update presence on server
    wsClient.updatePresence('online')

    // Listen for presence updates
    const unsubscribePresence = wsClient.on('presence:update', (data: PresenceData) => {
      setOnlineUsers(prev => {
        const index = prev.findIndex(u => u.userId === data.userId)
        if (index !== -1) {
          const updated = [...prev]
          updated[index] = data
          return updated
        }
        return [...prev, data]
      })
    })

    // Listen for connection status
    const unsubscribeConnection = wsClient.on('connection', (data: any) => {
      setIsConnected(data.status === 'connected')
    })

    // Update presence every 30 seconds
    const intervalId = setInterval(() => {
      if (document.hidden) {
        wsClient.updatePresence('away')
      } else {
        wsClient.updatePresence('online')
      }
    }, 30000)

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        wsClient.updatePresence('away')
      } else {
        wsClient.updatePresence('online')
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      wsClient.updatePresence('offline')
      unsubscribePresence()
      unsubscribeConnection()
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [session])

  const updateStatus = (status: PresenceData['status']) => {
    wsClient.updatePresence(status)
    if (currentUser) {
      setCurrentUser({ ...currentUser, status, lastSeen: Date.now() })
    }
  }

  return {
    onlineUsers,
    currentUser,
    isConnected,
    updateStatus,
  }
}
