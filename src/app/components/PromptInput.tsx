'use client'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
}

export default function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Video Prompt
      </label>
      <textarea
        data-testid="prompt-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your video..."
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        rows={4}
      />
    </div>
  )
} 