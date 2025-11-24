import { createFileRoute, Link } from '@tanstack/react-router'
import { Heading } from 'react-aria-components'
import { Button } from '../components/Button'
import { ArrowIcon } from '../components/ArrowIcon'
import { getLevelStars, isLevelUnlocked } from '../utils/progress'

export const Route = createFileRoute('/levels')({
  component: LevelsPage,
})

const MAX_LEVEL = 500

function LevelsPage() {
  return (
    <main style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/">
          <Button variant="outline">
            <ArrowIcon direction="left" />
            BACK
          </Button>
        </Link>
        <Heading level={1} style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>SELECT LEVEL</Heading>
        <div style={{ width: '100px' }} />
      </header>

      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', 
        gap: '0.5rem' 
      }}>
        {Array.from({ length: MAX_LEVEL }, (_, i) => i + 1).map(level => {
          const unlocked = isLevelUnlocked(level)
          const stars = getLevelStars(level)
          return (
            <Link key={level} to="/battle" search={{ level }} disabled={!unlocked}>
              <Button 
                variant={unlocked ? 'primary' : 'outline'}
                style={{ 
                  width: '100%', 
                  height: '60px',
                  padding: '1rem',
                  opacity: unlocked ? 1 : 0.3,
                  pointerEvents: unlocked ? 'auto' : 'none',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span>{level}</span>
                {stars > 0 && <span style={{ fontSize: '0.7rem', position: 'absolute', top: '4px', right: '4px' }}>{'★'.repeat(stars)}</span>}
              </Button>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
