import { Skeleton } from "@heroui/react/skeleton";

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-1">
            <Skeleton className="h-3.5 w-28 rounded-md" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-11/12 rounded-md" />
        <div className="flex items-center justify-between border-t border-border pt-3">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}
