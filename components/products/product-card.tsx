import Image from "next/image"
import Link from "next/link"
import { IconLeaf } from "@tabler/icons-react"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/ui/rating-stars"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  imagePriority?: boolean
}

export function ProductCard({ product, imagePriority = false }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const productHref = `/products/${product.slug ?? product.id}`

  return (
    <div className="product-card-shell group flex h-full flex-col">
      <div className="relative aspect-square bg-secondary/30 overflow-hidden">
        <Link href={productHref} className="absolute inset-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            preload={imagePriority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground text-xs font-semibold">
              -{discount}%
            </Badge>
          )}
          {product.badges?.map((badge) => (
            <Badge
              key={badge}
              variant="secondary"
              className="bg-accent text-accent-foreground text-xs"
            >
              {badge}
            </Badge>
          ))}
        </div>
        {product.organic && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <IconLeaf className="h-4 w-4 text-primary-foreground" stroke={1.9} />
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-card/80 flex items-center justify-center">
            <span className="text-foreground font-medium px-4 py-2 bg-secondary rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-3 sm:space-y-3 sm:p-4">
        <div>
          <Link href={productHref}>
            <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground leading-tight hover:text-accent transition-colors line-clamp-2 sm:line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <RatingStars
            rating={product.rating}
            iconClassName="h-3 w-3 text-gray-300 sm:h-4 sm:w-4"
            filledIconClassName="h-3 w-3 text-amber-400 sm:h-4 sm:w-4"
          />
          <span className="text-xs sm:text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-1 sm:pt-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg sm:text-xl font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <AddToCartButton
            product={product}
            disabled={!product.inStock}
            size="sm"
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  )
}
