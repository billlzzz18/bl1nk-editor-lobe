"use client"

import { useState, useCallback } from "react"
import { Label } from "@/components/ui/label"
import MessageEditor from "./shared/message-editor"
import type { CustomNode, StartNodeData } from "@/types/node.types"

interface StartNodePropertiesEditorProps {
  node: CustomNode
  onUpdate: (updates: Partial<CustomNode>) => void
}

export default function StartNodePropertiesEditor({ node, onUpdate }: StartNodePropertiesEditorProps) {
  const data = node.data as StartNodeData
  const [message, setMessage] = useState(data.message || "")

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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="start-message">Welcome Message</Label>
        <MessageEditor
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter a welcome message to start the conversation..."
        />
      </div>
    </div>
  )
}
