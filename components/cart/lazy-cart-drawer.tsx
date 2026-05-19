"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { IconShoppingBag } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"

const CartDrawer = dynamic(
  () => import("@/components/cart/cart-drawer").then((module) => module.CartDrawer),
  { ssr: false },
)

export function LazyCartDrawer() {
  const { getItemCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [shouldLoadDrawer, setShouldLoadDrawer] = useState(false)

  useEffect(() => {
    const handleOpenCart = () => {
      setShouldLoadDrawer(true)
      setIsOpen(true)
    }

    window.addEventListener("open-cart", handleOpenCart)

    return () => window.removeEventListener("open-cart", handleOpenCart)
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Cart"
        onClick={() => {
          setShouldLoadDrawer(true)
          setIsOpen(true)
        }}
        onMouseEnter={() => setShouldLoadDrawer(true)}
        onFocus={() => setShouldLoadDrawer(true)}
      >
        <IconShoppingBag className="h-5 w-5" stroke={1.9} />
        {getItemCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {getItemCount}
          </span>
        ) : null}
      </Button>

      {shouldLoadDrawer ? (
        <CartDrawer open={isOpen} onOpenChange={setIsOpen} />
      ) : null}
    </>
  )
}
