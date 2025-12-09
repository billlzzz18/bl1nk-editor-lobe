// User Presence Indicator Component
'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { PresenceData } from '@/lib/websocket-client'

interface PresenceIndicatorProps {
  users: PresenceData[]
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PresenceIndicator({
  users,
  maxDisplay = 5,
  size = 'md',
  className,
}: PresenceIndicatorProps) {
  const displayedUsers = users.slice(0, maxDisplay)
  const remainingCount = users.length - maxDisplay

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }

  const getStatusColor = (status: PresenceData['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: PresenceData['status']) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'away':
        return 'Away'
      case 'busy':
        return 'Busy'
      default:
        return 'Offline'
    }
  }

  if (users.length === 0) {
    return null
  }

  return (
    <div className={cn('flex items-center', className)}>
      <TooltipProvider>
        <div className="flex -space-x-2">
          {displayedUsers.map((user, index) => (
            <Tooltip key={user.userId}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0, x: -20 }}
                  animate={{ scale: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <Avatar
                    className={cn(
                      sizeClasses[size],
                      'border-2 border-background cursor-pointer hover:z-10 transition-all hover:scale-110'
                    )}
                  >
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="text-xs">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Status indicator */}
                  <span
                    className={cn(
                      'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
                      getStatusColor(user.status),
                      size === 'sm' && 'h-2 w-2',
                      size === 'md' && 'h-2.5 w-2.5',
                      size === 'lg' && 'h-3 w-3'
                    )}
                  />
                </motion.div>
              </TooltipTrigger>
              
              <TooltipContent>
                <div className="text-center">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {getStatusLabel(user.status)}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}

          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: maxDisplay * 0.05 }}
                >
                  <div
                    className={cn(
                      sizeClasses[size],
                      'flex items-center justify-center rounded-full border-2 border-background bg-muted cursor-pointer hover:bg-muted/80 transition-colors'
                    )}
                  >
                    <span className="text-xs font-semibold">
                      +{remainingCount}
                    </span>
                  </div>
                </motion.div>
              </TooltipTrigger>
              
              <TooltipContent>
                <p>{remainingCount} more {remainingCount === 1 ? 'person' : 'people'} online</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>

      {users.length > 0 && (
        <span className="ml-3 text-sm text-muted-foreground">
          {users.length} online
        </span>
      )}
    </div>
  )
}

// Compact version for navbar
export function PresenceIndicatorCompact({ users }: { users: PresenceData[] }) {
  const onlineCount = users.filter(u => u.status === 'online').length

  if (users.length === 0) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
            {onlineCount} online
          </Badge>
        </TooltipTrigger>
        
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold mb-2">Online Users</p>
            {users.slice(0, 10).map(user => (
              <div key={user.userId} className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    user.status === 'online' ? 'bg-green-500' :
                    user.status === 'away' ? 'bg-yellow-500' :
                    user.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                  )}
                />
                <span>{user.username}</span>
              </div>
            ))}
            {users.length > 10 && (
              <p className="text-xs text-muted-foreground pt-1">
                +{users.length - 10} more
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
