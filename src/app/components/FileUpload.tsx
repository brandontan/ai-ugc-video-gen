'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onUpload: (url: string) => void
  accept?: string
  maxSize?: number
  label: string
}

export default function FileUpload({
  onUpload,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      }

      // Upload file
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload file')
      const data = await response.json()
      onUpload(data.url)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: false
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        data-testid="file-upload"
        className={`
          border-2 border-dashed rounded-lg p-6
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-colors duration-200
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">{label}</div>
          <div className="mt-2 text-sm text-gray-500">
            {isDragActive ? (
              'Drop the file here'
            ) : (
              <>
                Drag and drop, or{' '}
                <span className="text-blue-500">browse</span>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-blue-500">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  )
} 