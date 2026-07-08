import { getCharacterPoolSize } from './characterPools'
import type { PasswordOptions, StrengthInfo, StrengthLevel } from '../types/password'

export function calculateEntropyBits(options: PasswordOptions): number {
  const poolSize = getCharacterPoolSize(options)

  if (poolSize === 0) {
    return 0
  }

  return options.length * Math.log2(poolSize)
}

export function classifyStrength(entropyBits: number): StrengthLevel {
  if (entropyBits <= 0) {
    return 'disabled'
  }

  if (entropyBits < 40) {
    return 'weak'
  }

  if (entropyBits < 60) {
    return 'medium'
  }

  if (entropyBits < 80) {
    return 'strong'
  }

  return 'very-strong'
}

export function getStrengthLabel(level: StrengthLevel): string {
  const labels: Record<StrengthLevel, string> = {
    disabled: '—',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    'very-strong': 'Very Strong',
  }

  return labels[level]
}

export function getStrengthInfo(options: PasswordOptions): StrengthInfo {
  const entropyBits = calculateEntropyBits(options)
  const level = classifyStrength(entropyBits)

  return {
    level,
    label: getStrengthLabel(level),
    entropyBits,
    percent: Math.min(100, (entropyBits / 100) * 100),
  }
}
