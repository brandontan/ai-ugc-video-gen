import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export async function getAuthUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request 
      ? request.cookies.get('auth-token')?.value
      : cookies().get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest) => {
    const user = await getAuthUser(request)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return handler(request, user)
  }
} 