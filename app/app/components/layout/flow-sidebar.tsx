"use client"

import { memo } from "react"
import { Layers, LayoutGrid, type LucideIcon, PanelLeft, PanelLeftClose, Play, Variable, X } from "lucide-react"
import SidebarButtonItem from "./sidebar-button"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"
import { useFlowStore } from "@/contexts/flow-context"
import { useSidebarShortcuts } from "@/hooks/use-sidebar-shortcuts"
import { useSelectedNodes } from "@/hooks/use-selected-nodes"
import SidebarPanelHeader from "./sidebar-panel-header"
import type { ActivePanel } from "@/types/flow.types"
import { ScrollArea } from "../ui/scroll-area"
import { TooltipProvider } from "../ui/tooltip"
import PropertiesEditorFactory from "../flow/nodes/properties/properties-editor-factory"
import AvailableNodesPanel from "./sidebar-panels/available-nodes-panel"
import VariablesPanel from "./sidebar-panels/variables-panel"
import SimulationPanel from "./sidebar-panels/simulation-panel"

const getMenuIcon = (panel: ActivePanel): LucideIcon => {
  switch (panel) {
    case "available-nodes":
      return LayoutGrid
    case "node-properties":
      return Layers
    case "simulation":
      return Play
    case "variables":
      return Variable
    default:
      return X
  }
}

const getMenuLabel = (panel: ActivePanel): string => {
  switch (panel) {
    case "available-nodes":
      return "Available Nodes"
    case "node-properties":
      return "Node Properties"
    case "simulation":
      return "Simulation"
    case "variables":
      return "Variables"
    default:
      return ""
  }
}

const FlowSidebar = memo(function FlowSidebar() {
  const isSidebarVisible = useFlowStore((state) => state.ui.sidebar.isVisible)
  const activePanel = useFlowStore((state) => state.ui.sidebar.activePanel)
  const setActivePanel = useFlowStore((state) => state.setSidebarActivePanel)
  const toggleSidebar = useFlowStore((state) => state.setSidebarVisible)
  const updateNode = useFlowStore((state) => state.updateNode)
  const selectedNodes = useSelectedNodes()

  useSidebarShortcuts()

  const renderSidebarContent = () => {
    switch (activePanel) {
      case "available-nodes": {
        return <AvailableNodesPanel />
      }
      case "node-properties": {
        if (selectedNodes.length === 1 && selectedNodes[0]) {
          const selectedNodeId = selectedNodes[0].id
          return (
            <PropertiesEditorFactory
              key={selectedNodeId}
              nodeId={selectedNodeId}
              onUpdate={(updates) => updateNode(selectedNodeId, updates)}
            />
          )
        }
        if (selectedNodes.length >= 1) {
          return <span className="text-muted-foreground">Please select only one node to edit its properties.</span>
        } else {
          return <span className="text-muted-foreground">Select a node to edit its properties.</span>
        }
      }
      case "variables": {
        return <VariablesPanel />
      }
      case "simulation": {
        return <SimulationPanel />
      }
      default: {
        return null
      }
    }
  }

  return (
    <TooltipProvider>
      <div className={"relative max-w-sm w-fit flex shrink-0 h-full"}>
        <div className="shrink-0 bg-sidebar p-1 h-full">
          <div className="h-full flex flex-col gap-1">
            <SidebarButtonItem
              active={false}
              onClick={() => toggleSidebar(!isSidebarVisible)}
              title="Toggle Sidebar"
              shortcut="⌘B"
            >
              {isSidebarVisible ? <PanelLeftClose className="size-5" /> : <PanelLeft className="size-5" />}
            </SidebarButtonItem>

            <Separator orientation="horizontal" className="w-4" />

            <SidebarButtonItem
              active={activePanel === "available-nodes"}
              onClick={() => setActivePanel("available-nodes")}
              title={getMenuLabel("available-nodes")}
              shortcut="⌘1"
            >
              {(() => {
                const Icon = getMenuIcon("available-nodes")
                return <Icon className="size-5" />
              })()}
            </SidebarButtonItem>

            <Separator orientation="horizontal" className="w-4" />

            <SidebarButtonItem
              active={activePanel === "node-properties"}
              onClick={() => setActivePanel("node-properties")}
              title={getMenuLabel("node-properties")}
              shortcut="⌘2"
            >
              {(() => {
                const Icon = getMenuIcon("node-properties")
                return <Icon className="size-5" />
              })()}
            </SidebarButtonItem>

            <Separator orientation="horizontal" className="w-4" />

            <SidebarButtonItem
              active={activePanel === "simulation"}
              onClick={() => setActivePanel("simulation")}
              title={getMenuLabel("simulation")}
              shortcut="⌘3"
            >
              {(() => {
                const Icon = getMenuIcon("simulation")
                return <Icon className="size-5" />
              })()}
            </SidebarButtonItem>

            <Separator orientation="horizontal" className="w-4" />

            <SidebarButtonItem
              active={activePanel === "variables"}
              onClick={() => setActivePanel("variables")}
              title={getMenuLabel("variables")}
              shortcut="⌘4"
            >
              {(() => {
                const Icon = getMenuIcon("variables")
                return <Icon className="size-5" />
              })()}
            </SidebarButtonItem>
          </div>
        </div>

        <div
          className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden bg-background border-l h-full",
            isSidebarVisible ? "w-80" : "w-0 opacity-0",
          )}
        >
          <div className="flex flex-col h-full min-w-[320px]">
            <SidebarPanelHeader title={getMenuLabel(activePanel)} icon={getMenuIcon(activePanel)} />
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-4 py-4">{renderSidebarContent()}</div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
})

export default FlowSidebar
