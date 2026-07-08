import { useCallback, useState } from 'react'
import { buildCharacterPool } from '../lib/characterPools'
import { generatePassword, generatePasswords } from '../lib/generatePassword'
import type { PasswordOptions } from '../types/password'

type UsePasswordGeneratorArgs = {
  options: PasswordOptions
  addPasswordToHistory: (password: string) => void
  addPasswordsToHistory: (passwords: string[]) => void
}

export function usePasswordGenerator({
  options,
  addPasswordToHistory,
  addPasswordsToHistory,
}: UsePasswordGeneratorArgs) {
  const [password, setPassword] = useState('')
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const canGenerate = buildCharacterPool(options).length > 0
  const hasGeneratedPassword = password.length > 0

  const generate = useCallback(() => {
    if (!canGenerate) {
      setError('Select at least one character type before generating.')
      return null
    }

    try {
      const nextPassword = generatePassword(options)
      setPassword(nextPassword)
      addPasswordToHistory(nextPassword)
      setError(null)
      return nextPassword
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Unable to generate password.'
      setError(message)
      return null
    }
  }, [addPasswordToHistory, canGenerate, options])

  const regenerate = useCallback(() => {
    if (!hasGeneratedPassword) {
      return null
    }

    return generate()
  }, [generate, hasGeneratedPassword])

  const generateMultiple = useCallback(
    (count = 10) => {
      if (!canGenerate) {
        setError('Select at least one character type before generating.')
        return []
      }

      try {
        const nextPasswords = generatePasswords(options, count)
        setBulkPasswords(nextPasswords)
        addPasswordsToHistory(nextPasswords)
        setError(null)
        return nextPasswords
      } catch (caughtError) {
        const message =
          caughtError instanceof Error ? caughtError.message : 'Unable to generate passwords.'
        setError(message)
        return []
      }
    },
    [addPasswordsToHistory, canGenerate, options],
  )

  return {
    password,
    bulkPasswords,
    error,
    canGenerate,
    hasGeneratedPassword,
    generate,
    regenerate,
    generateMultiple,
  }
}
