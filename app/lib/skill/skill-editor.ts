import * as monaco from "monaco-editor"
import { SyncVirtualFileSystemImpl } from "./virtual-fs"
import type { Skill, SkillFileStructure } from "@/types/skills.types"

export class SkillMonacoEditor {
  private vfs: SyncVirtualFileSystemImpl
  private editor: monaco.editor.IStandaloneCodeEditor | null = null
  private skill: Skill | null = null
  private fileSystemProvider: monaco.editor.IFileSystemProvider | null = null

  constructor(baseDir: string = "/workspace") {
    this.vfs = new SyncVirtualFileSystemImpl(baseDir)
    this.setupMonacoDefaults()
  }

  /**
   * Setup default Monaco configurations
   */
  private setupMonacoDefaults(): void {
    // Define TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
    })

    // Add global types for skills
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare namespace Skill {
        interface SkillContext {
          input: any;
          output: any;
          metadata: Record<string, any>;
          logger: {
            info: (message: string) => void;
            error: (message: string) => void;
            warn: (message: string) => void;
          };
        }
        
        interface SkillResult {
          success: boolean;
          data?: any;
          error?: string;
          files?: Array<{
            name: string;
            content: string;
            type: string;
          }>;
        }
        
        type SkillFunction = (context: SkillContext) => Promise<SkillResult> | SkillResult;
      }
      
      declare function registerSkill(name: string, handler: Skill.SkillFunction): void;
      declare function createFile(name: string, content: string, type?: string): void;
      declare function readInput(): any;
      declare function writeOutput(data: any): void;
      `,
      "ts:filename/skill-global.d.ts"
    )
  }

  /**
   * Create Monaco editor instance
   */
  createEditor(container: HTMLElement, options: monaco.editor.IStandaloneEditorConstructionOptions = {}): monaco.editor.IStandaloneCodeEditor {
    const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
      value: "",
      language: "typescript",
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      roundedSelection: false,
      readOnly: false,
      cursorStyle: "line",
      renderWhitespace: "selection",
      wordWrap: "on",
      contextmenu: true,
      ...options,
    }

    this.editor = monaco.editor.create(container, defaultOptions)
    return this.editor
  }

  /**
   * Load skill files into virtual file system
   */
  async loadSkill(skill: Skill, fileStructure: SkillFileStructure): Promise<void> {
    this.skill = skill

    // Clear existing files
    this.vfs = new SyncVirtualFileSystemImpl("/workspace/skills/" + skill.id)

    // Load skill files
    Object.entries(fileStructure.files).forEach(([filePath, content]) => {
      this.vfs.writeFile(filePath, content)
    })

    // Setup Monaco file system provider
    this.setupFileSystemProvider()
    
    // Load main file if exists
    if (fileStructure.files["main.ts"] || fileStructure.files["index.ts"]) {
      const mainFile = fileStructure.files["main.ts"] ? "main.ts" : "index.ts"
      await this.openFile(mainFile)
    }
  }

  /**
   * Setup Monaco file system provider
   */
  private setupFileSystemProvider(): void {
    if (this.fileSystemProvider) {
      monaco.workspace.unregisterFileSystemProvider("inmemory")
    }

    this.fileSystemProvider = {
      stat: async (resource) => {
        const path = resource.path
        const exists = this.vfs.fileExists(path)
        
        if (!exists) {
          throw new Error("File not found")
        }

        return {
          type: this.isDirectory(path) ? 2 : 1, // 2 = directory, 1 = file
          ctime: new Date(Date.now()),
          mtime: new Date(Date.now()),
          size: this.vfs.readFile(path)?.length || 0,
        }
      },

      readFile: async (resource) => {
        const content = this.vfs.readFile(resource.path)
        if (content === undefined) {
          throw new Error("File not found")
        }
        return new TextEncoder().encode(content)
      },

      writeFile: async (resource, content) => {
        const text = new TextDecoder().decode(content)
        this.vfs.writeFile(resource.path, text)
      },

      readDirectory: async (resource) => {
        // Implementation for reading directory contents
        const files = this.vfs.getVirtualFiles()
        return files
          .filter(file => file.path.startsWith(resource.path))
          .map(file => [basename(file.path), this.isDirectory(file.path) ? 2 : 1] as [string, number])
      },

      delete: async (resource) => {
        this.vfs.deleteFile(resource.path)
      },

      rename: async (resource, target) => {
        // Implementation for renaming
        console.warn("Rename not implemented yet")
      },
    }

    monaco.workspace.registerFileSystemProvider("inmemory", this.fileSystemProvider, {
      isCaseSensitive: false,
    })
  }

  /**
   * Open a file in the editor
   */
  async openFile(filePath: string): Promise<void> {
    const uri = monaco.Uri.parse(`inmemory://model/${filePath}`)
    
    // Check if model already exists
    let model = monaco.editor.getModel(uri)
    
    if (!model) {
      // Create new model
      const content = this.vfs.readFile(filePath) || ""
      model = monaco.editor.createModel(content, this.getLanguageFromExtension(filePath), uri)
    }

    if (this.editor) {
      this.editor.setModel(model)
    }
  }

  /**
   * Create a new file
   */
  async createFile(filePath: string, content: string = ""): Promise<void> {
    this.vfs.writeFile(filePath, content)
    
    if (this.editor) {
      await this.openFile(filePath)
    }
  }

  /**
   * Save current file
   */
  async saveFile(): Promise<void> {
    if (!this.editor) return

    const model = this.editor.getModel()
    if (!model) return

    const uri = model.uri
    const content = model.getValue()
    
    this.vfs.writeFile(uri.path, content)
  }

  /**
   * Get all files in the skill
   */
  getFiles(): Array<{ path: string; content: string }> {
    return this.vfs.getVirtualFiles()
  }

  /**
   * Export skill as downloadable files
   */
  exportSkill(): SkillFileStructure {
    const files = this.vfs.getVirtualFiles()
    
    return {
      skillId: this.skill?.id || "unknown",
      rootPath: `/workspace/skills/${this.skill?.id}`,
      files: files.reduce((acc, file) => {
        acc[file.path] = file.content
        return acc
      }, {} as Record<string, string>),
      directories: this.getDirectories(),
      metadata: {
        name: this.skill?.display_title || "Unknown Skill",
        description: this.skill?.description || "",
        version: this.skill?.latest_version || "1.0.0",
        createdAt: this.skill?.created_at || Date.now(),
      },
    }
  }

  /**
   * Apply changes from AI response
   */
  applyChanges(changes: {
    deletePaths: string[]
    renameTags: Array<{ from: string; to: string }>
    writeTags: Array<{ path: string; content: string }>
  }): void {
    this.vfs.applyResponseChanges(changes)
    
    // Refresh open models
    changes.writeTags.forEach(write => {
      const uri = monaco.Uri.parse(`inmemory://model/${write.path}`)
      const model = monaco.editor.getModel(uri)
      if (model) {
        model.setValue(write.content)
      }
    })
  }

  /**
   * Get skill template
   */
  getSkillTemplate(type: "basic" | "data-analysis" | "file-processing" | "ai-task" = "basic"): string {
    const templates = {
      basic: `import { SkillFunction } from './types'

export const skillHandler: SkillFunction = async (context) => {
  const { input, output, metadata, logger } = context
  
  logger.info('Starting skill execution')
  
  try {
    // Your skill logic here
    const result = await processInput(input)
    
    // Create output files if needed
    createFile('result.txt', JSON.stringify(result, null, 2))
    
    return {
      success: true,
      data: result,
      files: [
        {
          name: 'result.txt',
          content: JSON.stringify(result, null, 2),
          type: 'text/plain'
        }
      ]
    }
  } catch (error) {
    logger.error('Skill execution failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function processInput(input: any): Promise<any> {
  // Process the input data
  return {
    processed: true,
    originalInput: input,
    timestamp: new Date().toISOString()
  }
}
`,
      "data-analysis": `import { SkillFunction } from './types'

export const skillHandler: SkillFunction = async (context) => {
  const { input, output, metadata, logger } = context
  
  logger.info('Starting data analysis skill')
  
  try {
    const data = Array.isArray(input) ? input : [input]
    const analysis = performAnalysis(data)
    
    // Create analysis report
    const report = generateReport(analysis)
    createFile('analysis_report.txt', report)
    
    return {
      success: true,
      data: analysis,
      files: [
        {
          name: 'analysis_report.txt',
          content: report,
          type: 'text/plain'
        }
      ]
    }
  } catch (error) {
    logger.error('Data analysis failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed'
    }
  }
}

function performAnalysis(data: any[]): any {
  return {
    count: data.length,
    average: data.reduce((sum, item) => sum + (item.value || 0), 0) / data.length,
    items: data
  }
}

function generateReport(analysis: any): string {
  return \`
Data Analysis Report
====================
Total items: \${analysis.count}
Average value: \${analysis.average}

Details:
\${analysis.items.map((item: any, index: number) => 
  \`Item \${index + 1}: \${JSON.stringify(item, null, 2)}\`
).join('\\n')}
\`
}
`,
      "file-processing": `import { SkillFunction } from './types'

export const skillHandler: SkillFunction = async (context) => {
  const { input, output, metadata, logger } = context
  
  logger.info('Starting file processing skill')
  
  try {
    const { fileName, fileContent, operation } = input
    
    let processedContent: string
    
    switch (operation) {
      case 'transform':
        processedContent = transformContent(fileContent)
        break
      case 'analyze':
        processedContent = analyzeContent(fileContent)
        break
      case 'format':
        processedContent = formatContent(fileContent)
        break
      default:
        throw new Error(\`Unknown operation: \${operation}\`)
    }
    
    // Create processed file
    const outputFileName = \`processed_\${fileName}\`
    createFile(outputFileName, processedContent)
    
    return {
      success: true,
      data: {
        operation,
        inputFile: fileName,
        outputFile: outputFileName
      },
      files: [
        {
          name: outputFileName,
          content: processedContent,
          type: 'text/plain'
        }
      ]
    }
  } catch (error) {
    logger.error('File processing failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed'
    }
  }
}

function transformContent(content: string): string {
  // Simple transformation example
  return content.toUpperCase()
}

function analyzeContent(content: string): string {
  return \`
Content Analysis:
- Length: \${content.length} characters
- Lines: \${content.split('\\n').length}
- Words: \${content.split(/\\s+/).length}
\`
}

function formatContent(content: string): string {
  // Simple formatting example
  return content.split('\\n').map(line => line.trim()).join('\\n')
}
`,
      "ai-task": `import { SkillFunction } from './types'

export const skillHandler: SkillFunction = async (context) => {
  const { input, output, metadata, logger } = context
  
  logger.info('Starting AI task skill')
  
  try {
    const { task, data } = input
    
    // Simulate AI processing
    const result = await processWithAI(task, data)
    
    // Create result files
    createFile('ai_result.json', JSON.stringify(result, null, 2))
    createFile('ai_summary.txt', generateSummary(result))
    
    return {
      success: true,
      data: result,
      files: [
        {
          name: 'ai_result.json',
          content: JSON.stringify(result, null, 2),
          type: 'application/json'
        },
        {
          name: 'ai_summary.txt',
          content: generateSummary(result),
          type: 'text/plain'
        }
      ]
    }
  } catch (error) {
    logger.error('AI task failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AI processing failed'
    }
  }
}

async function processWithAI(task: string, data: any): Promise<any> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    task,
    processedData: data,
    aiInsights: [
      'Data shows interesting patterns',
      'Recommendation: Focus on optimization',
      'Next steps: Monitor performance'
    ],
    confidence: 0.85,
    processedAt: new Date().toISOString()
  }
}

function generateSummary(result: any): string {
  return \`
AI Task Summary
===============
Task: \${result.task}
Confidence: \${(result.confidence * 100).toFixed(1)}%
Processed: \${result.processedAt}

Key Insights:
\${result.aiInsights.map((insight: string) => \`- \${insight}\`).join('\\n')}
\`
}
`,
    }

    return templates[type]
  }

  /**
   * Get language from file extension
   */
  private getLanguageFromExtension(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase()
    
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'md': 'markdown',
      'txt': 'plaintext',
      'py': 'python',
      'pyw': 'python',
      'sql': 'sql',
      'yaml': 'yaml',
      'yml': 'yaml',
      'xml': 'xml',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
    }
    
    return languageMap[ext || ''] || 'plaintext'
  }

  /**
   * Check if path is directory
   */
  private isDirectory(path: string): boolean {
    return path.endsWith('/') || path === ''
  }

  /**
   * Get directories from virtual files
   */
  private getDirectories(): string[] {
    const files = this.vfs.getVirtualFiles()
    const dirs = new Set<string>()
    
    files.forEach(file => {
      const parts = file.path.split('/')
      for (let i = 1; i < parts.length; i++) {
        dirs.add(parts.slice(0, i).join('/'))
      }
    })
    
    return Array.from(dirs)
  }

  /**
   * Dispose editor and cleanup
   */
  dispose(): void {
    if (this.editor) {
      this.editor.dispose()
      this.editor = null
    }
    
    if (this.fileSystemProvider) {
      monaco.workspace.unregisterFileSystemProvider("inmemory")
      this.fileSystemProvider = null
    }
  }
}

// Helper function to get basename
function basename(path: string): string {
  return path.split('/').pop() || path
}
