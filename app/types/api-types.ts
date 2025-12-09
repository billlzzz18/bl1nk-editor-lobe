// OpenAPI v1.0.0 Schema Types for Agent Skills API
// Generated from openapi-spec.yaml

export interface CreateMessageRequest {
  model: string
  max_tokens?: number
  container?: ContainerSpec
  messages: Message[]
  tools?: Tool[]
}

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string | any[]
}

export interface Tool {
  type: string
  name: string
}

export interface ContainerSpec {
  id?: string
  skills: ContainerSkill[]
}

export interface ContainerSkill {
  type: 'provider' | 'custom'
  skill_id: string
  version?: string
}

export interface MessageResponse {
  id: string
  content: string | any[]
  stop_reason?: 'end_turn' | 'tool_use' | 'pause_turn' | null
  container?: {
    id: string
  }
}

export interface Skill {
  id: string
  display_title: string
  source: 'provider' | 'custom'
  latest_version: string
  created_at: number
  provider?: string
}

export interface ListSkillsResponse {
  data: Skill[]
  next_cursor?: string
}

export interface CreateSkillRequest {
  display_title: string
  files: File[]
}

export interface SkillVersion {
  skill_id: string
  version: string
  created_at: number
}

export interface ListSkillVersionsResponse {
  data: SkillVersion[]
  next_cursor?: string
}

export interface CreateSkillVersionRequest {
  files: File[]
}

export interface FileMetadata {
  id: string
  filename: string
  size_bytes: number
  created_at: number
}

export interface ListFilesResponse {
  data: FileMetadata[]
  next_cursor?: string
}

// API Error Response
export interface APIError {
  error: string
  message?: string
  details?: any
}

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Validation Constraints
export const VALIDATION = {
  SKILLS: {
    MAX_ITEMS: 8,
    SOURCES: ['provider', 'custom'] as const,
    VERSION_FORMAT: {
      PROVIDER: /^\d{8}$/, // YYYYMMDD
      CUSTOM: /^\d{13}$/, // epoch
    },
  },
  FILES: {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    REQUIRED_MANIFEST: 'SKILL.md',
  },
  MESSAGES: {
    MAX_CONTENT_LENGTH: 100000,
    ROLES: ['user', 'assistant', 'system', 'tool'] as const,
  },
} as const

// Request/Response Types for Different Content Types
export interface APIResponse<T> {
  data: T
  success: boolean
  timestamp: string
  request_id?: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    next_cursor?: string
    previous_cursor?: string
    total_count?: number
    has_next: boolean
    has_previous: boolean
  }
}

// Health Check Response
export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  version: string
  uptime: number
  services?: {
    database: 'connected' | 'disconnected'
    redis: 'connected' | 'disconnected'
    container_runtime: 'connected' | 'disconnected'
  }
}

// FormData Types for Upload Requests
export interface SkillUploadData {
  display_title: string
  files: File[]
}

export interface SkillVersionUploadData {
  files: File[]
}

export interface FileUploadData {
  file: File
  metadata?: {
    skill_id?: string
    description?: string
    tags?: string[]
  }
}

// Query Parameters
export interface ListSkillsQuery {
  source?: 'provider' | 'custom'
  limit?: number
  cursor?: string
}

export interface ListFilesQuery {
  limit?: number
  cursor?: string
}

// Container and Execution Types
export interface ContainerExecutionLog {
  id: string
  container_id: string
  skill_id?: string
  code: string
  output?: string
  error_message?: string
  status: 'running' | 'completed' | 'failed'
  started_at: number
  completed_at?: number
  execution_time_ms?: number
}

export interface ContainerState {
  id: string
  status: 'running' | 'stopped' | 'error'
  created_at: number
  updated_at: number
  skills_enabled: string[]
  metadata?: Record<string, any>
}

// Utility Types
export type SkillSource = 'provider' | 'custom'
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'
export type ExecutionStatus = 'running' | 'completed' | 'failed'
export type StopReason = 'end_turn' | 'tool_use' | 'pause_turn' | null

// Union Types for API Responses
export type MessageContent = string | any[]

export type APIResponseData = 
  | Skill
  | SkillVersion
  | FileMetadata
  | MessageResponse
  | ListSkillsResponse
  | ListSkillVersionsResponse
  | ListFilesResponse
  | HealthCheckResponse

// Request Bodies (excluding files)
export type RequestBody = 
  | CreateMessageRequest
  | SkillUploadData
  | SkillVersionUploadData

// Export all types as default
export default {
  CreateMessageRequest,
  Message,
  Tool,
  ContainerSpec,
  ContainerSkill,
  MessageResponse,
  Skill,
  ListSkillsResponse,
  CreateSkillRequest,
  SkillVersion,
  ListSkillVersionsResponse,
  CreateSkillVersionRequest,
  FileMetadata,
  ListFilesResponse,
  APIError,
  HealthCheckResponse,
  HTTP_STATUS,
  VALIDATION,
}