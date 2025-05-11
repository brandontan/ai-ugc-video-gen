import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // TODO: Replace with actual database authentication
    // This is a placeholder for demonstration
    if (email === 'test@example.com' && password === 'password') {
      const token = sign(
        { 
          email,
          id: '1',
          name: 'Test User'
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      )

      // Set secure HTTP-only cookie
      cookies().set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 // 1 day
      })

      return NextResponse.json({
        id: '1',
        email,
        name: 'Test User'
      })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 