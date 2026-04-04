export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-white/[0.04]">
      <div className="h-40 sm:h-48 bg-white/[0.06] animate-shimmer" />
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 bg-white/[0.06] rounded-full w-3/4" />
        <div className="h-3 bg-white/[0.06] rounded-full w-full" />
        <div className="h-3 bg-white/[0.06] rounded-full w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-white/[0.06] rounded-full w-16" />
          <div className="h-8 bg-white/[0.06] rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}
