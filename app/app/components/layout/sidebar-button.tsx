"use client"

import type React from "react"
import { TooltipProvider } from "@/components/ui/tooltip" // Import TooltipProvider

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface SidebarButtonItemProps {
  active: boolean
  onClick: () => void
  title: string
  shortcut?: string
  children: React.ReactNode
}

export default function SidebarButtonItem({ active, onClick, title, shortcut, children }: SidebarButtonItemProps) {
  return (
    <TooltipProvider>
      {" "}
      {/* Wrap Tooltip in TooltipProvider */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={active ? "default" : "ghost"}
            size="icon"
            onClick={onClick}
            className={cn("size-8 shrink-0", active && "bg-primary text-primary-foreground")}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span>{title}</span>
          {shortcut && (
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              {shortcut}
            </kbd>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
