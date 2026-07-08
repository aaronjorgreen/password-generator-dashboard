# Password Generator Dashboard — Implementation Plan

## Overview

A frontend-only password generator dashboard with a **Nordic Scandinavian** aesthetic. All persistence uses **localStorage**. Password strength is derived from **character pool size** and **password length** (entropy in bits), with the UI updating instantly whenever settings change.

---

## UX Principles

These rules govern every screen and interaction — implement them from Phase 1, not as late polish.

| Principle | Behaviour |
|-----------|-----------|
| **Instant feedback** | Changing length or any toggle immediately updates the strength bar, label, and entropy readout — no Generate click required |
| **Single focus** | One primary password display; bulk results appear in a dedicated sub-section, not competing with it |
| **Clear affordances** | Buttons are disabled with helper text when an action is unavailable (e.g. Regenerate before first generate) |
| **Minimal friction** | Auto-generate one password on first load so the dashboard never feels empty |
| **Safe by default** | History rows show a truncated/masked preview; full value revealed on hover or expand; copy always copies the full password |
| **Quiet feedback** | Copy confirmation is a brief inline label ("Copied") — no modal toasts |
| **Consistent actions** | All generation actions (Generate, Regenerate, Generate Multiple) live in the **Output panel** only |

---

## Tech Stack (Recommended)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **React + Vite** | Fast dev setup; component model fits toggles/sliders |
| Language | **TypeScript** | Type-safe password options and strength models |
| Styling | **Tailwind CSS** | Utility-first; easy to enforce Nordic palette/spacing |
| Icons | **Lucide React** | Minimal, line-based icons that match Scandinavian design |
| Clipboard | **Navigator Clipboard API** | One-click copy with `document.execCommand` fallback |
| Randomness | **`crypto.getRandomValues`** | Cryptographically secure random selection |
| Storage | **`localStorage`** | Persist last 10 passwords; no backend |

---

## Design System — Nordic Scandinavian UI

### Visual Principles
- **Minimalism**: generous whitespace, few decorative elements
- **Muted palette**: off-whites, soft greys, pale blues, muted sage greens
- **Typography**: clean sans-serif (e.g. Inter, DM Sans, or system-ui); monospace for password output only
- **Subtle depth**: light borders (`1px`), soft shadows, no heavy gradients
- **Functional layout**: card-based sections, clear hierarchy, developer-dashboard feel
- **Restrained motion**: 150–200 ms transitions on strength bar width and copy feedback only

### Color Tokens
```
--bg-primary:     #F7F8FA   (cool off-white)
--bg-surface:     #FFFFFF
--border:         #E2E8F0
--text-primary:   #1E293B
--text-muted:     #64748B
--accent:         #5B7C99   (muted Nordic blue)
--accent-hover:   #4A6A85
--success:        #6B9080   (sage green — Strong / Very Strong)
--warning:        #C4A35A   (muted amber — Medium)
--danger:         #B85C5C   (muted red — Weak)
```

### Layout Structure

Actions are grouped once, in the Output panel — not duplicated in Settings.

```
┌──────────────────────────────────────────────────────────┐
│  Header: "Password Generator" + subtle subtitle          │
├────────────────────────────┬─────────────────────────────┤
│  Settings Panel            │  Output Panel               │
│  - Length slider + value   │  - Password display         │
│  - Character toggles (4)   │  - Strength bar + label     │
│  - Exclude similar toggle  │  - Entropy (bits)           │
│  - Inline validation msg   │  - [Generate] [Regenerate]  │
│                            │  - [Generate Multiple (10)] │
│                            │  - Copy button              │
├────────────────────────────┴─────────────────────────────┤
│  Bulk Results (visible only after Generate Multiple)     │
│  - Scrollable list of 10 passwords, each with Copy       │
├──────────────────────────────────────────────────────────┤
│  History Panel: last 10 generated passwords              │
│  - Masked preview · timestamp · per-row Copy             │
└──────────────────────────────────────────────────────────┘
```

**Mobile (< 768 px):** stack Settings above Output; History and Bulk Results follow below.

---

## User Flows

### First Visit
1. App loads with default settings (length 16, all character types on, exclude similar off)
2. One password is auto-generated immediately
3. Strength indicator and entropy reflect current settings
4. History is empty or restored from localStorage

### Change Settings
1. User adjusts slider or toggle
2. Strength bar, label, and entropy update instantly (settings-based preview)
3. Displayed password is **not** auto-regenerated — user chooses when to regenerate
4. If all character types are off, strength shows "—" / disabled state; Generate buttons disabled

### Generate / Regenerate
- **Generate**: creates a new password, replaces primary display, appends to history
- **Regenerate**: same settings, new password; disabled until a password has been generated at least once
- Both disabled when character pool is empty

### Generate Multiple
1. Generates 10 passwords with current settings
2. Results appear in the Bulk Results section below the primary output
3. All 10 are appended to history (newest first); list is trimmed to 10 total entries — oldest dropped
4. Primary display password is unchanged unless user clicks Generate/Regenerate separately

### Copy
- Primary output: one-click copy + brief "Copied" label (resets after ~2 s)
- Bulk results and history rows: individual copy per row, same feedback pattern

---

## Core Logic

### Character Pools

| Pool | Characters | Count |
|------|------------|-------|
| Lowercase | `a-z` | 26 |
| Uppercase | `A-Z` | 26 |
| Numbers | `0-9` | 10 |
| Special | `!@#$%^&*()-_=+[]{}|;:,.<>?` | 32 |

Pools are concatenated and **deduplicated** when building the active set.

### Similar Character Exclusion

When enabled, remove these characters from the combined pool (per brief):

| Removed | Reason |
|---------|--------|
| `O`, `0` | Visually similar |
| `I`, `l` | Visually similar |

> `1` is intentionally excluded from the filter to stay aligned with the brief ("O, 0, I, and l").

### Password Generation Algorithm

1. Build active character pool from enabled toggles
2. Deduplicate the pool
3. Apply similar-character filter if enabled
4. Abort with validation error if pool is empty
5. For each enabled pool, place at least one guaranteed character (improves charset coverage; positions shuffled after)
6. Fill remaining positions using `crypto.getRandomValues` with **unbiased** index selection (rejection sampling to avoid modulo bias)
7. Return generated string

### Entropy Calculation

Entropy is always computed from **current settings**, not from inspecting the generated string. This keeps the preview instant and consistent before and after generation.

```
poolSize = deduplicated, filtered character count
entropy (bits) = length × log₂(poolSize)
```

- Recalculate on every settings change (length, toggles, exclude similar)
- When `poolSize` is 0: entropy = 0, strength label = "—", indicator disabled

### Strength Classification

| Label | Entropy (bits) | Bar colour token |
|-------|----------------|------------------|
| Weak | < 40 | `--danger` |
| Medium | 40 – 59 | `--warning` |
| Strong | 60 – 79 | `--success` |
| Very Strong | ≥ 80 | `--success` (full bar) |

Progress bar maps entropy to 0–100 % using **100 bits as visual maximum** (values above 100 bits still show "Very Strong" at 100 % fill).

---

## File Structure

```
password-generator-dashboard/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── IMPLEMENTATION_PLAN.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                  # Tailwind imports + CSS variables
    ├── types/
    │   └── password.ts            # PasswordOptions, StrengthLevel, HistoryEntry
    ├── lib/
    │   ├── characterPools.ts      # Pool definitions, dedup, similar-char filter
    │   ├── generatePassword.ts    # Secure generation + charset guarantee
    │   ├── entropy.ts             # Entropy + strength classification
    │   └── storage.ts             # localStorage read/write (last 10)
    ├── hooks/
    │   ├── usePasswordOptions.ts  # Settings state
    │   ├── usePasswordGenerator.ts# Generate / regenerate / bulk orchestration
    │   └── usePasswordHistory.ts  # History read/write via storage.ts
    └── components/
        ├── Layout.tsx             # Page shell, header, responsive grid
        ├── SettingsPanel.tsx      # Length slider, toggles, validation message
        ├── OutputPanel.tsx        # Password display, strength, action buttons, copy
        ├── StrengthIndicator.tsx  # Bar + label + entropy bits
        ├── BulkResults.tsx        # 10-password list (post Generate Multiple)
        ├── PasswordHistory.tsx    # Last 10 entries, masked preview, per-row copy
        └── ui/
            ├── Toggle.tsx
            ├── Slider.tsx
            └── Button.tsx
```

### Component Responsibilities (no overlap)

| Component | Owns |
|-----------|------|
| `SettingsPanel` | Settings inputs and inline validation only — no action buttons |
| `OutputPanel` | Primary password, strength, entropy, Generate / Regenerate / Generate Multiple / Copy |
| `BulkResults` | Bulk list visibility and per-row copy; hidden until Generate Multiple is used |
| `PasswordHistory` | Persisted history display only |
| `StrengthIndicator` | Visual strength feedback; receives entropy + label as props |

---

## Step-by-Step Implementation

### Phase 1 — Project Scaffolding
1. Initialize Vite + React + TypeScript project
2. Install and configure Tailwind CSS
3. Set up Nordic color tokens in `index.css` and `tailwind.config.js`
4. Create `Layout` with header, two-column grid, and mobile stack
5. Verify dev server runs and base styles render

### Phase 2 — Types & Core Logic
6. Define types: `PasswordOptions`, `StrengthLevel`, `HistoryEntry` (password + ISO timestamp)
7. Implement `characterPools.ts` — pool builders, dedup, similar-char filter
8. Implement `generatePassword.ts` — `crypto.getRandomValues`, charset guarantee, unbiased sampling
9. Implement `entropy.ts` — bits calculation and strength label mapping
10. Implement `storage.ts` — load/save history array (max 10, newest first); handle `localStorage` unavailable gracefully

### Phase 3 — State & Hooks
11. Create `usePasswordOptions` with defaults (length 16, all toggles on, exclude similar off)
12. Derive `poolSize` and `entropy` as memoised values from options (instant recalc)
13. Create `usePasswordHistory` backed by `storage.ts`
14. Create `usePasswordGenerator` — orchestrates generate, regenerate, bulk; pushes to history

### Phase 4 — Settings UI
15. Build `Toggle` and `Slider` UI primitives (Nordic styling, keyboard accessible)
16. Build `SettingsPanel` — length slider (8–64) with live numeric label
17. Add character toggles: uppercase, lowercase, numbers, special
18. Add "Exclude similar characters (O, 0, I, l)" toggle with helper text
19. Show inline validation when no character type is selected

### Phase 5 — Output & Strength UI
20. Build `StrengthIndicator` — bar, label, entropy bits; disabled state when pool empty
21. Build `OutputPanel` — monospace password display with placeholder before first generate
22. Wire action buttons with correct disabled states (see User Flows)
23. Implement one-click copy with inline "Copied" feedback
24. Auto-generate one password on first mount

### Phase 6 — History & Persistence
25. Append each single or bulk-generated password to history (newest first, cap at 10)
26. Build `PasswordHistory` — masked preview, relative timestamp, per-row copy
27. Persist to localStorage on every history change; restore on mount

### Phase 7 — Generate Multiple
28. Wire "Generate Multiple" to produce 10 passwords via `usePasswordGenerator`
29. Build `BulkResults` — scrollable list, individual copy per row; section hidden until first use
30. Confirm all 10 land in history with correct cap behaviour

### Phase 8 — Polish & Accessibility
31. Responsive pass — mobile column order, touch-friendly tap targets (min 44 px)
32. Strength bar width transition (150–200 ms)
33. `aria-label` / `aria-live` on strength indicator; labels on all toggles and buttons
34. Focus-visible ring styles consistent with Nordic accent colour
35. Final visual pass — spacing rhythm (8 px grid), border consistency, empty states

---

## Progress Checklist

### Phase 1 — Project Scaffolding
- [x] Initialize Vite + React + TypeScript
- [x] Install and configure Tailwind CSS
- [x] Set up Nordic design tokens (colors, typography)
- [x] Create base Layout (desktop grid + mobile stack)
- [x] Dev server verified

### Phase 2 — Types & Core Logic
- [ ] `PasswordOptions`, `StrengthLevel`, `HistoryEntry` types defined
- [ ] Character pools with dedup + similar-char filter (O, 0, I, l)
- [ ] Secure password generation (`crypto.getRandomValues`, unbiased sampling)
- [ ] Charset guarantee (≥1 char per enabled pool)
- [ ] Entropy calculation implemented
- [ ] Strength classification (Weak / Medium / Strong / Very Strong)
- [ ] `storage.ts` with graceful localStorage fallback

### Phase 3 — State & Hooks
- [ ] `usePasswordOptions` hook
- [ ] Memoised instant entropy recalc on settings change
- [ ] `usePasswordHistory` hook
- [ ] `usePasswordGenerator` hook (single, regenerate, bulk)

### Phase 4 — Settings UI
- [ ] Reusable Toggle component (accessible)
- [ ] Reusable Slider component (accessible)
- [ ] Length slider (8–64) with live value label
- [ ] Uppercase toggle
- [ ] Lowercase toggle
- [ ] Numbers toggle
- [ ] Special characters toggle
- [ ] Exclude similar characters toggle (O, 0, I, l)
- [ ] Empty-pool validation + disabled strength state

### Phase 5 — Output & Strength UI
- [ ] Strength indicator bar (colour-coded by tier)
- [ ] Strength label display
- [ ] Entropy (bits) display
- [ ] Primary password output (monospace)
- [ ] Generate button (disabled when pool empty)
- [ ] Regenerate button (disabled until password exists)
- [ ] One-click copy with inline feedback
- [ ] Auto-generate on first load

### Phase 6 — History & Persistence
- [ ] Save passwords to history on generate (single + bulk)
- [ ] Enforce 10-item cap (newest first)
- [ ] History panel with masked preview
- [ ] Per-row copy in history
- [ ] Load history on mount from localStorage

### Phase 7 — Generate Multiple
- [ ] Generate 10 passwords at once
- [ ] `BulkResults` section (hidden until used)
- [ ] Individual copy per bulk password
- [ ] All 10 appended to history within cap rules

### Phase 8 — Polish & Accessibility
- [ ] Mobile-responsive layout (Settings → Output → Bulk → History)
- [ ] Strength bar transition animation
- [ ] `aria-live` region for strength/entropy updates
- [ ] Focus-visible styles on all interactive elements
- [ ] Final Nordic visual polish (spacing, borders, empty states)

---

## Acceptance Criteria

| Requirement | How to verify |
|-------------|---------------|
| Nordic Scandinavian UI | Muted palette, minimal layout, generous whitespace, no heavy gradients |
| Password length control | Slider updates length label and entropy live; generation respects length |
| Character toggles | Each toggle adds/removes from pool; entropy updates without clicking Generate |
| Exclude similar chars | `O`, `0`, `I`, `l` removed from pool when toggle on |
| Secure random generation | Uses `crypto.getRandomValues`; not `Math.random` |
| Strength indicator | Bar + label visible; updates instantly with settings |
| Entropy in bits | Displayed value equals `length × log₂(poolSize)` for current settings |
| Strength labels | Correct tier at thresholds: <40 / 40–59 / 60–79 / ≥80 |
| One-click copy | Clipboard contains full password; inline "Copied" feedback shown |
| History (10 max) | localStorage persists across refresh; oldest entries dropped beyond 10 |
| Regenerate | Produces new password with unchanged settings; button disabled before first generate |
| Generate Multiple | 10 passwords listed in Bulk Results; each copyable; all added to history |
| Instant UI updates | Any settings change immediately updates strength bar, label, and entropy |
| Clean UX | No duplicate action buttons; disabled states with clear affordances; no empty dashboard on load |

---

## Out of Scope

- Backend / API
- User accounts or cloud sync
- Password export / import
- Passphrase / diceware mode
- Browser extension
- Password strength estimation via zxcvbn or dictionary checks

---

## Implementation Notes

- **Entropy is settings-based only** — do not parse the generated string for strength; keeps preview and result consistent and instant.
- **History cap with bulk generate** — generating 10 at once may replace the entire history; this is expected. Newest-first ordering means the 10 bulk passwords become the history list.
- **localStorage failures** — if storage is blocked (private browsing), history works in-session only; no error modal, silent degrade.
- **Keep logic in `lib/`** — components stay thin; generation and entropy are testable in isolation.
