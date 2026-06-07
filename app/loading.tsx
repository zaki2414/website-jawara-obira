// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat konten...</p>
      </div>
    </div>
  );
}
