import React, { useCallback, useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { cn } from '../lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isProcessing?: boolean
  processingProgress?: number
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isProcessing = false,
  processingProgress = 0
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a PDF, DOCX, DOC, or TXT file'
    }
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return 'File size must be less than 10MB'
    }
    
    return null
  }

  const handleFile = useCallback((file: File) => {
    const errorMessage = validateFile(file)
    if (errorMessage) {
      setError(errorMessage)
      return
    }
    
    setError(null)
    setSelectedFile(file)
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [handleFile])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [handleFile])

  if (isProcessing) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Processing Your Resume</h3>
              <p className="text-muted-foreground">Parsing content and applying Harvard format...</p>
            </div>
            <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-muted-foreground">{processingProgress}% complete</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
            error ? "border-destructive bg-destructive/10" : "",
            selectedFile ? "border-green-500 bg-green-50" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleChange}
          />
          
          <div className="space-y-4">
            {error ? (
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            ) : selectedFile ? (
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
            )}
            
            <div>
              {selectedFile ? (
                <div>
                  <h3 className="text-lg font-semibold text-green-700">File Selected Successfully</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              ) : error ? (
                <div>
                  <h3 className="text-lg font-semibold text-destructive">{error}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please try again with a valid file
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">Upload Your Resume</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag and drop your resume here, or click to browse
                  </p>
                </div>
              )}
            </div>
            
            <Button
              type="button"
              variant={selectedFile ? "secondary" : "default"}
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <FileText className="h-4 w-4 mr-2" />
              {selectedFile ? 'Choose Different File' : 'Select File'}
            </Button>
            
            <div className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX, DOC, TXT (Max: 10MB)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}