import { getRelativeTime } from '@/utils/date'
import { useEffect, useState } from 'react'

export function RelativeTime({ date }: { date: Date }) {
  // Initial state is null to avoid hydration mismatch; relative time is
  // computed on the client at runtime so it reflects the visit moment,
  // not the build moment.
  const [relative, setRelative] = useState<string | null>(null)

  useEffect(() => {
    setRelative(getRelativeTime(date))
  }, [date])

  if (!relative) return null

  return (
    <>
      <span>·</span>
      <span className="text-accent/70">{relative}</span>
    </>
  )
}
