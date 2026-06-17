export default function ServiceCardSkeleton() {
  return (
    <div className="bg-dark-surface border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-dark-card" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-16 bg-dark-card rounded-full" />
        <div className="h-5 w-3/4 bg-dark-card rounded-full" />
        <div className="h-3 w-full bg-dark-card rounded-full" />
        <div className="h-3 w-2/3 bg-dark-card rounded-full" />
        <div className="flex justify-between items-center pt-3">
          <div className="h-5 w-20 bg-dark-card rounded-full" />
          <div className="h-9 w-24 bg-dark-card rounded-xl" />
        </div>
      </div>
    </div>
  );
}