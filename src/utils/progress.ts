type LevelProgress = {
  stars: number
  completed: boolean
}

type GameProgress = {
  [level: number]: LevelProgress
}

const STORAGE_KEY = 'gameProgress'

export function getProgress(): GameProgress {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : {}
}

export function saveProgress(level: number, stars: number) {
  const progress = getProgress()
  progress[level] = { stars, completed: true }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function getLevelStars(level: number): number {
  return getProgress()[level]?.stars || 0
}

export function isLevelUnlocked(level: number): boolean {
  if (level === 1) return true
  const progress = getProgress()
  return progress[level - 1]?.completed || false
}

export function getHighestUnlockedLevel(): number {
  const progress = getProgress()
  const levels = Object.keys(progress).map(Number).filter(l => progress[l].completed)
  return levels.length > 0 ? Math.max(...levels) + 1 : 1
}
