interface ImageProps {
  src: string
  alt: string
  className?: string
}

const FALLBACK_IMAGE = '/images/placeholder.svg'

export default function Image({ src, alt, className = '' }: ImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGE
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      onError={handleError}
      loading="lazy"
    />
  )
}
