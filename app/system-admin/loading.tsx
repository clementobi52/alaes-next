import { AlaesLoader } from '@/components/alaes-loader'

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <AlaesLoader size={72} label="Loading" />
    </div>
  )
}
