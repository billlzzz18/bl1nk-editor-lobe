import type { Edge } from "@xyflow/react"

// Base types
export interface BaseSkill {
  id: string
  display_title: string
  source: "provider" | "custom"
  latest_version: string
  created_at: number
  provider?: string
  description?: string
}

export interface ProviderSkill extends BaseSkill {
  source: "provider"
  skill_id: string
}

export interface CustomSkill extends BaseSkill {
  source: "custom"
  skill_id: string
}

export type Skill = ProviderSkill | CustomSkill

export interface SkillVersion {
  id: string
  version: string
  created_at: number
  file_size: number
  status: "active" | "deprecated"
}

export interface SkillReference {
  type: "provider" | "custom"
  skill_id: string
  version: string
}

export interface SkillUpload {
  name: string
  description: string
  files: File[]
  version?: string
}

export interface SkillExecutionResult {
  success: boolean
  output?: string
  files?: FileRecord[]
  error?: string
  execution_time?: number
}

// File types
export interface FileRecord {
  id: string
  name: string
  type: string
  size: number
  created_at: number
  download_url?: string
  metadata?: Record<string, any>
}

export interface FileUpload {
  file: File
  skill_id?: string
  metadata?: Record<string, any>
}

// Container types
export interface ContainerConfig {
  id?: string
  skills: SkillReference[]
  environment?: Record<string, string>
  timeout?: number
}

export interface ContainerState {
  id: string
  status: "creating" | "running" | "completed" | "error" | "stopped"
  skills: SkillReference[]
  created_at: number
  last_activity: number
  output?: string
  files?: FileRecord[]
}

export interface ContainerExecution {
  container_id: string
  code: string
  timeout?: number
}

// Skills Store
export interface SkillsStore {
  // Skills data
  skills: Skill[]
  selectedSkill: Skill | null
  skillVersions: Record<string, SkillVersion[]>
  uploadedFiles: FileRecord[]
  
  // Container state
  activeContainers: Map<string, ContainerState>
  
  // UI state
  skillsPanel: {
    isVisible: boolean
    activeTab: "library" | "upload" | "versions" | "containers"
  }
  
  selectedContainers: Set<string>
  
  // Loading states
  isLoading: boolean
  isUploading: boolean
  isExecuting: boolean
  
  // Error state
  error: string | null
  
  // Actions
  loadSkills: () => Promise<void>
  loadSkillVersions: (skillId: string) => Promise<void>
  uploadSkill: (data: SkillUpload) => Promise<void>
  deleteSkill: (skillId: string) => Promise<void>
  selectSkill: (skill: Skill | null) => void
  
  // Container actions
  createContainer: (config: ContainerConfig) => Promise<string>
  executeInContainer: (containerId: string, code: string) => Promise<SkillExecutionResult>
  stopContainer: (containerId: string) => Promise<void>
  deleteContainer: (containerId: string) => Promise<void>
  
  // File actions
  uploadFiles: (files: FileUpload[]) => Promise<FileRecord[]>
  downloadFile: (fileId: string) => Promise<Blob>
  deleteFile: (fileId: string) => Promise<void>
  
  // UI actions
  setSkillsPanelVisible: (visible: boolean) => void
  setSkillsPanelTab: (tab: "library" | "upload" | "versions" | "containers") => void
  setSelectedContainers: (containerIds: string[]) => void
  clearError: () => void
}

// Messages API Integration
export interface FlowExecutionContext {
  flowId: string
  nodes: any[]
  edges: Edge[]
  skills: Skill[]
  containerId?: string
  model?: string
  maxTokens?: number
}

export interface FlowExecutionResult {
  success: boolean
  containerId?: string
  outputs?: Record<string, any>
  files?: FileRecord[]
  errors?: string[]
  executionTime?: number
}

// Skill Node Data Extensions
export interface SkillNodeData {
  skillId: string
  skillType: "provider" | "custom"
  version: string
  parameters: Record<string, any>
  inputFiles?: string[]
  outputFiles?: string[]
  timeout?: number
}

export interface FileNodeData {
  fileId: string
  fileName: string
  fileType: string
  downloadUrl?: string
  size?: number
}

export interface ContainerNodeData {
  containerId?: string
  skills: SkillReference[]
  status: "idle" | "running" | "completed" | "error"
  autoCreate?: boolean
}

// API Response types
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  has_next: boolean
  has_prev: boolean
}

// Integration with existing node types
export type ExtendedNodeType = "start" | "message" | "textInput" | "skill" | "file" | "container"

export interface ExtendedNodeData {
  // Existing node data
  label?: string
  message?: string
  delay?: number
  placeholder?: string
  variableName?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  
  // New skill-related data
  skillId?: string
  skillType?: "provider" | "custom"
  version?: string
  parameters?: Record<string, any>
  inputFiles?: string[]
  outputFiles?: string[]
  fileId?: string
  fileName?: string
  fileType?: string
  containerId?: string
  skills?: SkillReference[]
  status?: "idle" | "running" | "completed" | "error"
  autoCreate?: boolean
  timeout?: number
}
