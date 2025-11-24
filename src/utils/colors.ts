export type RGB = [number, number, number]
export type CMYK = [number, number, number, number]

export function rgbToCmyk(rgb: RGB): CMYK {
  const [r, g, b] = rgb.map(v => v / 255)
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return [0, 0, 0, 100]
  const c = Math.round(((1 - r - k) / (1 - k)) * 100)
  const m = Math.round(((1 - g - k) / (1 - k)) * 100)
  const y = Math.round(((1 - b - k) / (1 - k)) * 100)
  return [c, m, y, Math.round(k * 100)]
}

export function mixColors(colors: RGB[]): RGB {
  if (colors.length === 0) return [128, 128, 128]
  const sum = colors.reduce((acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b], [0, 0, 0])
  return [Math.round(sum[0] / colors.length), Math.round(sum[1] / colors.length), Math.round(sum[2] / colors.length)]
}

export function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2) + Math.pow(c1[2] - c2[2], 2))
}

export function getSimilarity(c1: RGB, c2: RGB): number {
  const maxDistance = Math.sqrt(255 * 255 * 3)
  return 1 - colorDistance(c1, c2) / maxDistance
}