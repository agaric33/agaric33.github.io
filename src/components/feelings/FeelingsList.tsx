import { useState, useRef, useEffect, type ReactNode } from 'react'

const INITIAL_COUNT = 10
const LOAD_MORE_COUNT = 5

interface FeelingsListProps {
  total: number
  children: ReactNode
}

export function FeelingsList({ total, children }: FeelingsListProps) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(INITIAL_COUNT, total),
  )
  const sentinelRef = useRef<HTMLDivElement>(null)
  const hasMore = visibleCount < total

  useEffect(() => {
    if (!hasMore) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, total))
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, total, visibleCount])

  // Render children with visibility control via wrapper divs
  // children is an array of card elements rendered by Astro
  const items = Array.isArray(children) ? children : [children]

  return (
    <div>
      <div>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: index < visibleCount ? 'block' : 'none',
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex justify-center items-center py-8 text-secondary"
        >
          <i className="iconfont icon-loader animate-spin mr-2" />
          <span className="text-sm">加载中...</span>
        </div>
      )}

      {!hasMore && total > INITIAL_COUNT && (
        <div className="text-center py-8 text-secondary text-sm">
          没有更多了
        </div>
      )}
    </div>
  )
}