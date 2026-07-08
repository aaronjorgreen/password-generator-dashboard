export type CharacterType = 'lowercase' | 'uppercase' | 'numbers' | 'special'

export type PasswordOptions = {
  length: number
  includeLowercase: boolean
  includeUppercase: boolean
  includeNumbers: boolean
  includeSpecial: boolean
  excludeSimilar: boolean
}

export type StrengthLevel = 'disabled' | 'weak' | 'medium' | 'strong' | 'very-strong'

export type StrengthInfo = {
  level: StrengthLevel
  label: string
  entropyBits: number
  percent: number
}

export type HistoryEntry = {
  id: string
  password: string
  createdAt: string
}
