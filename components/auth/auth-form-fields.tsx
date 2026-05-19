"use client"

import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AuthFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  icon: ReactNode
  label: string
  hint?: string
}

export function AuthField({
  className,
  icon,
  label,
  hint,
  ...inputProps
}: AuthFieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative mt-2">
        <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          {icon}
        </span>
        <Input
          className={cn("surface-input mt-0 pl-10", className)}
          {...inputProps}
        />
      </div>
      {hint ? (
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </label>
  )
}

interface PasswordFieldProps extends Omit<AuthFieldProps, "icon" | "type"> {
  icon: ReactNode
  isVisible: boolean
  onToggleVisibility: () => void
}

export function PasswordField({
  className,
  icon,
  isVisible,
  onToggleVisibility,
  disabled,
  label,
  hint,
  ...inputProps
}: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative mt-2">
        <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          {icon}
        </span>
        <Input
          {...inputProps}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          className={cn("surface-input mt-0 pl-10 pr-10", className)}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          disabled={disabled}
        >
          {isVisible ? (
            <IconEyeOff className="h-4 w-4" stroke={1.9} />
          ) : (
            <IconEye className="h-4 w-4" stroke={1.9} />
          )}
        </button>
      </div>
      {hint ? (
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </label>
  )
}
