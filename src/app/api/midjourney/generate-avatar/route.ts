import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

async function handler(request: Request, user: any) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // TODO: Implement Midjourney API integration
    const response = await fetch('https://api.midjourney.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MIDJOURNEY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: '1:1',
        style: 'portrait',
        quality: 'high'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate avatar')
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Avatar generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate avatar' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler) 