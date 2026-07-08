import { Layout, Panel } from './components/Layout'
import { SettingsPanel } from './components/SettingsPanel'
import { usePasswordOptions } from './hooks/usePasswordOptions'

function App() {
  const { options, updateOption, poolSize } = usePasswordOptions()

  return (
    <Layout
      settings={
        <Panel
          title="Settings"
          description="Tune length, character sets, and ambiguity filters."
        >
          <SettingsPanel
            options={options}
            poolSize={poolSize}
            onOptionChange={updateOption}
          />
        </Panel>
      }
      output={
        <Panel
          title="Output"
          description="The generated password, strength, entropy, and actions stay focused here."
        >
          <div className="rounded-2xl border border-dashed border-nordic-border bg-nordic-bg p-5 font-mono text-sm text-nordic-muted">
            Password output arrives in Phase 5.
          </div>
        </Panel>
      }
      history={
        <Panel
          title="History"
          description="The last 10 generated passwords will be stored locally."
        >
          <div className="rounded-2xl border border-dashed border-nordic-border bg-nordic-bg p-5 text-sm text-nordic-muted">
            History and persistence arrive in Phase 6.
          </div>
        </Panel>
      }
    />
  )
}

export default App
