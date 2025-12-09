// OpenAPI-aligned Types
interface CreateMessageRequest {
  model: string
  max_tokens?: number
  container?: ContainerSpec
  messages: Message[]
  tools?: Tool[]
}

interface Message {
  role: "user" | "assistant" | "system" | "tool"
  content: string | any[]
}

interface Tool {
  type: string
  name: string
}

interface ContainerSpec {
  id?: string
  skills: ContainerSkill[]
}

interface ContainerSkill {
  type: "provider" | "custom"
  skill_id: string
  version?: string
}

interface MessageResponse {
  id: string
  content: string | any[]
  stop_reason?: "end_turn" | "tool_use" | "pause_turn" | null
  container?: { id: string }
}

interface Skill {
  id: string
  display_title: string
  source: "provider" | "custom"
  latest_version: string
  created_at: number
  provider?: string
}

interface ListSkillsResponse {
  data: Skill[]
  next_cursor?: string
}

interface CreateSkillRequest {
  display_title: string
  files: File[]
}

interface SkillVersion {
  skill_id: string
  version: string
  created_at: number
}

interface ListSkillVersionsResponse {
  data: SkillVersion[]
  next_cursor?: string
}

interface CreateSkillVersionRequest {
  files: File[]
}

interface FileMetadata {
  id: string
  filename: string
  size_bytes: number
  created_at: number
}

interface ListFilesResponse {
  data: FileMetadata[]
  next_cursor?: string
}

interface APIResponse<T> {
  data: T
  next_cursor?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

class SkillsAPIClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const token = process.env.NEXT_PUBLIC_API_TOKEN || ""
    
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
        ...options.headers,
      },
    }

    const response = await fetch(url, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      
      try {
        const error = await response.json()
        errorMessage = error.message || error.error || errorMessage
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage
      }
      
      throw new Error(errorMessage)
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
    const token = process.env.NEXT_PUBLIC_API_TOKEN || ""
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Messages API (OpenAI/Claude compatible)
  static async createMessage(request: CreateMessageRequest): Promise<MessageResponse> {
    return this.request<MessageResponse>("/v1/messages", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  // Skills Management (OpenAPI spec compliant)
  static async listSkills(params?: {
    source?: "provider" | "custom"
    limit?: number
    cursor?: string
  }): Promise<ListSkillsResponse> {
    const searchParams = new URLSearchParams()
    if (params?.source) searchParams.append("source", params.source)
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.cursor) searchParams.append("cursor", params.cursor)

    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    return this.request<ListSkillsResponse>(`/v1/skills${query}`)
  }

  static async getSkill(skillId: string): Promise<Skill> {
    return this.request<Skill>(`/v1/skills/${skillId}`)
  }

  static async uploadSkill(request: CreateSkillRequest, files: File[]): Promise<Skill> {
    const formData = new FormData()
    formData.append("display_title", request.display_title)
    
    // Add files according to spec
    files.forEach((file) => {
      formData.append("files", file)
    })

    return this.uploadRequest<Skill>("/v1/skills", formData)
  }

  static async deleteSkill(skillId: string): Promise<void> {
    return this.request<void>(`/v1/skills/${skillId}`, {
      method: "DELETE",
    })
  }

  // Skill Versions Management
  static async listSkillVersions(skillId: string): Promise<ListSkillVersionsResponse> {
    return this.request<ListSkillVersionsResponse>(`/v1/skills/${skillId}/versions`)
  }

  static async createSkillVersion(skillId: string, files: File[]): Promise<SkillVersion> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    return this.uploadRequest<SkillVersion>(`/v1/skills/${skillId}/versions`, formData)
  }

  static async deleteSkillVersion(skillId: string, version: string): Promise<void> {
    return this.request<void>(`/v1/skills/${skillId}/versions/${version}`, {
      method: "DELETE",
    })
  }

  // Files Management
  static async listFiles(params?: {
    limit?: number
    cursor?: string
  }): Promise<ListFilesResponse> {
    const searchParams = new URLSearchParams()
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.cursor) searchParams.append("cursor", params.cursor)

    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    return this.request<ListFilesResponse>(`/v1/files${query}`)
  }

  static async getFileMetadata(fileId: string): Promise<FileMetadata> {
    return this.request<FileMetadata>(`/v1/files/${fileId}`)
  }

  static async deleteFile(fileId: string): Promise<void> {
    return this.request<void>(`/v1/files/${fileId}`, {
      method: "DELETE",
    })
  }

  static async downloadFile(fileId: string): Promise<string> {
    return this.request<string>(`/v1/files/${fileId}/content`)
  }

  // Legacy compatibility methods
  static async uploadFile(file: File): Promise<FileMetadata> {
    const formData = new FormData()
    formData.append("file", file)
    
    // Use files API for backward compatibility
    return this.uploadRequest<FileMetadata>("/v1/files", formData)
  }

  // Utility methods
  static getFileDownloadUrl(fileId: string): string {
    return `${API_BASE_URL}/v1/files/${fileId}/content`
  }

  // Health check
  static async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health")
  }
}

export { SkillsAPIClient as SkillsAPI }
export default SkillsAPIClient
