interface ArrowIconProps {
  direction?: 'up' | 'down' | 'left' | 'right'
  size?: number
}

export function ArrowIcon({ direction = 'right', size = 20 }: ArrowIconProps) {
  const rotations = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  }

  const scale = size / 24

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2 / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
