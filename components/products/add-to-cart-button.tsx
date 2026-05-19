"use client"

import { useEffect, useRef, useState } from "react"
import { IconCheck, IconShoppingCart } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useCartActions } from "@/hooks/useCart"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AddToCartButton({
  product,
  disabled = false,
  size = "sm",
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCartActions()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      await addItem(product, 1)
      setIsAdded(true)

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }

      resetTimerRef.current = setTimeout(() => setIsAdded(false), 2000)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Button
      size={size}
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={cn(
        "bg-primary text-primary-foreground transition-all hover:bg-primary/90",
        isAdded && "bg-accent",
        className,
      )}
    >
      {isAdding ? (
        <span className="flex items-center gap-1">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
        </span>
      ) : isAdded ? (
        <span className="flex items-center gap-1">
          <IconCheck className="h-4 w-4" stroke={2.2} />
          Added
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <IconShoppingCart className="h-4 w-4" stroke={1.9} />
          Add
        </span>
      )}
    </Button>
  )
}
