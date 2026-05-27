export default async function JournalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="font-serif text-3xl font-bold text-ocean-800">Detail Jurnal: {slug}</h1>
      <p className="text-gray-600 mt-4">Konten jurnal akan dimuat dari database.</p>
    </div>
  )
}