import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Code, 
  FileText, 
  Download, 
  Play, 
  Settings,
  Calendar,
  User,
  Package,
  Cpu,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useSkillsStore } from "@/stores/skills-store"
import type { Skill } from "@/types/skills.types"

interface SkillDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skill: Skill | null
  onCreateContainer?: (skills: Skill[]) => void
}

export const SkillDetailsDialog: React.FC<SkillDetailsDialogProps> = ({
  open,
  onOpenChange,
  skill,
  onCreateContainer,
}) => {
  const { 
    skillVersions, 
    loadSkillVersions, 
    isLoading,
    createContainer,
    isExecuting 
  } = useSkillsStore()
  
  const [activeTab, setActiveTab] = useState("overview")
  const [versions, setVersions] = useState<any[]>([])

  useEffect(() => {
    if (skill && open) {
      loadSkillVersions(skill.id).then(() => {
        const skillVersionsData = skillVersions[skill.id] || []
        setVersions(skillVersionsData)
      })
    }
  }, [skill, open])

  if (!skill) return null

  const handleCreateContainer = async () => {
    if (onCreateContainer) {
      onCreateContainer([skill])
    } else {
      try {
        await createContainer({
          skills: [{
            type: skill.source,
            skill_id: skill.id,
            version: skill.latest_version
          }]
        })
      } catch (error) {
        console.error("Failed to create container:", error)
      }
    }
    onOpenChange(false)
  }

  const getSkillIcon = (skillId: string) => {
    const iconMap: Record<string, string> = {
      'pptx': '📊',
      'xlsx': '📈', 
      'docx': '📝',
      'pdf': '📄',
      'ai-task': '🤖',
      'data-analysis': '📊',
      'file-processing': '🔄',
    }
    
    return iconMap[skillId] || '⚡'
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getSkillIcon(skill.id)}</span>
            <div>
              <div className="flex items-center gap-2">
                {skill.display_title}
                <Badge variant={skill.source === "provider" ? "default" : "outline"}>
                  {skill.source}
                </Badge>
              </div>
              <p className="text-sm font-normal text-gray-600 mt-1">
                v{skill.latest_version} • {skill.provider || "Custom"}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>
            {skill.description || "No description available"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Created:</span>
                    <span>{formatDate(skill.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Source:</span>
                    <Badge variant="outline" className="text-xs">
                      {skill.source}
                    </Badge>
                  </div>
                  
                  {skill.provider && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Provider:</span>
                      <span>{skill.provider}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Cpu className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Version:</span>
                    <Badge variant="secondary">{skill.latest_version}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Versions:</span>
                    <span>{versions.length} total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {skill.description || "No description provided for this skill."}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Capabilities</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Code Execution</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>File Operations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Data Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>AI Integration</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Versions Tab */}
            <TabsContent value="versions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Version History</h4>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {versions.map((version, index) => (
                    <div key={version.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? "bg-green-500" : "bg-gray-300"
                        }`} />
                        <div>
                          <p className="font-medium text-sm">v{version.version}</p>
                          <p className="text-xs text-gray-600">
                            {formatDate(version.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={version.status === "active" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {version.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {(version.file_size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {versions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No version history available</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Skill Files</h4>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
              
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">SKILL.md</span>
                    <span className="text-xs text-gray-500">Metadata and documentation</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Code className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">main.ts</span>
                    <span className="text-xs text-gray-500">Main skill implementation</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Code className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">types.ts</span>
                    <span className="text-xs text-gray-500">Type definitions</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">README.md</span>
                    <span className="text-xs text-gray-500">Usage instructions</span>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">API Usage</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                    <div className="text-green-400">POST</div>
                    <div className="text-blue-400">/v1/messages</div>
                    <div className="mt-2 text-gray-300">{`{
  "model": "claude-3-sonnet",
  "container": {
    "skills": [
      {
        "type": "${skill.source}",
        "skill_id": "${skill.id}",
        "version": "${skill.latest_version}"
      }
    ]
  },
  "messages": [
    {
      "role": "user", 
      "content": "Use the ${skill.display_title} skill"
    }
  ]
}`}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Parameters</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Input:</span>
                      <span>Any JSON data or files</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Output:</span>
                      <span>Processed data and files</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeout:</span>
                      <span>300 seconds max</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Examples</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      • Use with data analysis workflows
                    </p>
                    <p className="text-gray-700">
                      • Combine with other skills for complex tasks
                    </p>
                    <p className="text-gray-700">
                      • Integrate into chat flows
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          
          <Button 
            onClick={handleCreateContainer}
            disabled={isExecuting}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isExecuting ? "Creating..." : "Test Skill"}
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configure
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
