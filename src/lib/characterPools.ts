import type { CharacterType, PasswordOptions } from '../types/password'

export const CHARACTER_POOLS: Record<CharacterType, string> = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  special: '!@#$%^&*()-_=+[]{}|;:,.<>?',
}

const SIMILAR_CHARACTERS = new Set(['O', '0', 'I', 'l'])

export function getEnabledCharacterTypes(options: PasswordOptions): CharacterType[] {
  return [
    options.includeLowercase ? 'lowercase' : null,
    options.includeUppercase ? 'uppercase' : null,
    options.includeNumbers ? 'numbers' : null,
    options.includeSpecial ? 'special' : null,
  ].filter((type): type is CharacterType => type !== null)
}

export function dedupeCharacters(characters: string): string {
  return Array.from(new Set(characters.split(''))).join('')
}

export function filterSimilarCharacters(characters: string): string {
  return characters
    .split('')
    .filter((character) => !SIMILAR_CHARACTERS.has(character))
    .join('')
}

export function getPoolForType(type: CharacterType, excludeSimilar: boolean): string {
  const pool = CHARACTER_POOLS[type]
  return excludeSimilar ? filterSimilarCharacters(pool) : pool
}

export function buildCharacterPool(options: PasswordOptions): string {
  const pool = getEnabledCharacterTypes(options)
    .map((type) => getPoolForType(type, options.excludeSimilar))
    .join('')

  return dedupeCharacters(pool)
}

export function getCharacterPoolSize(options: PasswordOptions): number {
  return buildCharacterPool(options).length
}
