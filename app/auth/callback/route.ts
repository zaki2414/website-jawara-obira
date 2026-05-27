// app/auth/callback/route.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Jika ada error dari OAuth
  if (error) {
    console.error('OAuth Error:', error, errorDescription)
    return NextResponse.redirect(new URL(`/login?error=${error}`, requestUrl.origin))
  }

  // Siapkan response redirect default
  let response = NextResponse.redirect(new URL('/admin', requestUrl.origin))

  if (code) {
    // Gunakan createServerClient dari @supabase/ssr (bukan supabase-js biasa)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // Baca cookies dari request incoming
          getAll() {
            return request.cookies.getAll()
          },
          // Tulis cookies ke response redirect
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    try {
      // Exchange code for session - sekarang code_verifier akan terbaca dari cookie!
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) throw exchangeError
      
      console.log('✅ Session exchanged successfully')
      
    } catch (err: any) {
      console.error('❌ Exchange code failed:', err)
      return NextResponse.redirect(new URL('/login?error=exchange_failed', requestUrl.origin))
    }
  }

  // Return response yang sudah berisi cookies session
  return response
}