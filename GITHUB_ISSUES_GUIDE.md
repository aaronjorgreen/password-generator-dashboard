# GitHub Issues Guide — password-generator-dashboard

> **MANDATORY FOR ALL AGENTS**
>
> Every agent working on this repository **must read and follow this guide** before making any code change, documentation update, or pull request. Non-compliance is not acceptable — issue hygiene is part of the definition of done.

---

## Repository

| Field | Value |
|-------|-------|
| Owner | `aaronjorgreen` |
| Repo | `password-generator-dashboard` |
| Default branch | `main` |

---

## Golden Rules

1. **No unlinked work** — Every code change must trace to an open GitHub issue. If none exists, create one **before** writing code.
2. **One issue, one concern** — Do not bundle unrelated changes into a single issue or PR.
3. **Labels are mandatory** — Never create or leave an issue without at least one `type/*` label and one `priority/*` label.
4. **Close with evidence** — Issues are closed only when acceptance criteria are met and verified. Use `state_reason: completed`.
5. **Reference issues in commits** — Every commit message must include `Refs #<number>` or `Closes #<number>` when the commit addresses an issue.
6. **Sync the plan** — When a phase or checklist item in `IMPLEMENTATION_PLAN.md` is completed, update the checklist **in the same PR** that closes the related issue.
7. **Search before creating** — Always search existing open and closed issues to avoid duplicates.

---

## Label Taxonomy

Apply these labels at issue creation. Create any missing labels in the repo before first use.

### Type (required — pick exactly one)

| Label | When to use |
|-------|-------------|
| `type/feature` | New functionality or user-facing capability |
| `type/bug` | Something broken or regressed |
| `type/chore` | Tooling, config, dependencies, repo setup |
| `type/docs` | Documentation-only changes |
| `type/refactor` | Code restructure with no behaviour change |
| `type/test` | Adding or fixing tests |
| `type/design` | UI/UX, styling, accessibility improvements |

### Priority (required — pick exactly one)

| Label | When to use |
|-------|-------------|
| `priority/critical` | Blocks all progress or breaks core functionality |
| `priority/high` | Required for current phase or milestone |
| `priority/medium` | Important but not blocking |
| `priority/low` | Nice-to-have, polish, future improvement |

### Phase (required for implementation work — pick one)

| Label | Maps to |
|-------|---------|
| `phase/1-scaffolding` | Phase 1 — Project Scaffolding |
| `phase/2-core-logic` | Phase 2 — Types & Core Logic |
| `phase/3-state-hooks` | Phase 3 — State & Hooks |
| `phase/4-settings-ui` | Phase 4 — Settings UI |
| `phase/5-output-ui` | Phase 5 — Output & Strength UI |
| `phase/6-history` | Phase 6 — History & Persistence |
| `phase/7-bulk-generate` | Phase 7 — Generate Multiple |
| `phase/8-polish` | Phase 8 — Polish & Accessibility |

### Status (optional — applied during workflow)

| Label | When to use |
|-------|-------------|
| `status/blocked` | Cannot proceed; comment must explain blocker |
| `status/in-progress` | Actively being worked on |
| `status/needs-review` | PR open and awaiting review |
| `status/ready` | Specified and ready to be picked up |

---

## Issue Creation — Mandatory Steps

Before writing any code, the agent **must** complete all of the following:

### Step 1: Search for existing issues

```
search_issues: repo:aaronjorgreen/password-generator-dashboard <keywords>
```

If a matching open issue exists, use it. Do not create a duplicate.

### Step 2: Create the issue with a complete body

Every new issue **must** include these sections in the body:

```markdown
## Summary
One or two sentences describing what and why.

## Acceptance Criteria
- [ ] Criterion 1 (specific, testable)
- [ ] Criterion 2
- [ ] ...

## Implementation Notes
Files, components, or plan sections affected.

## Out of Scope
What this issue explicitly does NOT cover.
```

### Step 3: Apply labels

At minimum:
- One `type/*` label
- One `priority/*` label
- One `phase/*` label (for feature/implementation work)

### Step 4: Title format

Use imperative, concise titles:

```
<verb> <what>
```

Examples:
- `Initialize Vite + React + TypeScript project`
- `Implement entropy calculation and strength classification`
- `Add password history panel with localStorage persistence`

### Step 5: Link to implementation plan

Reference the relevant phase and checklist items from `IMPLEMENTATION_PLAN.md` in the issue body.

---

## Issue Management — Mandatory Steps

### Starting work

1. Confirm the issue is **open** and **unassigned** (or assigned to you).
2. Add the `status/in-progress` label.
3. Create a feature branch named: `issue-<number>-<short-slug>`  
   Example: `issue-3-entropy-calculation`
4. Do **not** commit directly to `main`.

### During work

1. Keep the issue updated with comments if scope changes, blockers arise, or decisions are made.
2. If blocked, add `status/blocked`, explain the blocker in a comment, and stop until unblocked.
3. If scope grows, open a **new** issue for the additional work — do not expand the original issue silently.
4. Remove `status/in-progress` and add `status/needs-review` when a PR is opened.

### Pull requests

Every PR **must**:

- Reference its issue: `Closes #<number>` in the PR body
- Have a clear title matching the issue title
- Include a **Test plan** checklist
- Only contain changes related to the linked issue

PR body template:

```markdown
## Summary
Brief description of changes.

Closes #<number>

## Test plan
- [ ] Step 1
- [ ] Step 2
```

### Commit messages

Follow this format:

```
<short imperative summary>

<optional body>

Refs #<number>
```

Use `Closes #<number>` in the **PR squash/merge commit** or final commit when the issue is fully resolved.

---

## Issue Closure — Mandatory Steps

An issue **must not** be closed until all of the following are true:

### Closure checklist

- [ ] All acceptance criteria in the issue body are met
- [ ] Related PR is merged to `main` (or change is committed if no PR workflow)
- [ ] `IMPLEMENTATION_PLAN.md` checklist items are marked `[x]` if applicable
- [ ] No `status/blocked` or `status/in-progress` labels remain
- [ ] A closing comment summarizes what was done

### How to close

Use GitHub's `state_reason: completed` when closing:

```
issue_write: method=update, state=closed, state_reason=completed
```

Add a closing comment:

```markdown
Closed via #<PR-number>.

**Delivered:**
- Item 1
- Item 2

**Verified:**
- Criterion from acceptance criteria
```

### When NOT to close

| Situation | Action |
|-----------|--------|
| Partial implementation | Keep open; update acceptance criteria checkboxes and comment on progress |
| Duplicate issue | Close with `state_reason: duplicate`; reference original issue number |
| Descoped / won't fix | Close with `state_reason: not_planned`; explain why in a comment |
| External blocker | Add `status/blocked`; do **not** close |

---

## Agent Workflow Summary

For **every** codebase change, follow this sequence without exception:

```
1. Read GITHUB_ISSUES_GUIDE.md          ← you are here
2. Read IMPLEMENTATION_PLAN.md          ← understand scope
3. Search existing issues               ← avoid duplicates
4. Create or select an issue            ← with labels + acceptance criteria
5. Add status/in-progress label
6. Branch from main                     ← issue-<n>-<slug>
7. Implement the change
8. Update IMPLEMENTATION_PLAN.md        ← check off completed items
9. Commit with Refs #<n>
10. Open PR with Closes #<n>            ← add status/needs-review
11. Merge PR
12. Close issue (state_reason: completed)
13. Remove status/needs-review; confirm acceptance criteria met
```

---

## Initial Issues Backlog (Seed)

When bootstrapping the repo, create one issue per implementation phase aligned with `IMPLEMENTATION_PLAN.md`:

| # | Title | Labels |
|---|-------|--------|
| 1 | Initialize project scaffolding (Phase 1) | `type/chore`, `priority/high`, `phase/1-scaffolding` |
| 2 | Implement core password logic (Phase 2) | `type/feature`, `priority/high`, `phase/2-core-logic` |
| 3 | Build state hooks (Phase 3) | `type/feature`, `priority/high`, `phase/3-state-hooks` |
| 4 | Build settings UI (Phase 4) | `type/feature`, `priority/high`, `phase/4-settings-ui` |
| 5 | Build output and strength UI (Phase 5) | `type/feature`, `priority/high`, `phase/5-output-ui` |
| 6 | Implement history and persistence (Phase 6) | `type/feature`, `priority/medium`, `phase/6-history` |
| 7 | Implement bulk password generation (Phase 7) | `type/feature`, `priority/medium`, `phase/7-bulk-generate` |
| 8 | Polish, responsive layout, and accessibility (Phase 8) | `type/design`, `priority/medium`, `phase/8-polish` |

Agents **must** create these issues (or verify they exist) before starting Phase 1 implementation.

---

## Enforcement

- Agents that commit to `main` without a linked issue are in violation of this guide.
- Agents that close issues without meeting acceptance criteria are in violation of this guide.
- Agents that skip labels are in violation of this guide.
- When in doubt, **open an issue first, code second**.
