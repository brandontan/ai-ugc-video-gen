'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import VideoPreview from './VideoPreview'

interface ProcessingOptions {
  removeBackground: boolean
  addSubtitles: boolean
  targetDuration?: number
}

export default function VideoUpload() {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [options, setOptions] = useState<ProcessingOptions>({
    removeBackground: false,
    addSubtitles: false
  })
  const { user } = useAuth()

  const handleProcess = async () => {
    setError(null)
    setProcessedUrl(null)
    if (!user) {
      setError('Please log in to process videos')
      return
    }
    if (!videoUrl.trim()) {
      setError('Please enter a video URL')
      return
    }
    setProcessing(true)
    setProcessingProgress(0)
    try {
      const response = await fetch('/api/video/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          options
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Processing failed')
      }
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 5
        })
      }, 1000)
      setProcessedUrl(data.processedUrl || videoUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
    } finally {
      setProcessing(false)
      setProcessingProgress(0)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert" data-testid="error-message">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="space-y-4">
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Enter video URL (e.g. https://...)"
          value={videoUrl}
          onChange={e => setVideoUrl(e.target.value)}
          disabled={processing}
        />
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.removeBackground}
              onChange={e => setOptions(prev => ({ ...prev, removeBackground: e.target.checked }))}
              className="rounded text-blue-500"
              disabled={processing}
            />
            <span>Remove Background</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.addSubtitles}
              onChange={e => setOptions(prev => ({ ...prev, addSubtitles: e.target.checked }))}
              className="rounded text-blue-500"
              disabled={processing}
            />
            <span>Add Subtitles</span>
          </label>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleProcess}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Process Video'}
        </button>
      </div>
      {processedUrl && (
        <VideoPreview
          videoUrl={processedUrl}
          isProcessing={processing}
          processingProgress={processingProgress}
          error={error}
        />
      )}
    </div>
  )
} 