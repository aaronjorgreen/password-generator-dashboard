import {
  buildCharacterPool,
  getEnabledCharacterTypes,
  getPoolForType,
} from './characterPools'
import type { PasswordOptions } from '../types/password'

function getCrypto(): Crypto {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure random generation is unavailable in this browser.')
  }

  return globalThis.crypto
}

function getRandomIndex(maxExclusive: number): number {
  if (maxExclusive <= 0) {
    throw new Error('Cannot select from an empty character pool.')
  }

  const crypto = getCrypto()
  const values = new Uint32Array(1)
  const limit = Math.floor(0x1_0000_0000 / maxExclusive) * maxExclusive

  let value: number
  do {
    crypto.getRandomValues(values)
    value = values[0]
  } while (value >= limit)

  return value % maxExclusive
}

function pickCharacter(pool: string): string {
  return pool[getRandomIndex(pool.length)]
}

function shuffleCharacters(characters: string[]): string[] {
  const shuffled = [...characters]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

export function generatePassword(options: PasswordOptions): string {
  const activePool = buildCharacterPool(options)

  if (activePool.length === 0) {
    throw new Error('Select at least one character type before generating.')
  }

  const guaranteedCharacters = getEnabledCharacterTypes(options)
    .map((type) => getPoolForType(type, options.excludeSimilar))
    .filter((pool) => pool.length > 0)
    .map(pickCharacter)

  const characters = guaranteedCharacters.slice(0, options.length)

  while (characters.length < options.length) {
    characters.push(pickCharacter(activePool))
  }

  return shuffleCharacters(characters).join('')
}

export function generatePasswords(options: PasswordOptions, count: number): string[] {
  return Array.from({ length: count }, () => generatePassword(options))
}
