// app/admin/budaya/[id]/page.tsx
import { getAdminUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import CultureForm from '@/components/admin/CultureForm'

export default async function AdminCultureFormPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser()
  if (!user) redirect('/login')

  const { id } = await params
  const isNew = id === 'new'
  
  let initialData = null
  if (!isNew) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('culture_articles')
      .select('*, villages(slug)')
      .eq('id', id)
      .single()
      
    if (error || !data) return notFound()
    
    initialData = {
      ...data,
      village_slug: data.villages?.slug || ""
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-ocean-800 mb-6">
        {isNew ? '🎭 Tambah Artikel Budaya' : '✏️ Edit Artikel Budaya'}
      </h1>
      <CultureForm initialData={initialData} isNew={isNew} />
    </div>
  )
}