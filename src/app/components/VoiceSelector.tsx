'use client'

import { useState, useEffect } from 'react'

interface Voice {
  id: string
  name: string
}

interface VoiceSelectorProps {
  onSelect: (voiceId: string) => void
  selectedVoiceId?: string
}

export default function VoiceSelector({ onSelect, selectedVoiceId }: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVoices()
  }, [])

  const fetchVoices = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/elevenlabs/voices')
      if (!response.ok) throw new Error('Failed to fetch voices')
      const data = await response.json()
      setVoices(data.voices)
    } catch (err) {
      setError('Failed to load voices')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center text-gray-500">Loading voices...</div>
      ) : (
        <select
          data-testid="voice-selector"
          value={selectedVoiceId || ''}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select a voice</option>
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </select>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  )
} 