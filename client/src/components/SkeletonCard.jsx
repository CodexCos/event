const SkeletonCard = () => (
  <div className="glass-card overflow-hidden bg-dark-900 border border-dark-700">
    <div className="h-48 shimmer" />
    <div className="p-5 space-y-3">
      <div className="h-3 shimmer rounded w-1/3" />
      <div className="h-5 shimmer rounded w-4/5" />
      <div className="h-4 shimmer rounded w-full" />
      <div className="h-4 shimmer rounded w-3/4" />
      <div className="flex gap-2 pt-2">
        <div className="h-3 shimmer rounded w-1/4" />
        <div className="h-3 shimmer rounded w-1/4" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
