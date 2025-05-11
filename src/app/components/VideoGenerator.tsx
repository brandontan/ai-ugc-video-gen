import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import FileUpload from './FileUpload'
import VoiceSelector from './VoiceSelector'
import PromptInput from './PromptInput'

interface GenerationOptions {
  productImage: File | null
  voiceId: string
  prompt: string
}

export default function VideoGenerator() {
  const { user } = useAuth()
  const [options, setOptions] = useState<GenerationOptions>({
    productImage: null,
    voiceId: '',
    prompt: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!options.productImage || !options.voiceId || !options.prompt) {
      setError('Please fill in all fields')
      return
    }

    try {
      setIsGenerating(true)
      setError(null)

      const response = await fetch('/api/runway/generate-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
      })

      if (!response.ok) throw new Error('Failed to generate video')
      const data = await response.json()
      setVideoUrl(data.videoUrl)
    } catch (err) {
      setError('Failed to generate video')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Generate Video</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium mb-2">Product Image</h2>
          <FileUpload
            label="Upload Product Image"
            accept="image/*"
            onUpload={(file) => setOptions(prev => ({ ...prev, productImage: file }))}
          />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Voice</h2>
          <VoiceSelector
            onSelect={(voiceId) => setOptions(prev => ({ ...prev, voiceId }))}
            selectedVoiceId={options.voiceId}
          />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Video Prompt</h2>
          <PromptInput
            value={options.prompt}
            onChange={(prompt) => setOptions(prev => ({ ...prev, prompt }))}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Video'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {videoUrl && (
          <div className="space-y-2">
            <video
              src={videoUrl}
              controls
              className="w-full rounded-lg"
            />
            <a
              href={videoUrl}
              download
              className="block text-center px-4 py-2 bg-green-500 text-white rounded"
            >
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 