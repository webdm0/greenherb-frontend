import Image from "next/image"

type BrandLogoProps = {
  size?: number
  className?: string
}

export function BrandLogo({ size = 40, className = "" }: BrandLogoProps) {
  return (
    <div 
      className={`flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brandmark.svg"
        alt="GreenHerb Logo"
        width={size}
        height={size}
        className="w-full h-full"
      />
    </div>
  )
}
