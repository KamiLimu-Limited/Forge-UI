'use client'

import { useEffect, useRef, useState } from 'react'
import type { RatingPointView } from '@/types/peerMentor'

interface RatingTrendChartProps {
  points: RatingPointView[]
}

// Pixels. The chart is drawn at its box's real width, so text never shrinks on phones.
const HEIGHT = 200
const PAD_LEFT = 36
const PAD_RIGHT = 16
const PAD_TOP = 16
const PAD_BOTTOM = 32
const MIN = 3
const MAX = 5
const GRID = [5, 4, 3]

function xFor(index: number, count: number, width: number): number {
  const span = width - PAD_LEFT - PAD_RIGHT
  return count === 1 ? PAD_LEFT + span / 2 : PAD_LEFT + (span * index) / (count - 1)
}

function yFor(rating: number): number {
  const clamped = Math.min(MAX, Math.max(MIN, rating))
  return PAD_TOP + ((MAX - clamped) / (MAX - MIN)) * (HEIGHT - PAD_TOP - PAD_BOTTOM)
}

// A peer mentor's session ratings over time, out of 5. One line, so the card title names it.
// Hovering or focusing a point shows its value; a table carries the same data for screen readers.
export function RatingTrendChart({ points }: RatingTrendChartProps) {
  const [active, setActive] = useState<number | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(240, entry.contentRect.width))
    )
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  if (points.length === 0) {
    return (
      <p className="font-sans text-small text-text-muted">
        Your ratings show here once a session closes.
      </p>
    )
  }

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'}${xFor(index, points.length, width)},${yFor(point.rating)}`
    )
    .join(' ')
  const shown = active === null ? null : points[active]

  return (
    <div className="flex flex-col gap-2">
      <div ref={boxRef} className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${HEIGHT}`}
          width={width}
          height={HEIGHT}
          className="block overflow-visible"
          aria-hidden="true"
          onMouseLeave={() => setActive(null)}
        >
          {GRID.map((value) => (
            <g key={value}>
              <line
                x1={PAD_LEFT}
                x2={width - PAD_RIGHT}
                y1={yFor(value)}
                y2={yFor(value)}
                className="stroke-border"
                strokeWidth={1}
              />
              <text
                x={PAD_LEFT - 8}
                y={yFor(value)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-text-muted font-sans text-caption"
              >
                {value.toFixed(1)}
              </text>
            </g>
          ))}
          <path d={path} fill="none" className="stroke-teal-500" strokeWidth={2} />
          {points.map((point, index) => (
            <g key={`${point.title}-${index}`}>
              <circle
                cx={xFor(index, points.length, width)}
                cy={yFor(point.rating)}
                r={active === index ? 6 : 4.5}
                className="fill-teal-500 stroke-surface"
                strokeWidth={2}
              />
              {/* A bigger invisible target than the dot, so it's easy to hover */}
              <circle
                cx={xFor(index, points.length, width)}
                cy={yFor(point.rating)}
                r={18}
                fill="transparent"
                onMouseEnter={() => setActive(index)}
              />
              <text
                x={xFor(index, points.length, width)}
                y={HEIGHT - 8}
                textAnchor="middle"
                className="fill-text-secondary font-sans text-caption"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
        {shown && active !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md border border-border bg-surface px-2 py-1 font-sans text-caption text-text-primary shadow-card"
            style={{
              left: xFor(active, points.length, width),
              top: yFor(shown.rating) - 8,
            }}
          >
            {shown.title}:{' '}
            <span className="font-mono font-semibold">{shown.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <table className="sr-only">
        <caption>Your rating for each session, out of 5</caption>
        <thead>
          <tr>
            <th scope="col">Session</th>
            <th scope="col">Rating</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point, index) => (
            <tr key={`${point.title}-${index}`}>
              <td>{point.title}</td>
              <td>{point.rating.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
