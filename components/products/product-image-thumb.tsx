import Image from "next/image"
import { IconPackage } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ProductImageThumbProps {
  src?: string | null
  alt: string
  sizes: string
  containerClassName?: string
  imageClassName?: string
  fallbackClassName?: string
}

export function ProductImageThumb({
  src,
  alt,
  sizes,
  containerClassName,
  imageClassName,
  fallbackClassName,
}: ProductImageThumbProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-secondary/50",
        containerClassName,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-cover", imageClassName)}
          sizes={sizes}
        />
      ) : (
        <div
          className={cn(
            "flex h-full items-center justify-center text-muted-foreground",
            fallbackClassName,
          )}
        >
          <IconPackage className="h-5 w-5" stroke={1.8} />
        </div>
      )}
    </div>
  )
}
