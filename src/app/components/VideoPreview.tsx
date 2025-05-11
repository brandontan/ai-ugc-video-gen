'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoPreviewProps {
  videoUrl: string
  isProcessing?: boolean
  processingProgress?: number
  error?: string | null
}

export default function VideoPreview({
  videoUrl,
  isProcessing = false,
  processingProgress = 0,
  error = null
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(video.duration)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
    }
  }, [])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden">
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          controls={false}
        />
        
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-lg mb-2">Processing Video...</div>
              <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <div className="text-white text-sm mt-1">
                {processingProgress.toFixed(0)}%
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-red-500 text-center p-4">
              <div className="text-lg font-medium mb-2">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-900">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="text-white hover:text-blue-400 transition-colors"
            disabled={isProcessing}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>

          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
              disabled={isProcessing}
            />
          </div>

          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  )
} 