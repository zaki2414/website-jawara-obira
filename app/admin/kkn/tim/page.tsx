// app/admin/kkn/tim/page.tsx
import { getAllKKNTeamMembers } from '@/lib/supabase/queries'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminKKNTeamList() {
  const { data: members, error } = await getAllKKNTeamMembers()
  
  if (error) {
      return (
        <div className="p-4">
          <p className="text-red-600">Error: {String(error)}</p>
        </div>
      );
    }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-ocean-800">Manajemen Tim KKN</h1>
        <Link 
          href="/admin/kkn/tim/new" 
          className="bg-ocean-600 text-ocean-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition"
        >
          + Tambah Anggota
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 border-b border-sand-200">
            <tr>
              <th className="p-4 font-medium text-gray-600">Nama</th>
              <th className="p-4 font-medium text-gray-600">Role - Klaster</th>
              <th className="p-4 font-medium text-gray-600">Prodi</th>
              <th className="p-4 font-medium text-gray-600">Desa</th>
              <th className="p-4 font-medium text-gray-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {members?.map((m: any) => (
              <tr key={m.id} className="hover:bg-sand-50">
                <td className="p-4 font-medium text-gray-800">{m.name}</td>
                <td className="p-4 text-gray-600">{m.cluster}</td>
                <td className="p-4 text-gray-600">{m.study_program}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-ocean-50 text-ocean-700 text-xs rounded-full capitalize">
                    {m.village_placement}
                  </span>
                </td>
                <td className="p-4 text-center space-x-3">
                  <Link href={`/admin/kkn/tim/${m.id}`} className="text-ocean-600 hover:text-ocean-700 font-medium">
                    Edit
                  </Link>
                  <DeleteButton 
                    table="kkn_members" 
                    id={m.id} 
                    title={m.name} 
                    redirectAfter="/admin/kkn/tim" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!members || members.length === 0) && (
          <p className="p-6 text-center text-gray-500">Belum ada anggota tim.</p>
        )}
      </div>
    </div>
  )
}