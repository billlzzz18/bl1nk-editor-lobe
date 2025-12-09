"use client"
import { Moon, Sun } from "lucide-react"
import { ToolbarButton } from "./toolbar-button"

interface SettingsBarProps {
  theme: string | undefined
  onThemeChange: (theme: string) => void
}

export function SettingsBar({ theme, onThemeChange }: SettingsBarProps) {
  return (
    <div className="border-t border-border bg-card px-4 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Settings</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-md p-1 bg-muted/20">
            <ToolbarButton
              icon={<Sun className="h-3.5 w-3.5" />}
              label="Light theme"
              onClick={() => onThemeChange("light")}
              isActive={theme === "light"}
              variant="ghost"
              size="sm"
            />
            <ToolbarButton
              icon={<Moon className="h-3.5 w-3.5" />}
              label="Dark theme"
              onClick={() => onThemeChange("dark")}
              isActive={theme === "dark"}
              variant="ghost"
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
