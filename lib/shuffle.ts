/**
 * Shuffle utility functions for randomizing profile display
 */

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 * @param array - Array to shuffle
 * @returns Shuffled copy of the array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Get a random item from an array
 * @param array - Array to pick from
 * @returns Random item or null if array is empty
 */
export function getRandomItem<T>(array: T[]): T | null {
  if (array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Shuffle profiles by category
 * @param profiles - Array of profiles
 * @param category - Optional category filter
 * @returns Shuffled profiles
 */
export function shuffleProfiles<T extends { category: string }>(profiles: T[], category?: string): T[] {
  const filtered = category ? profiles.filter((p) => p.category === category) : profiles
  return shuffleArray(filtered)
}
