import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ColorCard } from '../components/ColorCard'
import { Heading } from 'react-aria-components'
import { Button } from '../components/Button'
import { ArrowIcon } from '../components/ArrowIcon'
import { saveProgress, getLevelStars, isLevelUnlocked, getHighestUnlockedLevel } from '../utils/progress'
import { getSimilarity, mixColors, rgbToCmyk, type RGB } from '../utils/colors'
import { ColorRadar } from '../components/ColorRadar'

export const Route = createFileRoute('/battle')({
  component: BattlePage,
  validateSearch: (search: Record<string, unknown>) => ({
    level: Number(search?.level) || undefined,
  }),
})

const MAX_LEVEL = 500

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function randomColor(seed: number = Math.floor(Math.random()) + 100): RGB {
  const rng = seededRandom(seed)
  return [Math.floor(rng() * 256), Math.floor(rng() * 256), Math.floor(rng() * 256)]
}

function getGameColors(): RGB[] {
  const rand = () => Math.floor(Math.random() * 256)
  const high = () => Math.floor(Math.random() * 56) + 200
  return [
    [255, 0, 0],     // Pure Red
    [0, 255, 0],     // Pure Green
    [0, 0, 255],     // Pure Blue
    [rand(), rand(), high()], // Blueish
    [high(), rand(), rand()], // Reddish
    [rand(), high(), rand()], // Greenish
  ]
}

function getStars(similarity: number): number {
  if (similarity >= 0.95) return 3
  if (similarity >= 0.90) return 2
  if (similarity >= 0.80) return 1
  return 0
}

function BattlePage() {
  const navigate = useNavigate()
  const { level: urlLevel } = Route.useSearch()
  const level = urlLevel || getHighestUnlockedLevel()
  const [targetColor, setTargetColor] = useState<RGB>(randomColor())
  const [availableCards, setAvailableCards] = useState<RGB[]>([])
  const [selectedCards, setSelectedCards] = useState<RGB[]>([])
  const [previewCards, setPreviewCards] = useState<RGB[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [savedStars, setSavedStars] = useState(getLevelStars(level))

  useEffect(() => {
    if (!isLevelUnlocked(level)) {
      navigate({ to: '/levels' })
    }
  }, [level, navigate])

  useEffect(() => {
    setTargetColor(randomColor(level))
    setAvailableCards(getGameColors())
    setSelectedCards([])
    setPreviewCards([])
    setGameOver(false)
    setSavedStars(getLevelStars(level))
  }, [level])

  const mixedColor = mixColors(selectedCards)
  const previewColor = mixColors([...selectedCards, ...previewCards])
  const similarity = selectedCards.length > 0 ? getSimilarity(mixedColor, targetColor) : 0
  const previewSimilarity = previewCards.length > 0 ? getSimilarity(previewColor, targetColor) : similarity
  const stars = getStars(similarity)

  const handleCardPreview = (color: RGB) => {
    setPreviewCards([...previewCards, color])
  }

  const handleConfirmMix = () => {
    const newSelected = [...selectedCards, ...previewCards]
    const newAvailable = availableCards.filter(c => !previewCards.includes(c))
    setSelectedCards(newSelected)
    setAvailableCards(newAvailable)
    setPreviewCards([])
    
    const newMixed = mixColors(newSelected)
    const newSimilarity = getSimilarity(newMixed, targetColor)
    const newStars = getStars(newSimilarity)
    
    if (newStars === 3 || newAvailable.length === 0) {
      setGameOver(true)
    }
  }

  const handleCancelPreview = () => {
    setPreviewCards([])
  }

  const handleReset = () => {
    navigate({ to: '/battle', search: { level } })
  }

  const handleNextLevel = () => {
    if (stars >= 1) {
      saveProgress(level, Math.max(stars, savedStars))
    }
    if (level <= MAX_LEVEL) {
      navigate({ to: '/battle', search: { level: level + 1 } })
    }
  }

  return (
    <main style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/">
          <Button variant="outline">
            <ArrowIcon direction="left" />
            BACK
          </Button>
        </Link>
        <Heading level={1} style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>LEVEL {level}</Heading>
        <Button variant="outline" onPress={handleReset}>
          RETRY
        </Button>
      </header>
      
      <section style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', marginBottom: '1.5rem', alignItems: 'start' }}>
        <div>
          <Heading level={2} style={{ marginBottom: '0.75rem', fontSize: '0.9rem', letterSpacing: '0.1em' }}>TARGET</Heading>
          <div style={{ 
            backgroundColor: `rgb(${targetColor[0]}, ${targetColor[1]}, ${targetColor[2]})`,
            height: '150px',
            border: '2px solid #000'
          }} />
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
            <div>RGB: {targetColor[0]}, {targetColor[1]}, {targetColor[2]}</div>
            <div>CMYK: {rgbToCmyk(targetColor).join(', ')}</div>
          </div>
        </div>

        <ColorRadar target={targetColor} preview={previewCards.length > 0 ? previewColor : mixedColor} similarity={previewCards.length > 0 ? previewSimilarity : similarity} />

        <div>
          <Heading level={2} style={{ marginBottom: '0.75rem', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{previewCards.length > 0 ? 'PREVIEW' : 'YOUR MIX'}</Heading>
          <div style={{ 
            backgroundColor: `rgb(${previewCards.length > 0 ? previewColor[0] : mixedColor[0]}, ${previewCards.length > 0 ? previewColor[1] : mixedColor[1]}, ${previewCards.length > 0 ? previewColor[2] : mixedColor[2]})`,
            height: '150px',
            border: `2px solid ${previewCards.length > 0 ? '#3b82f6' : '#000'}`
          }} />
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
            <div>RGB: {previewCards.length > 0 ? `${previewColor[0]}, ${previewColor[1]}, ${previewColor[2]}` : `${mixedColor[0]}, ${mixedColor[1]}, ${mixedColor[2]}`}</div>
            <div>CMYK: {rgbToCmyk(previewCards.length > 0 ? previewColor : mixedColor).join(', ')}</div>
          </div>
          {(selectedCards.length > 0 || previewCards.length > 0) && (
            <p style={{ marginTop: '0.5rem', fontSize: '1.5rem' }}>
              {previewCards.length > 0 ? `${'★'.repeat(getStars(previewSimilarity))}${'☆'.repeat(3-getStars(previewSimilarity))}` : (stars > 0 ? `${'★'.repeat(stars)}${'☆'.repeat(3-stars)}` : '☆☆☆')}
            </p>
          )}
          {previewCards.length > 0 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              <Button onPress={handleConfirmMix}>CONFIRM</Button>
              <Button variant="outline" onPress={handleCancelPreview}>CANCEL</Button>
            </div>
          )}
        </div>
      </section>

      {gameOver && (
        <div style={{ 
          padding: '1rem', 
          border: '2px solid #000',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontSize: '1.5rem',
          letterSpacing: '0.05em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{stars === 3 ? '★★★ PERFECT' : `${'★'.repeat(stars)}${'☆'.repeat(3-stars)}`}</span>
          {stars >= 1 && level < MAX_LEVEL && (
            <Button onPress={handleNextLevel}>
              NEXT LEVEL
            </Button>
          )}
        </div>
      )}

      {!gameOver && (
        <section style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <Heading level={2} style={{ fontSize: '0.9rem', letterSpacing: '0.1em' }}>AVAILABLE</Heading>
            {stars > 0 && previewCards.length === 0 && (
              <Button variant="outline" onPress={() => setGameOver(true)} style={{ fontSize: '0.8rem' }}>
                END BATTLE
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {availableCards.filter(c => !previewCards.includes(c)).map((color, i) => (
              <ColorCard key={i} rgb={color} onSelect={() => handleCardPreview(color)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <Heading level={2} style={{ marginBottom: '0.75rem', fontSize: '0.9rem', letterSpacing: '0.1em' }}>SELECTED</Heading>
        <div style={{ display: 'flex', gap: '0.75rem', minHeight: '60px', alignItems: 'center' }}>
          {selectedCards.length === 0 && previewCards.length === 0 ? (
            <p style={{ opacity: 0.3, fontSize: '0.9rem' }}>—</p>
          ) : (
            <>
              {selectedCards.map((color, i) => (
                <ColorCard key={i} rgb={color} />
              ))}
              {previewCards.map((color, i) => (
                <div key={`preview-${i}`} style={{ opacity: 0.6, border: '2px dashed #3b82f6', borderRadius: '12px' }}>
                  <ColorCard rgb={color} />
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
