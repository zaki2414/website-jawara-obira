// app/api/auth/logout/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  // 1. Sign out dari Supabase Auth
  await supabase.auth.signOut()
  
  // 2. Redirect ke login di domain APP kita (bukan Supabase!)
  // Gunakan request.url untuk mendapatkan origin aplikasi Next.js
  const origin = new URL(request.url).origin
  return NextResponse.redirect(`${origin}/login`)
}