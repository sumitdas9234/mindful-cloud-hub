
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 h-[140px] space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 h-[350px] space-y-3">
      <Skeleton className="h-5 w-1/4 mb-6" />
      <div className="space-y-2">
        <Skeleton className="h-[270px] w-full" />
      </div>
    </div>
  )
}

function ResourceCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 h-[130px] space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  )
}

export { Skeleton, StatCardSkeleton, ChartSkeleton, ResourceCardSkeleton }
