import { IconStarFilled } from "@tabler/icons-react"

interface RatingStarsProps {
  rating: number
  className?: string
  iconClassName?: string
  filledIconClassName?: string
}

export function RatingStars({
  rating,
  className = "rating-stars",
  iconClassName = "rating-star-icon",
  filledIconClassName = "rating-star-icon-filled",
}: RatingStarsProps) {
  const clampedRating = Math.max(0, Math.min(5, rating))

  return (
    <div className={className}>
      {Array.from({ length: 5 }, (_, index) => {
        const fillPercentage = Math.max(0, Math.min(1, clampedRating - index)) * 100

        return (
          <div key={index} className="relative">
            <IconStarFilled className={iconClassName} />
            {fillPercentage > 0 ? (
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <IconStarFilled className={filledIconClassName} />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
