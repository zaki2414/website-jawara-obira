// app/debug-env/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function DebugEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Helper: tampilkan 10 karakter pertama saja untuk keamanan
  const mask = (str?: string) => str ? `${str.substring(0, 10)}...` : 'UNDEFINED'

  // 1. Cek apakah env terbaca
  const envLoaded = url && anonKey

  // 2. Tes koneksi langsung via fetch ke Supabase API
  let apiTest = 'Belum dites'
  if (envLoaded) {
    try {
      const res = await fetch(`${url}/rest/v1/villages`, {
        headers: {
          apikey: anonKey!,
          Authorization: `Bearer ${anonKey!}`,
          Prefer: 'count=exact'
        },
        next: { revalidate: 0 } // Bypass cache
      })
      if (res.ok) apiTest = `✅ OK (Status: ${res.status})`
      else if (res.status === 401) apiTest = `❌ 401 Unauthorized (Key salah/RLS memblokir)`
      else if (res.status === 404) apiTest = `❌ 404 Not Found (Tabel 'villages' belum dibuat?)`
      else apiTest = `❌ Error: ${res.status} - ${await res.text().catch(() => '-')}`
    } catch (e: any) {
      apiTest = `❌ Network Error: ${e.message}`
    }
  }

  return (
    <main className="p-6 font-mono text-sm max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">🔍 Debug Environment</h1>
      
      <div className="p-4 bg-gray-100 rounded">
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {mask(url)}</p>
        <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {mask(anonKey)}</p>
        <p><strong>SUPABASE_SERVICE_ROLE_KEY:</strong> {mask(serviceKey)}</p>
      </div>

      <div className={`p-4 rounded ${envLoaded ? 'bg-green-100' : 'bg-red-100'}`}>
        <p><strong>Env Loaded:</strong> {envLoaded ? '✅ Ya' : '❌ Tidak (Cek .env.local & restart server!)'}</p>
      </div>

      <div className="p-4 rounded bg-blue-50 border border-blue-200">
        <p><strong>API Test (Fetch ke /rest/v1/villages):</strong></p>
        <p className="mt-1 font-bold">{apiTest}</p>
      </div>

      <details className="p-4 bg-yellow-50 rounded">
        <summary className="cursor-pointer font-bold">💡 Solusi jika masih error</summary>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>Pastikan server sudah di-<code>restart</code> setelah edit .env.local</li>
          <li>Cek Supabase Dashboard → Settings → API → pastikan Project URL benar</li>
          <li>Pastikan tabel <code>villages</code> sudah dibuat via SQL Editor</li>
          <li>Jika pakai Windows, pastikan tidak ada BOM encoding di file .env.local</li>
        </ul>
      </details>
    </main>
  )
}