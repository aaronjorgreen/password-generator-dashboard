import { Layout, Panel } from './components/Layout'

function App() {
  return (
    <Layout
      settings={
        <Panel
          title="Settings"
          description="Length, character sets, and ambiguity controls will live here."
        >
          <div className="rounded-2xl border border-dashed border-nordic-border bg-nordic-bg p-5 text-sm text-nordic-muted">
            Phase 4 will replace this placeholder with accessible controls.
          </div>
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
