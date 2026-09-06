import Image from 'next/image'
import { cn } from '@/lib/utils'

type AlaesLoaderProps = {
  /** Diameter of the spinning mark in pixels. */
  size?: number
  /** Message shown under the mark. Pass null to hide it. */
  label?: string | null
  /** Fill the whole viewport with a themed backdrop. */
  fullScreen?: boolean
  className?: string
}

export function AlaesLoader({
  size = 72,
  label = 'Loading',
  fullScreen = false,
  className,
}: AlaesLoaderProps) {
  const content = (
    <div
      className={cn('flex flex-col items-center justify-center gap-4', className)}
      role="status"
      aria-live="polite"
    >
      <Image
        src="/images/alaes-loader.gif"
        alt=""
        width={size}
        height={size}
        priority
        unoptimized
        className="animate-alaes-float select-none"
        style={{ width: size, height: size }}
      />
      {label ? (
        <span className="text-sm font-medium tracking-wide text-muted-foreground">
          {label}
          <span className="animate-alaes-dots" aria-hidden="true" />
        </span>
      ) : null}
      <span className="sr-only">{label ?? 'Loading'}</span>
    </div>
  )

  if (!fullScreen) return content

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {content}
    </div>
  )
}
