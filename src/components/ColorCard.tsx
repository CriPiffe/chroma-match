import { Button } from 'react-aria-components'
import { useRef } from 'react'
import { rgbToCmyk } from '../utils/colors'

interface ColorCardProps {
  rgb: [number, number, number]
  onSelect?: () => void
}

export function ColorCard({ rgb, onSelect }: ColorCardProps) {
  const [r, g, b] = rgb
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div style={{ position: 'relative' }}>
      <Button
        ref={buttonRef}
        onPress={onSelect}
        style={{ 
          border: 'none',
          borderRadius: '12px', 
          padding: '0.5rem', 
          width: '120px',
          cursor: onSelect ? 'pointer' : 'default',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateY(0)'
        }}
        onHoverStart={() => {
          if (onSelect && buttonRef.current) {
            buttonRef.current.style.transform = 'translateY(-4px)'
            buttonRef.current.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
          }
        }}
        onHoverEnd={() => {
          if (buttonRef.current) {
            buttonRef.current.style.transform = 'translateY(0)'
            buttonRef.current.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)'
          }
        }}
        aria-label={`Color card: RGB ${r}, ${g}, ${b}`}
      >
        <div style={{ 
          backgroundColor: `rgb(${r}, ${g}, ${b})`, 
          height: '60px', 
          borderRadius: '8px',
          marginBottom: '0.25rem',
          boxShadow: `0 2px 10px rgba(${r}, ${g}, ${b}, 0.4)`,
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }} />
        <div style={{ fontSize: '0.65rem', fontWeight: '500', color: 'rgba(37, 37, 37, 0.9)' }}>
          <div>{r},{g},{b}</div>
          <div>{rgbToCmyk(rgb).join(', ')}</div>
        </div>
      </Button>
    </div>
  )
}
