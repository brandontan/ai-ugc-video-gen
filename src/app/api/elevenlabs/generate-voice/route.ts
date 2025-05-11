import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

async function handler(request: Request, user: any) {
  try {
    const { prompt, voice_id } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // TODO: Implement ElevenLabs API integration
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id || 'default'}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: prompt,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate voice')
    }

    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg'
      }
    })

  } catch (error) {
    console.error('Voice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate voice' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler) 