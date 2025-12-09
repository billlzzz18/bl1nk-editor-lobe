"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import MessageEditor from "./shared/message-editor"
import type { CustomNode, MessageNodeData } from "@/types/node.types"

interface MessageNodePropertiesEditorProps {
  node: CustomNode
  onUpdate: (updates: Partial<CustomNode>) => void
}

export default function MessageNodePropertiesEditor({ node, onUpdate }: MessageNodePropertiesEditorProps) {
  const data = node.data as MessageNodeData
  const [message, setMessage] = useState(data.message || "")
  const [delay, setDelay] = useState(data.delay || 0)

  const handleMessageChange = useCallback(
    (newMessage: string) => {
      setMessage(newMessage)
      onUpdate({
        data: {
          ...data,
          message: newMessage,
        },
      })
    },
    [data, onUpdate],
  )

  const handleDelayChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDelay = Number.parseInt(e.target.value) || 0
      setDelay(newDelay)
      onUpdate({
        data: {
          ...data,
          delay: newDelay,
        },
      })
    },
    [data, onUpdate],
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message-content">Message Content</Label>
        <MessageEditor value={message} onChange={handleMessageChange} placeholder="Enter the message to display..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message-delay">Delay (milliseconds)</Label>
        <Input
          id="message-delay"
          type="number"
          value={delay}
          onChange={handleDelayChange}
          placeholder="0"
          min="0"
          step="100"
        />
        <p className="text-xs text-muted-foreground">Optional delay before showing this message</p>
      </div>
    </div>
  )
}
