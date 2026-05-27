// app/admin/berita/[id]/page.tsx
import { getAdminUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import NewsForm from '@/components/admin/NewsForm'

export default async function AdminNewsFormPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser()
  if (!user) redirect('/login')

  const { id } = await params
  const isNew = id === 'new'
  
  let initialData = null
  if (!isNew) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('news').select('*').eq('id', id).single()
    if (error || !data) return notFound()
    initialData = data
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-ocean-800 mb-6">
        {isNew ? '📝 Tambah Artikel Berita' : '✏️ Edit Artikel Berita'}
      </h1>
      <NewsForm initialData={initialData} isNew={isNew} />
    </div>
  )
}