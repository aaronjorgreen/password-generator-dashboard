import type { ReactNode } from 'react'

type LayoutProps = {
  settings: ReactNode
  output: ReactNode
  bulk?: ReactNode
  history: ReactNode
}

export function Layout({ settings, output, bulk, history }: LayoutProps) {
  return (
    <main className="min-h-screen bg-nordic-bg px-4 py-8 text-nordic-text sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-nordic-accent">
            Secure utility
          </p>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-nordic-text sm:text-5xl">
              Password Generator
            </h1>
            <p className="text-base leading-7 text-nordic-muted sm:text-lg">
              Generate strong passwords with instant entropy feedback, quiet copy
              confirmations, and a focused dashboard built for everyday use.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {settings}
          {output}
        </section>

        {bulk}
        {history}
      </div>
    </main>
  )
}

export function Panel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-3xl border border-nordic-border bg-nordic-surface p-6 shadow-card">
      <div className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-nordic-text">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-6 text-nordic-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
