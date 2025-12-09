"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { ReactNode } from "react"

interface ToolbarButtonProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  variant?: "default" | "ghost" | "outline"
  size?: "sm" | "default"
  isActive?: boolean
  className?: string
}

export function ToolbarButton({
  icon,
  label,
  onClick,
  variant = "ghost",
  size = "sm",
  isActive = false,
  className = "",
}: ToolbarButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={onClick}
            className={`h-8 w-8 p-0 ${isActive ? "bg-primary text-primary-foreground" : ""} ${className}`}
            aria-label={label}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
