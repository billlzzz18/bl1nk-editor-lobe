"use client"

import type React from "react"

import { memo, useState } from "react"
import { Play, Square, MessageCircle, Bug, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useFlowStore } from "@/contexts/flow-context"
import { useSimulationStore } from "@/contexts/simulation-context"
import { cn } from "@/lib/utils"

const SimulationPanel = memo(function SimulationPanel() {
  const [inputValue, setInputValue] = useState("")
  const [activeTab, setActiveTab] = useState("chat")

  // Flow state
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)

  // Simulation state
  const status = useSimulationStore((state) => state.status)
  const chatHistory = useSimulationStore((state) => state.chatHistory)
  const debugMessages = useSimulationStore((state) => state.debugMessages)
  const variables = useSimulationStore((state) => state.variables)
  const error = useSimulationStore((state) => state.error)

  // Simulation actions
  const startSimulation = useSimulationStore((state) => state.startSimulation)
  const stopSimulation = useSimulationStore((state) => state.stopSimulation)
  const submitInput = useSimulationStore((state) => state.submitInput)
  const clearError = useSimulationStore((state) => state.clearError)

  const handleStart = () => {
    if (nodes.length === 0) {
      alert("Please add some nodes to your flow first!")
      return
    }
    startSimulation()
    setActiveTab("chat")
  }

  const handleStop = () => {
    stopSimulation()
    setInputValue("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && status === "waiting-for-input") {
      submitInput(inputValue.trim())
      setInputValue("")
    }
  }

  const canStart = status === "idle" && nodes.length > 0
  const canStop = status !== "idle"
  const showInput = status === "waiting-for-input"

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <Button onClick={handleStart} disabled={!canStart} size="sm" className="flex-1">
          <Play className="size-4 mr-2" />
          Start
        </Button>
        <Button onClick={handleStop} disabled={!canStop} variant="outline" size="sm" className="flex-1 bg-transparent">
          <Square className="size-4 mr-2" />
          Stop
        </Button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <Badge
          variant={
            status === "idle"
              ? "secondary"
              : status === "error"
                ? "destructive"
                : status === "completed"
                  ? "default"
                  : "outline"
          }
        >
          {status === "idle" && "Ready"}
          {status === "running" && "Running"}
          {status === "waiting-for-input" && "Waiting for input"}
          {status === "completed" && "Completed"}
          {status === "error" && "Error"}
        </Badge>
        {status === "running" && <div className="size-2 bg-green-500 rounded-full animate-pulse" />}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={clearError} variant="ghost" size="sm">
              <RotateCcw className="size-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Tabs - takes remaining space */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageCircle className="size-3" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-1">
            <Bug className="size-3" />
            Debug
          </TabsTrigger>
          <TabsTrigger value="variables" className="flex items-center gap-1">
            Variables
          </TabsTrigger>
        </TabsList>

        {/* Tab content takes remaining space */}
        <div className="flex-1 min-h-0">
          <TabsContent value="chat" className="mt-4 flex flex-col h-full">
            <div className="flex flex-col flex-1 min-h-0">
              {/* Chat Messages - takes remaining space */}
              <ScrollArea className="flex-1 border rounded-md p-3">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <MessageCircle className="size-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-xs mt-1">Start the simulation to begin</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.type === "user" ? "justify-end" : "justify-start",
                          message.type === "system" && "justify-center",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] px-3 py-2 rounded-lg text-sm",
                            message.type === "user" && "bg-primary text-primary-foreground",
                            message.type === "bot" && "bg-muted",
                            message.type === "system" && "bg-accent text-accent-foreground text-center",
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input - fixed at bottom */}
              {showInput && (
                <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit" disabled={!inputValue.trim()}>
                    Send
                  </Button>
                </form>
              )}
            </div>
          </TabsContent>

          <TabsContent value="debug" className="mt-4">
            <ScrollArea className="h-64 border rounded-md p-3">
              {debugMessages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <Bug className="size-8 mx-auto mb-2 opacity-50" />
                  <p>No debug messages</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {debugMessages.map((message) => (
                    <div key={message.id} className="text-xs">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            message.level === "error"
                              ? "destructive"
                              : message.level === "warning"
                                ? "outline"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {message.level}
                        </Badge>
                        <span className="text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="mt-1">{message.content}</p>
                      {message.nodeId && <p className="text-muted-foreground">Node: {message.nodeId}</p>}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="variables" className="mt-4">
            <ScrollArea className="h-64 border rounded-md p-3">
              {Object.keys(variables).length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <p>No variables collected yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                      <code className="text-sm font-mono">{key}</code>
                      <span className="text-sm">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
})

export default SimulationPanel
