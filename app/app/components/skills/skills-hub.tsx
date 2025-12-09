import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Plus, 
  Code, 
  Upload, 
  Download, 
  Trash2, 
  Play, 
  Square,
  FileText,
  Folder,
  Container,
  Settings,
  RefreshCw
} from "lucide-react"
import { useSkillsStore } from "@/stores/skills-store"
import { SkillUploadDialog } from "./skill-upload-dialog"
import { SkillDetailsDialog } from "./skill-details-dialog"
import { ContainerTerminal } from "./container-terminal"
import type { Skill, ContainerState } from "@/types/skills.types"

export const SkillsHub: React.FC = () => {
  const {
    skills,
    activeContainers,
    isLoading,
    isUploading,
    isExecuting,
    error,
    loadSkills,
    createContainer,
    deleteSkill,
    setSkillsPanelTab,
    clearError
  } = useSkillsStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("library")

  useEffect(() => {
    loadSkills()
  }, [])

  const filteredSkills = skills.filter(skill =>
    skill.display_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const providerSkills = filteredSkills.filter(skill => skill.source === "provider")
  const customSkills = filteredSkills.filter(skill => skill.source === "custom")

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill)
    setIsDetailsDialogOpen(true)
  }

  const handleCreateContainer = async (skills: Skill[]) => {
    try {
      const containerId = await createContainer({
        skills: skills.map(skill => ({
          type: skill.source,
          skill_id: skill.id,
          version: skill.latest_version
        }))
      })
      console.log("Container created:", containerId)
    } catch (error) {
      console.error("Failed to create container:", error)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      await deleteSkill(skillId)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-red-800">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
                <Button onClick={clearError} variant="outline" size="sm">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Agent Skills Hub
              </h1>
              <p className="text-md text-gray-600 dark:text-gray-400">
                Manage and deploy AI-powered skills for your agent workflows
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsUploadDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Skill
              </Button>
              <Button 
                onClick={loadSkills}
                variant="outline"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>{providerSkills.length} Provider Skills</span>
              <span>{customSkills.length} Custom Skills</span>
              <span>{activeContainers.size} Active Containers</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="containers" className="flex items-center gap-2">
              <Container className="w-4 h-4" />
              Containers
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Skills Library */}
          <TabsContent value="library" className="space-y-6">
            {/* Provider Skills */}
            {providerSkills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Provider Skills
                  <Badge variant="secondary">{providerSkills.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providerSkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onSelect={() => handleSkillSelect(skill)}
                      onDelete={() => handleDeleteSkill(skill.id)}
                      isExecuting={isExecuting}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Custom Skills */}
            {customSkills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Custom Skills
                  <Badge variant="secondary">{customSkills.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customSkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onSelect={() => handleSkillSelect(skill)}
                      onDelete={() => handleDeleteSkill(skill.id)}
                      isExecuting={isExecuting}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredSkills.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No skills found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Get started by uploading your first skill"}
                </p>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Skill
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Containers */}
          <TabsContent value="containers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Container className="w-5 h-5" />
                  Active Containers
                  <Badge variant="secondary">{activeContainers.size}</Badge>
                </h2>
                <div className="space-y-4">
                  {Array.from(activeContainers.values()).map((container) => (
                    <ContainerCard
                      key={container.id}
                      container={container}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Terminal</h2>
                <ContainerTerminal />
              </div>
            </div>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-6">
            <SkillTemplatesSection onCreateContainer={handleCreateContainer} />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <SkillsSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <SkillUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />

      <SkillDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        skill={selectedSkill}
        onCreateContainer={handleCreateContainer}
      />
    </div>
  )
}

// Skill Card Component
interface SkillCardProps {
  skill: Skill
  onSelect: () => void
  onDelete: () => void
  isExecuting: boolean
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onSelect, onDelete, isExecuting }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold line-clamp-2">
              {skill.display_title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={skill.source === "provider" ? "default" : "outline"}
                className="text-xs"
              >
                {skill.source}
              </Badge>
              {skill.provider && (
                <Badge variant="secondary" className="text-xs">
                  {skill.provider}
                </Badge>
              )}
            </div>
          </div>
          {isHovered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs line-clamp-3">
          {skill.description || "No description available"}
        </CardDescription>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>v{skill.latest_version}</span>
          <span>{new Date(skill.created_at * 1000).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Container Card Component
interface ContainerCardProps {
  container: ContainerState
}

const ContainerCard: React.FC<ContainerCardProps> = ({ container }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500"
      case "error": return "bg-red-500"
      case "creating": return "bg-yellow-500"
      case "stopped": return "bg-gray-500"
      default: return "bg-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(container.status)}`} />
            Container {container.id.slice(0, 8)}...
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {container.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-xs text-gray-600">
          <div>Skills: {container.skills.length}</div>
          <div>Created: {new Date(container.created_at).toLocaleTimeString()}</div>
          <div>Last Activity: {new Date(container.last_activity).toLocaleTimeString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skill Templates Section
interface SkillTemplatesSectionProps {
  onCreateContainer: (skills: Skill[]) => void
}

const SkillTemplatesSection: React.FC<SkillTemplatesSectionProps> = ({ onCreateContainer }) => {
  const templates = [
    {
      id: "basic-analysis",
      name: "Basic Data Analysis",
      description: "Simple statistical analysis and reporting",
      skills: ["xlsx", "basic-analysis"],
      icon: "📊"
    },
    {
      id: "document-processor",
      name: "Document Processor",
      description: "Process and transform documents",
      skills: ["docx", "pdf", "document-processor"],
      icon: "📄"
    },
    {
      id: "ai-assistant",
      name: "AI Assistant",
      description: "Natural language processing and AI tasks",
      skills: ["ai-task", "text-processing"],
      icon: "🤖"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{template.icon}</span>
              {template.name}
            </CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {template.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button 
                className="w-full" 
                size="sm"
                onClick={() => console.log("Create template:", template.id)}
              >
                <Play className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skills Settings Component
const SkillsSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure API endpoints and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">API Base URL</label>
            <Input placeholder="http://localhost:3001" />
          </div>
          <div>
            <label className="text-sm font-medium">API Key</label>
            <Input type="password" placeholder="Enter API key" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Container Settings</CardTitle>
          <CardDescription>
            Configure container runtime and resource limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Default Timeout (seconds)</label>
            <Input type="number" placeholder="300" />
          </div>
          <div>
            <label className="text-sm font-medium">Max File Size (MB)</label>
            <Input type="number" placeholder="8" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
