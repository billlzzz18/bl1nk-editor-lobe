// Enhanced API Client with Full TypeScript Integration
import type {
  CreateMessageRequest,
  MessageResponse,
  Skill,
  ListSkillsResponse,
  CreateSkillRequest,
  SkillVersion,
  ListSkillVersionsResponse,
  FileMetadata,
  ListFilesResponse,
  APIError,
  HTTP_STATUS,
  SkillUploadData,
  SkillVersionUploadData,
  ListSkillsQuery,
  ListFilesQuery,
} from '@/types/api-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

/**
 * Agent Skills API Client
 * Provider-agnostic API for integrating Skills with any LLM provider
 */
class SkillsAPIClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = process.env.NEXT_PUBLIC_API_TOKEN || ''
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    }

    const response = await fetch(url, { ...defaultOptions, ...options })
    
    // Handle HTTP errors with typed responses
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      let errorDetails: any = null
      
      try {
        const error = await response.json()
        errorMessage = error.error || error.message || errorMessage
        errorDetails = error
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage
      }
      
      const error: APIError = {
        error: errorMessage,
        message: errorMessage,
        details: errorDetails,
      }
      
      throw new Error(JSON.stringify(error))
    }

    // Handle different content types
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return response.json()
    }
    
    // For binary files or other content
    return response.text() as any
  }

  private static async uploadRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = process.env.NEXT_PUBLIC_API_TOKEN || ''
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    })
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      
      try {
        const error = await response.json()
        errorMessage = error.error || error.message || errorMessage
      } catch {
        errorMessage = response.statusText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    return response.json()
  }

  // ==================== Messages API ====================
  
  /**
   * Create a message with optional Skills and code execution
   * Send a chat/messages request to the model, optionally enabling Skills in
   * the container and allowing code execution.
   */
  static async createMessage(request: CreateMessageRequest): Promise<MessageResponse> {
    return this.request<MessageResponse>('/v1/messages', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  // ==================== Skills Management ====================
  
  /**
   * List Skills with optional filtering
   * @param params - Query parameters for filtering and pagination
   */
  static async listSkills(params?: ListSkillsQuery): Promise<ListSkillsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.source) searchParams.append('source', params.source)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.cursor) searchParams.append('cursor', params.cursor)

    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<ListSkillsResponse>(`/v1/skills${query}`)
  }

  /**
   * Retrieve a specific Skill by ID
   */
  static async getSkill(skillId: string): Promise<Skill> {
    return this.request<Skill>(`/v1/skills/${skillId}`)
  }

  /**
   * Create a new Skill with files upload
   * @param request - Skill creation data
   * @param files - Array of files including required SKILL.md manifest
   */
  static async uploadSkill(request: CreateSkillRequest, files: File[]): Promise<Skill> {
    if (!files || files.length === 0) {
      throw new Error('At least one file is required')
    }

    // Validate that SKILL.md is included
    const hasSkillManifest = files.some(file => file.name === 'SKILL.md')
    if (!hasSkillManifest) {
      throw new Error('SKILL.md manifest file is required')
    }

    const formData = new FormData()
    formData.append('display_title', request.display_title)
    
    // Add files according to OpenAPI spec
    files.forEach((file) => {
      formData.append('files', file)
    })

    return this.uploadRequest<Skill>('/v1/skills', formData)
  }

  /**
   * Delete a Skill (all versions must be deleted first)
   */
  static async deleteSkill(skillId: string): Promise<void> {
    return this.request<void>(`/v1/skills/${skillId}`, {
      method: 'DELETE',
    })
  }

  // ==================== Skill Versions Management ====================
  
  /**
   * List all versions for a specific Skill
   */
  static async listSkillVersions(skillId: string): Promise<ListSkillVersionsResponse> {
    return this.request<ListSkillVersionsResponse>(`/v1/skills/${skillId}/versions`)
  }

  /**
   * Create a new version for an existing Skill
   */
  static async createSkillVersion(skillId: string, files: File[]): Promise<SkillVersion> {
    if (!files || files.length === 0) {
      throw new Error('At least one file is required')
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    return this.uploadRequest<SkillVersion>(`/v1/skills/${skillId}/versions`, formData)
  }

  /**
   * Delete a specific Skill version
   */
  static async deleteSkillVersion(skillId: string, version: string): Promise<void> {
    return this.request<void>(`/v1/skills/${skillId}/versions/${version}`, {
      method: 'DELETE',
    })
  }

  // ==================== Files Management ====================
  
  /**
   * List files with optional pagination
   */
  static async listFiles(params?: ListFilesQuery): Promise<ListFilesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.cursor) searchParams.append('cursor', params.cursor)

    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return this.request<ListFilesResponse>(`/v1/files${query}`)
  }

  /**
   * Retrieve file metadata by ID
   */
  static async getFileMetadata(fileId: string): Promise<FileMetadata> {
    return this.request<FileMetadata>(`/v1/files/${fileId}`)
  }

  /**
   * Delete a file
   */
  static async deleteFile(fileId: string): Promise<void> {
    return this.request<void>(`/v1/files/${fileId}`, {
      method: 'DELETE',
    })
  }

  /**
   * Download file content
   */
  static async downloadFile(fileId: string): Promise<string> {
    return this.request<string>(`/v1/files/${fileId}/content`)
  }

  /**
   * Upload a single file for backward compatibility
   */
  static async uploadFile(file: File, metadata?: { skill_id?: string }): Promise<FileMetadata> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (metadata?.skill_id) {
      formData.append('skill_id', metadata.skill_id)
    }
    
    return this.uploadRequest<FileMetadata>('/v1/files', formData)
  }

  // ==================== Health Check ====================
  
  /**
   * Check API health status
   */
  static async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/api/health')
  }

  // ==================== Utility Methods ====================
  
  /**
   * Generate download URL for a file
   */
  static getFileDownloadUrl(fileId: string): string {
    return `${API_BASE_URL}/v1/files/${fileId}/content`
  }

  /**
   * Parse and handle API errors
   */
  static parseAPIError(error: unknown): APIError {
    if (error instanceof Error) {
      try {
        return JSON.parse(error.message) as APIError
      } catch {
        return {
          error: error.message,
          message: error.message,
        }
      }
    }
    
    return {
      error: 'Unknown error occurred',
      message: 'An unexpected error occurred',
    }
  }

  /**
   * Validate request parameters
   */
  static validateCreateMessageRequest(request: CreateMessageRequest): void {
    if (!request.model) {
      throw new Error('Model is required')
    }
    
    if (!request.messages || request.messages.length === 0) {
      throw new Error('At least one message is required')
    }

    if (request.container?.skills && request.container.skills.length > 8) {
      throw new Error('Maximum 8 skills can be enabled in container')
    }
  }

  /**
   * Check if API is available
   */
  static async isAvailable(): Promise<boolean> {
    try {
      await this.healthCheck()
      return true
    } catch {
      return false
    }
  }
}

export { SkillsAPIClient }
export default SkillsAPIClient