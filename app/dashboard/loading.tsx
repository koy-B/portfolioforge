export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-[#f8f7f4]">
      {/* Sidebar skeleton */}
      <div className="w-64 shrink-0 h-screen bg-white border-r border-[#e8e4df] p-4 flex flex-col gap-2">
        <div className="h-8 w-36 bg-[#f0ede8] rounded-xl mb-4 animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-[#f8f7f4] rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
        ))}
      </div>
      {/* Content skeleton */}
      <main className="flex-1 p-8">
        <div className="h-8 w-56 bg-[#e8e4df] rounded-xl mb-2 animate-pulse" />
        <div className="h-4 w-40 bg-[#f0ede8] rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-[#e8e4df] animate-pulse" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-[#e8e4df] animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  )
}
