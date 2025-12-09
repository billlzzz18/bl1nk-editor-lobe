import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type {
  SkillsStore,
  Skill,
  SkillVersion,
  SkillUpload,
  FileRecord,
  FileUpload,
  ContainerConfig,
  ContainerState,
  SkillExecutionResult,
} from "@/types/skills.types"
import SkillsAPI from "@/lib/api/skills-api"

export const createSkillsStore = () => {
  return create<SkillsStore>()(
    immer((set, get) => ({
      // Initial state
      skills: [],
      selectedSkill: null,
      skillVersions: {},
      uploadedFiles: [],
      activeContainers: new Map(),
      
      // UI state
      skillsPanel: {
        isVisible: true,
        activeTab: "library",
      },
      selectedContainers: new Set(),
      
      // Loading states
      isLoading: false,
      isUploading: false,
      isExecuting: false,
      
      // Error state
      error: null,
      
      // Actions
      loadSkills: async () => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })
        
        try {
          const response = await SkillsAPI.listSkills()
          set((state) => {
            state.skills = response.items
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.isLoading = false
            state.error = error instanceof Error ? error.message : "Failed to load skills"
          })
        }
      },
      
      loadSkillVersions: async (skillId: string) => {
        try {
          const response = await SkillsAPI.getSkillVersions(skillId)
          set((state) => {
            state.skillVersions[skillId] = response.data || []
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Failed to load skill versions"
          })
        }
      },
      
      uploadSkill: async (data: SkillUpload) => {
        set((state) => {
          state.isUploading = true
          state.error = null
        })
        
        try {
          const response = await SkillsAPI.uploadSkill(data)
          if (response.success && response.data) {
            set((state) => {
              state.skills.push(response.data)
              state.isUploading = false
            })
          } else {
            throw new Error(response.error || "Upload failed")
          }
        } catch (error) {
          set((state) => {
            state.isUploading = false
            state.error = error instanceof Error ? error.message : "Failed to upload skill"
          })
        }
      },
      
      deleteSkill: async (skillId: string) => {
        try {
          await SkillsAPI.deleteSkill(skillId)
          set((state) => {
            state.skills = state.skills.filter(skill => skill.id !== skillId)
            delete state.skillVersions[skillId]
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Failed to delete skill"
          })
        }
      },
      
      selectSkill: (skill: Skill | null) => {
        set((state) => {
          state.selectedSkill = skill
        })
      },
      
      // Container actions
      createContainer: async (config: ContainerConfig) => {
        set((state) => {
          state.isExecuting = true
          state.error = null
        })
        
        try {
          const response = await SkillsAPI.createContainer(config)
          if (response.success && response.data) {
            const containerState: ContainerState = {
              id: response.data.container_id,
              status: "creating",
              skills: config.skills,
              created_at: Date.now(),
              last_activity: Date.now(),
            }
            
            set((state) => {
              state.activeContainers.set(response.data!.container_id, containerState)
              state.isExecuting = false
            })
            
            return response.data.container_id
          } else {
            throw new Error(response.error || "Failed to create container")
          }
        } catch (error) {
          set((state) => {
            state.isExecuting = false
            state.error = error instanceof Error ? error.message : "Failed to create container"
          })
          throw error
        }
      },
      
      executeInContainer: async (containerId: string, code: string) => {
        set((state) => {
          state.isExecuting = true
          state.error = null
        })
        
        try {
          const response = await SkillsAPI.executeInContainer({
            container_id: containerId,
            code,
          })
          
          set((state) => {
            state.isExecuting = false
            
            // Update container state
            const container = state.activeContainers.get(containerId)
            if (container) {
              container.status = response.success ? "completed" : "error"
              container.last_activity = Date.now()
              if (response.data?.output) {
                container.output = response.data.output
              }
              if (response.data?.files) {
                container.files = response.data.files
              }
            }
          })
          
          return response.data || {
            success: false,
            error: response.error || "Execution failed"
          }
        } catch (error) {
          set((state) => {
            state.isExecuting = false
            state.error = error instanceof Error ? error.message : "Failed to execute in container"
          })
          
          return {
            success: false,
            error: error instanceof Error ? error.message : "Execution failed"
          }
        }
      },
      
      stopContainer: async (containerId: string) => {
        try {
          await SkillsAPI.stopContainer(containerId)
          set((state) => {
            const container = state.activeContainers.get(containerId)
            if (container) {
              container.status = "stopped"
              container.last_activity = Date.now()
            }
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Failed to stop container"
          })
        }
      },
      
      deleteContainer: async (containerId: string) => {
        try {
          await SkillsAPI.deleteContainer(containerId)
          set((state) => {
            state.activeContainers.delete(containerId)
            state.selectedContainers.delete(containerId)
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Failed to delete container"
          })
        }
      },
      
      // File actions
      uploadFiles: async (files: FileUpload[]) => {
        try {
          const response = await SkillsAPI.uploadFiles(files)
          if (response.success && response.data) {
            set((state) => {
              state.uploadedFiles.push(...response.data)
            })
            return response.data
          } else {
            throw new Error(response.error || "Failed to upload files")
          }
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Failed to upload files"
          })
          throw error
        }
      },
      
      downloadFile: async (fileId: string) => {
        try {
          return await SkillsAPI.downloadFile(fileId)
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Failed to download file"
          })
          throw error
        }
      },
      
      deleteFile: async (fileId: string) => {
        try {
          await SkillsAPI.deleteFile(fileId)
          set((state) => {
            state.uploadedFiles = state.uploadedFiles.filter(file => file.id !== fileId)
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : "Failed to delete file"
          })
        }
      },
      
      // UI actions
      setSkillsPanelVisible: (visible: boolean) => {
        set((state) => {
          state.skillsPanel.isVisible = visible
        })
      },
      
      setSkillsPanelTab: (tab: "library" | "upload" | "versions" | "containers") => {
        set((state) => {
          state.skillsPanel.activeTab = tab
          state.skillsPanel.isVisible = true
        })
      },
      
      setSelectedContainers: (containerIds: string[]) => {
        set((state) => {
          state.selectedContainers = new Set(containerIds)
        })
      },
      
      clearError: () => {
        set((state) => {
          state.error = null
        })
      },
    }))
  )
}

// Hook for using the store in React components
export const useSkillsStore = createSkillsStore
