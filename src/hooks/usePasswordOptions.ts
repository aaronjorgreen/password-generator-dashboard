import { useMemo, useState } from 'react'
import { getCharacterPoolSize } from '../lib/characterPools'
import { getStrengthInfo } from '../lib/entropy'
import type { PasswordOptions } from '../types/password'

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSpecial: true,
  excludeSimilar: false,
}

export function usePasswordOptions() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_PASSWORD_OPTIONS)

  const poolSize = useMemo(() => getCharacterPoolSize(options), [options])
  const strength = useMemo(() => getStrengthInfo(options), [options])

  function updateOption<Key extends keyof PasswordOptions>(
    key: Key,
    value: PasswordOptions[Key],
  ) {
    setOptions((currentOptions) => ({
      ...currentOptions,
      [key]: value,
    }))
  }

  return {
    options,
    setOptions,
    updateOption,
    poolSize,
    strength,
    canGenerate: poolSize > 0,
  }
}
