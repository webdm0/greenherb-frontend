"use client"

import * as React from "react"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DropdownSelectOption {
  label: string
  value: string
}

interface DropdownSelectProps {
  ariaLabel: string
  ariaDescribedBy?: string
  ariaLabelledBy?: string
  className?: string
  contentClassName?: string
  id?: string
  invalid?: boolean
  onValueChange: (value: string) => void
  options: readonly DropdownSelectOption[]
  placeholder: string
  value?: string
}

export const DropdownSelect = React.forwardRef<
  HTMLButtonElement,
  DropdownSelectProps
>(
  (
    {
      ariaLabel,
      ariaDescribedBy,
      ariaLabelledBy,
      className,
      contentClassName,
      id,
      invalid = false,
      onValueChange,
      options,
      placeholder,
      value,
    },
    ref,
  ) => {
    const activeOption = options.find((option) => option.value === value)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            ref={ref}
            id={id}
            type="button"
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-invalid={invalid ? true : undefined}
            aria-labelledby={ariaLabelledBy}
            className={cn(
              "surface-select-trigger",
              className,
              invalid && "surface-select-trigger-invalid",
            )}
          >
            <span className="line-clamp-1">{activeOption?.label ?? placeholder}</span>
            <IconChevronDown
              data-dropdown-chevron
              className="size-4 shrink-0 opacity-50"
              stroke={1.75}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={cn(
            "min-w-[var(--radix-dropdown-menu-trigger-width)]",
            contentClassName,
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <DropdownMenuItem
                key={option.value}
                className={cn("relative pr-8", isSelected && "font-medium")}
                onSelect={() => onValueChange(option.value)}
              >
                {option.label}
                <span className="absolute right-2 flex size-3.5 items-center justify-center">
                  {isSelected ? <IconCheck className="size-4" stroke={2.2} /> : null}
                </span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
)

DropdownSelect.displayName = "DropdownSelect"
