import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

async function handler(request: Request) {
  try {
    const { productImage, voiceId, prompt } = await request.json()

    if (!productImage || !voiceId || !prompt) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.runwayml.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        inputs: {
          product_image: productImage,
          voice: voiceId
        },
        options: {
          duration: 30
        }
      })
    })

    if (!response.ok) throw new Error('Failed to generate video')
    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler) 