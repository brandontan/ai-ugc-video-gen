import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

async function handler(request: Request) {
  try {
    const {
      productImage,
      avatar,
      voice,
      prompt
    } = await request.json()

    if (!productImage || !avatar || !voice || !prompt) {
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
          avatar: avatar,
          voice: voice
        },
        options: {
          preview: true,
          duration: 5
        }
      })
    })

    if (!response.ok) throw new Error('Failed to generate preview')
    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    )
  }
}

export const POST = requireAuth(handler) 