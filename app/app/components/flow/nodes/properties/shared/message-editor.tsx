"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface MessageEditorProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
  maxLength?: number
}

export default function MessageEditor({
  value,
  onChange,
  placeholder = "Enter your message...",
  readOnly = false,
  className,
  maxLength = 500,
}: MessageEditorProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue)
      onChange?.(newValue)
    },
    [onChange],
  )

  if (readOnly) {
    return <div className={cn("whitespace-pre-wrap text-sm", className)}>{value || placeholder}</div>
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("min-h-[80px] resize-none", className)}
        maxLength={maxLength}
      />
      {maxLength && (
        <div className="text-xs text-muted-foreground text-right">
          {localValue.length}/{maxLength}
        </div>
      )}
    </div>
  )
}
