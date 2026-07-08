import type { PasswordOptions } from '../types/password'
import { Slider } from './ui/Slider'
import { Toggle } from './ui/Toggle'

type SettingsPanelProps = {
  options: PasswordOptions
  poolSize: number
  onOptionChange: <Key extends keyof PasswordOptions>(
    key: Key,
    value: PasswordOptions[Key],
  ) => void
}

const characterToggles: Array<{
  id: string
  key: keyof Pick<
    PasswordOptions,
    'includeLowercase' | 'includeUppercase' | 'includeNumbers' | 'includeSpecial'
  >
  label: string
  description: string
}> = [
  {
    id: 'include-lowercase',
    key: 'includeLowercase',
    label: 'Lowercase',
    description: 'Use a-z characters.',
  },
  {
    id: 'include-uppercase',
    key: 'includeUppercase',
    label: 'Uppercase',
    description: 'Use A-Z characters.',
  },
  {
    id: 'include-numbers',
    key: 'includeNumbers',
    label: 'Numbers',
    description: 'Use 0-9 digits.',
  },
  {
    id: 'include-special',
    key: 'includeSpecial',
    label: 'Special characters',
    description: 'Use punctuation and symbols.',
  },
]

export function SettingsPanel({ options, poolSize, onOptionChange }: SettingsPanelProps) {
  const hasCharacterPool = poolSize > 0

  return (
    <div className="space-y-5">
      <Slider
        id="password-length"
        label="Password length"
        description="Choose a length from 8 to 64 characters."
        min={8}
        max={64}
        value={options.length}
        onChange={(value) => onOptionChange('length', value)}
      />

      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-medium text-nordic-text">
          Character types
        </legend>
        {characterToggles.map((toggle) => (
          <Toggle
            key={toggle.key}
            id={toggle.id}
            label={toggle.label}
            description={toggle.description}
            checked={Boolean(options[toggle.key])}
            onChange={(checked) => onOptionChange(toggle.key, checked)}
          />
        ))}
      </fieldset>

      <Toggle
        id="exclude-similar"
        label="Exclude similar characters"
        description="Removes O, 0, I, and l while keeping 1 available."
        checked={options.excludeSimilar}
        onChange={(checked) => onOptionChange('excludeSimilar', checked)}
      />

      {!hasCharacterPool ? (
        <p className="rounded-2xl border border-nordic-danger bg-[rgba(184,92,92,0.1)] px-4 py-3 text-sm text-nordic-danger">
          Select at least one character type to enable password generation and
          strength feedback.
        </p>
      ) : null}
    </div>
  )
}
