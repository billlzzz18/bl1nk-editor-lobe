"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
}

const mockFileTree: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Button.tsx", type: "file" },
          { name: "Input.tsx", type: "file" },
        ],
      },
      { name: "App.tsx", type: "file" },
      { name: "index.tsx", type: "file" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [{ name: "logo.svg", type: "file" }],
  },
  { name: "package.json", type: "file" },
  { name: "tsconfig.json", type: "file" },
]

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth === 0)

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent/50"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" ? (
          <>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {isOpen ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="h-4 w-4 text-muted-foreground" />
          </>
        )}
        <span className="text-foreground truncate">{node.name}</span>
      </div>
      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeNode key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileExplorer() {
  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Explorer</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {mockFileTree.map((node, index) => (
            <FileTreeNode key={index} node={node} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
