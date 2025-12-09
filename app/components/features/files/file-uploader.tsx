// File Upload Component with Drag & Drop
'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  X,
  Check,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface FileUploadItem {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

interface FileUploaderProps {
  onUpload?: (files: File[]) => Promise<void>
  maxSize?: number // in bytes
  maxFiles?: number
  accept?: Record<string, string[]>
  className?: string
}

export function FileUploader({
  onUpload,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  accept,
  className,
}: FileUploaderProps) {
  const [uploadQueue, setUploadQueue] = useState<FileUploadItem[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Create upload items
    const newItems: FileUploadItem[] = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
      status: 'uploading' as const,
    }))

    setUploadQueue(prev => [...prev, ...newItems])

    // Simulate upload progress (replace with actual upload logic)
    for (const item of newItems) {
      try {
        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadQueue(prev =>
            prev.map(i =>
              i.id === item.id ? { ...i, progress } : i
            )
          )
        }

        // Mark as success
        setUploadQueue(prev =>
          prev.map(i =>
            i.id === item.id ? { ...i, status: 'success' as const, progress: 100 } : i
          )
        )

        // Call onUpload callback
        if (onUpload) {
          await onUpload([item.file])
        }
      } catch (error) {
        // Mark as error
        setUploadQueue(prev =>
          prev.map(i =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : i
          )
        )
      }
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    maxFiles,
    accept,
  })

  const removeFile = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id))
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
      return <ImageIcon className="h-5 w-5" />
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) {
      return <Video className="h-5 w-5" />
    }
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) {
      return <Music className="h-5 w-5" />
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <Archive className="h-5 w-5" />
    }
    if (['txt', 'md', 'doc', 'docx', 'pdf'].includes(ext || '')) {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <Card
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: isDragActive ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload
              className={cn(
                'h-12 w-12 mb-4',
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </motion.div>

          <h3 className="text-lg font-semibold mb-2">
            {isDragActive ? 'Drop files here' : 'Upload files'}
          </h3>

          <p className="text-sm text-muted-foreground text-center mb-4">
            Drag and drop files here, or click to select files
          </p>

          <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
            <span>Max size: {formatFileSize(maxSize)}</span>
            <span>•</span>
            <span>Max files: {maxFiles}</span>
          </div>
        </div>
      </Card>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">
            Uploads ({uploadQueue.length})
          </h4>

          <AnimatePresence>
            {uploadQueue.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-3">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getFileIcon(item.file.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {item.file.name}
                        </p>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {formatFileSize(item.file.size)}
                        </span>
                      </div>

                      {/* Progress or Status */}
                      {item.status === 'uploading' && (
                        <div className="space-y-1">
                          <Progress value={item.progress} className="h-1" />
                          <p className="text-xs text-muted-foreground">
                            Uploading... {item.progress}%
                          </p>
                        </div>
                      )}

                      {item.status === 'success' && (
                        <div className="flex items-center gap-1 text-green-500">
                          <Check className="h-3 w-3" />
                          <span className="text-xs">Upload complete</span>
                        </div>
                      )}

                      {item.status === 'error' && (
                        <div className="flex items-center gap-1 text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          <span className="text-xs">{item.error || 'Upload failed'}</span>
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0"
                      onClick={() => removeFile(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
