import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

const formMessageVariants = {
  default: "rounded-2xl border border-border/60 bg-background px-4 py-3 type-body-sm",
  error:
    "rounded-2xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive",
  errorComfortable:
    "rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive",
  success:
    "rounded-2xl border border-border/60 bg-secondary/50 px-4 py-3 text-sm text-foreground",
} as const

interface FormMessageProps {
  children: ReactNode
  className?: string
  variant?: keyof typeof formMessageVariants
}

export function FormMessage({
  children,
  className,
  variant = "default",
}: FormMessageProps) {
  return (
    <p className={cn(formMessageVariants[variant], className)}>
      {children}
    </p>
  )
}
