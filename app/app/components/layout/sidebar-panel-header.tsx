"use client"

import type { LucideIcon } from "lucide-react"

interface SidebarPanelHeaderProps {
  title: string
  icon: LucideIcon
}

export default function SidebarPanelHeader({ title, icon: Icon }: SidebarPanelHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
      <Icon className="size-4" />
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
  )
}
