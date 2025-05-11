import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'

async function handler(request: Request) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Authorization': `Bearer ${process.env.ELEVENLABS_API_KEY}`
      }
    })

    if (!response.ok) throw new Error('Failed to fetch voices')
    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handler) 