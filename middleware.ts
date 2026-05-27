import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  
  // 🐛 DEBUG LOG (akan muncul di terminal `npm run dev`)
  console.log('🔍 [Middleware] Path:', request.nextUrl.pathname)
  console.log('🔍 [Middleware] User:', user?.email || 'null')
  console.log('🔍 [Middleware] Error:', error?.message || 'none')
  console.log('🔍 [Middleware] Cookies:', request.cookies.getAll().map(c => c.name))

  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    console.log('⛔ [Middleware] Blocking access to /admin - no user')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && request.nextUrl.pathname === '/login') {
    console.log('✅ [Middleware] Redirecting logged-in user to /admin')
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/auth/callback'],
}