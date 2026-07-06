import { LibraryHeader } from '@/features/library/components/LibraryHeader';

export default function LibraryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 animate-pulse">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="h-9 w-32 bg-pf-bg-elevated rounded-lg mb-2" />
          <div className="h-5 w-64 bg-pf-bg-subtle rounded-md" />
        </div>
      </div>
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-pf-bg-card border border-pf-border rounded-2xl p-4 h-28" />
        ))}
      </div>

      {/* Continue Reading Skeleton */}
      <div className="mb-12">
        <div className="h-6 w-40 bg-pf-bg-elevated rounded-md mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="shrink-0 w-[280px] h-[120px] bg-pf-bg-card border border-pf-border rounded-xl" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[1/1.4] w-full bg-pf-bg-subtle rounded-r-lg rounded-l-[3px]" />
            <div>
              <div className="h-5 w-3/4 bg-pf-bg-elevated rounded-md mb-2" />
              <div className="h-4 w-1/2 bg-pf-bg-subtle rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
