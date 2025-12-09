import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Terminal, 
  Play, 
  Square, 
  RefreshCw, 
  Trash2,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { useSkillsStore } from "@/stores/skills-store"

export const ContainerTerminal: React.FC = () => {
  const {
    activeContainers,
    isExecuting,
    executeInContainer,
    stopContainer,
    deleteContainer,
  } = useSkillsStore()
  
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null)
  const [command, setCommand] = useState("")
  const [output, setOutput] = useState<string[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const containers = Array.from(activeContainers.values())
  const selectedContainer = selectedContainerId ? activeContainers.get(selectedContainerId) : null

  useEffect(() => {
    if (containers.length > 0 && !selectedContainerId) {
      setSelectedContainerId(containers[0].id)
    }
  }, [containers, selectedContainerId])

  useEffect(() => {
    if (selectedContainer && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [selectedContainer, output])

  useEffect(() => {
    if (selectedContainer?.output) {
      setOutput(prev => [...prev, selectedContainer.output!])
    }
  }, [selectedContainer?.output])

  const handleExecuteCommand = async () => {
    if (!command.trim() || !selectedContainerId || isExecuting) return

    const currentCommand = command.trim()
    setCommand("")
    
    // Add command to output
    setOutput(prev => [...prev, `$ ${currentCommand}`])
    
    try {
      const result = await executeInContainer(selectedContainerId, currentCommand)
      
      if (result.success) {
        if (result.output) {
          setOutput(prev => [...prev, result.output!])
        }
        if (result.files && result.files.length > 0) {
          setOutput(prev => [...prev, `\nGenerated files:`])
          result.files.forEach(file => {
            setOutput(prev => [...prev, `  📄 ${file.name} (${file.type})`])
          })
        }
      } else {
        setOutput(prev => [...prev, `Error: ${result.error}`])
      }
    } catch (error) {
      setOutput(prev => [...prev, `Execution failed: ${error instanceof Error ? error.message : "Unknown error"}`])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleExecuteCommand()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      case "creating":
        return <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
      case "error":
        return <AlertCircle className="w-3 h-3 text-red-500" />
      case "completed":
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case "stopped":
        return <Square className="w-3 h-3 text-gray-500" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500"
      case "creating": return "bg-blue-500"
      case "error": return "bg-red-500"
      case "completed": return "bg-green-500"
      case "stopped": return "bg-gray-500"
      default: return "bg-gray-400"
    }
  }

  const clearOutput = () => {
    setOutput([])
  }

  const copyOutput = () => {
    const outputText = output.join("\n")
    navigator.clipboard.writeText(outputText)
  }

  const downloadOutput = () => {
    const outputText = output.join("\n")
    const blob = new Blob([outputText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `container-output-${selectedContainerId?.slice(0, 8)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (containers.length === 0) {
    return (
      <div className="h-96 border rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Terminal className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Containers</h3>
          <p className="text-sm text-gray-600">
            Create a container to start executing skills
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-96 border rounded-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-sm">Container Terminal</h3>
          {selectedContainer && (
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedContainer.status)}
              <span className="text-xs text-gray-600">
                {selectedContainer.id.slice(0, 8)}...
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(selectedContainer.status)} text-white border-0`}
              >
                {selectedContainer.status}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearOutput}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={copyOutput}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={downloadOutput}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Container Selector */}
      {containers.length > 1 && (
        <div className="flex items-center gap-2 p-2 border-b bg-gray-50 overflow-x-auto">
          {containers.map((container) => (
            <Button
              key={container.id}
              variant={selectedContainerId === container.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedContainerId(container.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {getStatusIcon(container.status)}
              {container.id.slice(0, 8)}...
            </Button>
          ))}
        </div>
      )}

      {/* Terminal Output */}
      <ScrollArea className="flex-1 p-3 bg-black text-green-400 font-mono text-sm" ref={scrollAreaRef}>
        <div className="space-y-1">
          {output.length === 0 ? (
            <div className="text-gray-500">
              <div className="text-gray-400">Container terminal ready...</div>
              <div className="text-gray-400">Type commands below to execute skills.</div>
            </div>
          ) : (
            output.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line}
              </div>
            ))
          )}
          
          {isExecuting && (
            <div className="flex items-center gap-2 text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Command Input */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>$</span>
          </div>
          <Input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter skill command..."
            className="flex-1 bg-white border-gray-200"
            disabled={!selectedContainer || isExecuting}
          />
          <Button
            onClick={handleExecuteCommand}
            disabled={!selectedContainer || !command.trim() || isExecuting}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run
          </Button>
        </div>
        
        {/* Quick Commands */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">Quick commands:</span>
          {["help", "list-skills", "status", "clear"].map((cmd) => (
            <Button
              key={cmd}
              variant="ghost"
              size="sm"
              onClick={() => setCommand(cmd)}
              className="text-xs h-6 px-2"
              disabled={!selectedContainer || isExecuting}
            >
              {cmd}
            </Button>
          ))}
        </div>
      </div>

      {/* Container Actions */}
      {selectedContainer && (
        <div className="flex items-center justify-between p-2 border-t bg-gray-50 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>Skills: {selectedContainer.skills.length}</span>
            <span>Created: {new Date(selectedContainer.created_at).toLocaleTimeString()}</span>
            <span>Last Activity: {new Date(selectedContainer.last_activity).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => stopContainer(selectedContainer.id)}
              disabled={selectedContainer.status !== "running"}
            >
              <Square className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteContainer(selectedContainer.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Terminal Help Component
export const TerminalHelp: React.FC = () => {
  const commands = [
    {
      command: "help",
      description: "Show available commands",
      usage: "help"
    },
    {
      command: "list-skills",
      description: "List loaded skills",
      usage: "list-skills"
    },
    {
      command: "execute",
      description: "Execute a specific skill",
      usage: "execute <skill-name> [params]"
    },
    {
      command: "status",
      description: "Show container status",
      usage: "status"
    },
    {
      command: "clear",
      description: "Clear terminal output",
      usage: "clear"
    },
    {
      command: "env",
      description: "Show environment variables",
      usage: "env"
    },
    {
      command: "logs",
      description: "Show skill execution logs",
      usage: "logs [skill-name]"
    },
    {
      command: "download",
      description: "Download generated files",
      usage: "download [file-name]"
    }
  ]

  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
      <h3 className="text-green-400 font-bold mb-3">Available Commands:</h3>
      <div className="space-y-2">
        {commands.map((cmd) => (
          <div key={cmd.command} className="flex justify-between items-start">
            <div className="flex-1">
              <span className="text-yellow-400">{cmd.command}</span>
              <span className="text-gray-400 ml-2">{cmd.description}</span>
            </div>
            <div className="text-blue-400 text-xs">
              {cmd.usage}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
