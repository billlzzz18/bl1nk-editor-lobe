// React Hook for Notifications
'use client'

import { useEffect, useState } from 'react'
import notificationManager, { Notification } from '@/lib/notification-manager'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Initial load
    setNotifications(notificationManager.getAll())
    setUnreadCount(notificationManager.getUnreadCount())

    // Subscribe to changes
    const unsubscribe = notificationManager.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications)
      setUnreadCount(notificationManager.getUnreadCount())
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => notificationManager.markAsRead(id),
    markAllAsRead: () => notificationManager.markAllAsRead(),
    remove: (id: string) => notificationManager.remove(id),
    removeAll: () => notificationManager.removeAll(),
    info: notificationManager.info.bind(notificationManager),
    success: notificationManager.success.bind(notificationManager),
    warning: notificationManager.warning.bind(notificationManager),
    error: notificationManager.error.bind(notificationManager),
  }
}
