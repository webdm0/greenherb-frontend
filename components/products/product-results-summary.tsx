import { cn } from "@/lib/utils"

interface ProductResultsSummaryProps {
  from: number
  to: number
  total: number
  className?: string
}

export function ProductResultsSummary({
  from,
  to,
  total,
  className,
}: ProductResultsSummaryProps) {
  return (
    <p className={cn("type-body-sm", className)}>
      Showing{" "}
      <span className="font-medium text-foreground">
        {from}-{to}
      </span>{" "}
      of <span className="font-medium text-foreground">{total}</span> products
    </p>
  )
}
