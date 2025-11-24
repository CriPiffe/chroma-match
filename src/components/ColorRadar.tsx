type RGB = [number, number, number]

interface ColorRadarProps {
  target: RGB
  preview: RGB
  similarity: number
}

export function ColorRadar({ target, preview, similarity }: ColorRadarProps) {
  const size = 200
  const center = size / 2
  const radius = 70
  
  const points = ['R', 'G', 'B']
  const angleStep = (Math.PI * 2) / 3
  
  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2
    const r = (value / 255) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  }
  
  const targetPath = points.map((_, i) => {
    const p = getPoint(target[i], i)
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  }).join(' ') + ' Z'
  
  const previewPath = points.map((_, i) => {
    const p = getPoint(preview[i], i)
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  }).join(' ') + ' Z'
  
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ border: '2px solid #000', background: '#fff' }}>
        {[25, 50, 75, 100].map(pct => (
          <circle key={pct} cx={center} cy={center} r={(pct / 100) * radius} fill="none" stroke="#ddd" strokeWidth="1" />
        ))}
        {points.map((label, i) => {
          const angle = angleStep * i - Math.PI / 2
          const x = center + (radius + 20) * Math.cos(angle)
          const y = center + (radius + 20) * Math.sin(angle)
          return <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold">{label}</text>
        })}
        <path d={targetPath} fill="rgba(0, 0, 0, 0.1)" stroke="#000" strokeWidth="2" />
        <path d={previewPath} fill={`rgba(59, 130, 246, ${similarity * 0.3})`} stroke="#3b82f6" strokeWidth="2" />
      </svg>
      <div style={{ marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        {Math.round(similarity * 100)}% Match
      </div>
    </div>
  )
}
