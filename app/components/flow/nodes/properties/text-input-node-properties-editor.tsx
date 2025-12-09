"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import MessageEditor from "./shared/message-editor"
import type { CustomNode, TextInputNodeData } from "@/types/node.types"

interface TextInputNodePropertiesEditorProps {
  node: CustomNode
  onUpdate: (updates: Partial<CustomNode>) => void
}

export default function TextInputNodePropertiesEditor({ node, onUpdate }: TextInputNodePropertiesEditorProps) {
  const data = node.data as TextInputNodeData
  const [message, setMessage] = useState(data.message || "")
  const [placeholder, setPlaceholder] = useState(data.placeholder || "")
  const [variableName, setVariableName] = useState(data.variableName || "")
  const [required, setRequired] = useState(data.required || false)
  const [minLength, setMinLength] = useState(data.minLength || "")
  const [maxLength, setMaxLength] = useState(data.maxLength || "")

  const updateData = useCallback(
    (updates: Partial<TextInputNodeData>) => {
      onUpdate({
        data: {
          ...data,
          ...updates,
        },
      })
    },
    [data, onUpdate],
  )

  const handleMessageChange = useCallback(
    (newMessage: string) => {
      setMessage(newMessage)
      updateData({ message: newMessage })
    },
    [updateData],
  )

  const handlePlaceholderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPlaceholder = e.target.value
      setPlaceholder(newPlaceholder)
      updateData({ placeholder: newPlaceholder })
    },
    [updateData],
  )

  const handleVariableNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVariableName = e.target.value
      setVariableName(newVariableName)
      updateData({ variableName: newVariableName })
    },
    [updateData],
  )

  const handleRequiredChange = useCallback(
    (checked: boolean) => {
      setRequired(checked)
      updateData({ required: checked })
    },
    [updateData],
  )

  const handleMinLengthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setMinLength(value)
      updateData({ minLength: value ? Number.parseInt(value) : undefined })
    },
    [updateData],
  )

  const handleMaxLengthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setMaxLength(value)
      updateData({ maxLength: value ? Number.parseInt(value) : undefined })
    },
    [updateData],
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="input-message">Question/Prompt</Label>
        <MessageEditor
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter the question or prompt for the user..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="input-placeholder">Placeholder Text</Label>
        <Input
          id="input-placeholder"
          value={placeholder}
          onChange={handlePlaceholderChange}
          placeholder="Type your answer here..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="variable-name">Variable Name</Label>
        <Input
          id="variable-name"
          value={variableName}
          onChange={handleVariableNameChange}
          placeholder="user_input"
          pattern="[a-zA-Z_][a-zA-Z0-9_]*"
        />
        <p className="text-xs text-muted-foreground">Variable name to store the user's input</p>
      </div>

      <div className="space-y-3">
        <Label>Validation</Label>

        <div className="flex items-center space-x-2">
          <Checkbox id="required" checked={required} onCheckedChange={handleRequiredChange} />
          <Label htmlFor="required" className="text-sm font-normal">
            Required field
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="min-length" className="text-xs">
              Min Length
            </Label>
            <Input
              id="min-length"
              type="number"
              value={minLength}
              onChange={handleMinLengthChange}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="max-length" className="text-xs">
              Max Length
            </Label>
            <Input
              id="max-length"
              type="number"
              value={maxLength}
              onChange={handleMaxLengthChange}
              placeholder="100"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
