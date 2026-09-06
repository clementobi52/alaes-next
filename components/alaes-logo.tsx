import Image from 'next/image'
import { cn } from '@/lib/utils'

export function AlaesLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/alaes-logo.png"
      alt="ALAES — Abia Land Administration Enterprise System"
      width={520}
      height={180}
      priority
      className={cn('h-10 w-auto object-contain', className)}
    />
  )
}
