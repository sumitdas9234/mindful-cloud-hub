
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

function TableRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 py-3">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-5 w-1/6" />
      <Skeleton className="h-5 w-1/6" />
      <Skeleton className="h-5 w-1/6" />
      <Skeleton className="h-5 w-1/6" />
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b p-4">
        <div className="flex items-center space-x-4 py-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        {Array(rows).fill(0).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      
      <TableSkeleton rows={5} />
    </div>
  )
}

export { 
  Skeleton, 
  StatCardSkeleton, 
  ChartSkeleton, 
  ResourceCardSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  PageSkeleton
}
