import type { ComponentType, ReactNode } from "react"

export function OrdersStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: ReactNode
  icon: ComponentType<{ className?: string; stroke?: string | number }>
}) {
  return (
    <div className="metric-card">
      <div>
        <p className="eyebrow-label-soft">{label}</p>
        <p className="mt-2 font-serif text-3xl font-semibold text-foreground">
          {value}
        </p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icon className="h-5 w-5" stroke={1.8} />
      </div>
    </div>
  )
}
