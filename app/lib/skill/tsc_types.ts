// TypeScript compiler API types for virtual file system integration

export interface VirtualFile {
  path: string
  content: string
}

export interface VirtualChanges {
  deletePaths: string[]
  renameTags: Array<{
    from: string
    to: string
  }>
  writeTags: Array<{
    path: string
    content: string
  }>
}

export interface SyncFileSystemDelegate {
  fileExists?: (fileName: string) => boolean
  readFile?: (fileName: string) => string | undefined
}

export interface SyncVirtualFileSystem {
  fileExists: (filePath: string) => boolean
  readFile: (filePath: string) => string | undefined
  getVirtualFiles: () => VirtualFile[]
  getDeletedFiles: () => string[]
  applyResponseChanges: (changes: VirtualChanges) => void
  createFileSystemInterface: () => {
    fileExists: (fileName: string) => boolean
    readFile: (fileName: string) => string | undefined
    writeFile: (fileName: string, content: string) => void
    deleteFile: (fileName: string) => void
  }
}

// Monaco Editor specific types
export interface MonacoFileSystemProvider {
  stat(resource: monaco.Uri): Promise<monaco.FileStat>
  readFile(resource: monaco.Uri): Promise<Uint8Array>
  writeFile(resource: monaco.Uri, content: Uint8Array): Promise<void>
  delete(resource: monaco.Uri): Promise<void>
  rename(resource: monaco.Uri, target: monaco.Uri): Promise<void>
  readDirectory(resource: monaco.Uri): Promise<Array<[string, monaco.FileType]>>
}

export interface SkillFileSystemEntry {
  path: string
  type: "file" | "directory"
  content?: string
  children?: SkillFileSystemEntry[]
}

// Skill-specific file system types
export interface SkillFileStructure {
  skillId: string
  rootPath: string
  files: Record<string, string>
  directories: string[]
  metadata?: {
    name: string
    description: string
    version: string
    createdAt: number
  }
}
