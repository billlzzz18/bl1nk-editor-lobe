// Notification Manager System
import { toast } from 'sonner'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
  duration?: number
}

export interface NotificationOptions {
  duration?: number
  persist?: boolean
  action?: Notification['action']
  icon?: React.ReactNode
  sound?: boolean
}

class NotificationManager {
  private notifications: Notification[] = []
  private listeners: Set<(notifications: Notification[]) => void> = new Set()
  private maxNotifications = 50
  private enableSound = true
  private enableDesktop = true

  constructor() {
    // Request desktop notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }

  // Show notification
  show(
    type: NotificationType,
    title: string,
    message: string,
    options?: NotificationOptions
  ): string {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
      action: options?.action,
      icon: options?.icon,
      duration: options?.duration || 5000,
    }

    // Add to internal list
    this.notifications.unshift(notification)
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications)
    }

    // Show toast notification
    this.showToast(notification, options)

    // Show desktop notification
    if (this.enableDesktop && options?.persist !== false) {
      this.showDesktopNotification(notification)
    }

    // Play sound
    if (this.enableSound && options?.sound !== false) {
      this.playSound(type)
    }

    // Notify listeners
    this.notifyListeners()

    return notification.id
  }

  // Convenience methods
  info(title: string, message: string, options?: NotificationOptions) {
    return this.show('info', title, message, options)
  }

  success(title: string, message: string, options?: NotificationOptions) {
    return this.show('success', title, message, options)
  }

  warning(title: string, message: string, options?: NotificationOptions) {
    return this.show('warning', title, message, options)
  }

  error(title: string, message: string, options?: NotificationOptions) {
    return this.show('error', title, message, options)
  }

  // Mark as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    this.notifyListeners()
  }

  // Remove notification
  remove(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId)
    this.notifyListeners()
  }

  removeAll() {
    this.notifications = []
    this.notifyListeners()
  }

  // Get notifications
  getAll(): Notification[] {
    return this.notifications
  }

  getUnread(): Notification[] {
    return this.notifications.filter(n => !n.read)
  }

  getUnreadCount(): number {
    return this.getUnread().length
  }

  // Subscribe to notifications
  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Configuration
  setEnableSound(enable: boolean) {
    this.enableSound = enable
  }

  setEnableDesktop(enable: boolean) {
    this.enableDesktop = enable
  }

  // Private methods
  private showToast(notification: Notification, options?: NotificationOptions) {
    const toastOptions = {
      duration: notification.duration,
      action: notification.action ? {
        label: notification.action.label,
        onClick: notification.action.onClick,
      } : undefined,
    }

    switch (notification.type) {
      case 'success':
        toast.success(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      case 'error':
        toast.error(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      case 'warning':
        toast.warning(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
        break
      default:
        toast(notification.title, {
          description: notification.message,
          ...toastOptions,
        })
    }
  }

  private showDesktopNotification(notification: Notification) {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return
    }

    if (Notification.permission === 'granted') {
      const n = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: notification.id,
      })

      n.onclick = () => {
        window.focus()
        n.close()
        if (notification.action) {
          notification.action.onClick()
        }
      }
    }
  }

  private playSound(type: NotificationType) {
    if (typeof window === 'undefined') return

    try {
      const audio = new Audio()
      switch (type) {
        case 'success':
          audio.src = '/sounds/success.mp3'
          break
        case 'error':
          audio.src = '/sounds/error.mp3'
          break
        case 'warning':
          audio.src = '/sounds/warning.mp3'
          break
        default:
          audio.src = '/sounds/notification.mp3'
      }
      audio.volume = 0.3
      audio.play().catch(() => {
        // Ignore errors (user interaction required)
      })
    } catch (error) {
      console.warn('Could not play notification sound:', error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications))
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Singleton instance
const notificationManager = new NotificationManager()

export default notificationManager
