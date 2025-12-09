import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  File, 
  Folder, 
  X, 
  CheckCircle,
  AlertCircle,
  FileText
} from "lucide-react"
import { useSkillsStore } from "@/stores/skills-store"
import type { SkillUpload } from "@/types/skills.types"

interface SkillUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const SkillUploadDialog: React.FC<SkillUploadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { uploadSkill, isUploading } = useSkillsStore()
  
  const [step, setStep] = useState<"details" | "upload" | "processing">("details")
  const [skillName, setSkillName] = useState("")
  const [skillDescription, setSkillDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Check for required SKILL.md file
    const hasSkillMd = acceptedFiles.some(file => file.name.toLowerCase() === 'skill.md')
    
    if (!hasSkillMd) {
      setError("SKILL.md file is required. Please include a skill description file.")
      return
    }

    setFiles(acceptedFiles)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
      'application/octet-stream': ['.tar', '.gz'],
    },
    maxSize: 8 * 1024 * 1024, // 8MB
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (!skillName.trim()) {
      setError("Skill name is required")
      return
    }
    if (!skillDescription.trim()) {
      setError("Skill description is required")
      return
    }
    if (files.length === 0) {
      setError("Please upload at least one file")
      return
    }
    
    setError(null)
    setStep("upload")
  }

  const handleUpload = async () => {
    try {
      setStep("processing")
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const skillData: SkillUpload = {
        name: skillName,
        description: skillDescription,
        files,
      }

      await uploadSkill(skillData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Reset form and close dialog
      setTimeout(() => {
        handleClose()
      }, 1000)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed")
      setStep("upload")
    }
  }

  const handleClose = () => {
    setStep("details")
    setSkillName("")
    setSkillDescription("")
    setFiles([])
    setUploadProgress(0)
    setError(null)
    onOpenChange(false)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload New Skill</DialogTitle>
          <DialogDescription>
            Create a new skill by uploading your skill files and providing metadata
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${step !== "details" ? "text-green-600" : "text-blue-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step !== "details" ? "bg-green-100" : "bg-blue-100"
              }`}>
                {step !== "details" ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-sm font-medium">Details</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-4 ${step !== "details" ? "bg-green-600" : "bg-gray-200"}`} />
            
            <div className={`flex items-center gap-2 ${
              step === "upload" || step === "processing" ? "text-blue-600" : 
              step === "details" ? "text-gray-400" : "text-green-600"
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "upload" || step === "processing" ? "bg-blue-100" : 
                step === "details" ? "bg-gray-100" : "bg-green-100"
              }`}>
                {step === "details" ? "2" : <CheckCircle className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium">Upload</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-4 ${
              step === "processing" ? "bg-blue-600" : "bg-gray-200"
            }`} />
            
            <div className={`flex items-center gap-2 ${
              step === "processing" ? "text-blue-600" : "text-gray-400"
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "processing" ? "bg-blue-100" : "bg-gray-100"
              }`}>
                3
              </div>
              <span className="text-sm font-medium">Processing</span>
            </div>
          </div>

          {/* Step 1: Details */}
          {step === "details" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="Enter skill name (e.g., Data Analysis)"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use lowercase, numbers, and hyphens only. No reserved words.
                </p>
              </div>

              <div>
                <Label htmlFor="skillDescription">Description</Label>
                <Textarea
                  id="skillDescription"
                  value={skillDescription}
                  onChange={(e) => setSkillDescription(e.target.value)}
                  placeholder="Describe what this skill does and how to use it..."
                  className="mt-1"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max 1024 characters. No HTML/XML tags allowed.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Requirements</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Must include a SKILL.md file with metadata</li>
                  <li>• Maximum total size: 8MB</li>
                  <li>• Supported formats: ZIP, TAR.GZ</li>
                  <li>• Files will be organized in a root directory</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? "Drop files here" : "Upload skill files"}
                </h3>
                <p className="text-sm text-gray-600">
                  Drag and drop your skill files or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Supports ZIP, TAR.GZ files up to 8MB
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Selected Files ({files.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {file.name.toLowerCase().endsWith('.zip') || file.name.toLowerCase().endsWith('.tar.gz') ? (
                          <Folder className="w-5 h-5 text-blue-500" />
                        ) : (
                          <File className="w-5 h-5 text-gray-500" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Processing */}
          {step === "processing" && (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto">
                {uploadProgress === 100 ? (
                  <CheckCircle className="w-16 h-16 text-green-500" />
                ) : (
                  <div className="relative">
                    <FileText className="w-16 h-16 text-blue-500 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {uploadProgress === 100 ? "Upload Complete!" : "Processing Skill..."}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {uploadProgress === 100 
                    ? "Your skill has been uploaded successfully"
                    : "Validating files and creating skill..."
                  }
                </p>
              </div>

              {uploadProgress < 100 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            
            {step === "details" && (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
            
            {step === "upload" && (
              <Button 
                onClick={handleUpload} 
                disabled={files.length === 0 || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Skill"}
              </Button>
            )}
            
            {step === "processing" && uploadProgress === 100 && (
              <Button onClick={handleClose}>
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
