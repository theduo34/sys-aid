import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AUTH_PATHS = ['/login', '/register', '/forgot-password']
const VALID_ROLES = ['student', 'staff', 'technician', 'admin']

// Matches /{role}/{uuid}/... — the only protected route structure
const ROLE_ROUTE = /^\/(student|staff|technician|admin)\/[0-9a-f-]{36}(\/.*)?$/

async function getProfile(supabase: ReturnType<typeof createServerClient>, userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return data
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            // Omit maxAge / expires → session cookies cleared when browser closes
            response.cookies.set(name, value, {
              ...options,
              maxAge:  undefined,
              expires: undefined,
            })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isAuthPath  = AUTH_PATHS.some((p) => pathname.startsWith(p))
  const isRoleRoute = ROLE_ROUTE.test(pathname)
  // API routes handle their own auth via requireRole — never redirect them
  const isApiPath   = pathname.startsWith('/api/')

  // Unauthenticated: block all non-auth, non-api paths
  if (!user && !isAuthPath && !isApiPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated on a non-role, non-api route (old paths like /dashboard, /tickets, etc.)
  // Redirect to their correct role-based URL so nothing 404s
  if (user && !isRoleRoute && !isAuthPath && !isApiPath) {
    const profile = await getProfile(supabase, user.id)
    if (profile && VALID_ROLES.includes(profile.role)) {
      return NextResponse.redirect(
        new URL(`/${profile.role}/${user.id}/dashboard`, request.url)
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
