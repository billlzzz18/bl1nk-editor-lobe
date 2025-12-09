"use client"

import { cn } from "@/lib/utils"

interface LogoMarkProps {
  className?: string
}

export default function LogoMark({ className }: LogoMarkProps) {
  return <div className={cn("font-bold text-lg flex items-center justify-center", className)}>CF</div>
}
