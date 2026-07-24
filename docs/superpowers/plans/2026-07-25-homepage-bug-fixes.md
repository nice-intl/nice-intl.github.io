# Homepage Bug Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the confirmed homepage regressions in four reviewable local commits without pushing them.

**Architecture:** Keep the static GitHub Pages structure intact. Add dependency-free Node regression tests, extract only the small pure Talk filtering operation needed for testability, and make targeted HTML/CSS/JavaScript corrections without introducing a build step.

**Tech Stack:** HTML5, CSS, browser JavaScript, Node.js built-in test runner.

---

### Task 1: Search and filter the complete Talk dataset

**Files:**
- Create: `assets/js/talks-core.js`
- Create: `tests/talks-core.test.cjs`
- Modify: `assets/js/talks.js`
- Modify: `index.html`
- Modify: `zh.html`

- [ ] Write a failing Node test proving title, speaker, and tag matching operate on entries outside the first rendered page.
- [ ] Run `node --test tests/talks-core.test.cjs` and confirm it fails because the filtering module does not exist.
- [ ] Add the pure filtering module and update the Talk renderer to filter the complete in-memory dataset before pagination.
- [ ] Run `node --test tests/talks-core.test.cjs` and confirm all assertions pass.
- [ ] Commit as `fix: search and filter all talks`.

### Task 2: Repair mobile responsive layout

**Files:**
- Create: `tests/homepage-static.test.cjs`
- Modify: `index.html`
- Modify: `zh.html`

- [ ] Add failing static regression checks for single-column Join cards, narrow-screen Hero sizing, wrapping footer links, and responsive Talk rows.
- [ ] Run `node --test tests/homepage-static.test.cjs` and confirm the responsive checks fail.
- [ ] Add matching responsive rules to both language pages.
- [ ] Run the static tests and verify both pages pass at the source-contract level.
- [ ] Render each homepage at 375×812 and verify `scrollWidth === innerWidth`.
- [ ] Commit as `fix: prevent mobile homepage overflow`.

### Task 3: Remove public script errors and preserve the theme icon

**Files:**
- Modify: `tests/homepage-static.test.cjs`
- Modify: `assets/js/custom.js`

- [ ] Add failing checks that legacy committee code is guarded and theme updates do not replace button children.
- [ ] Run the static tests and confirm both checks fail.
- [ ] Exit the legacy committee initializer when its required DOM is absent and update theme state through attributes rather than `textContent`.
- [ ] Run the complete Node test suite.
- [ ] Render the homepage and team page and confirm the browser console has no errors and the theme icon remains present.
- [ ] Commit as `fix: guard shared page scripts`.

### Task 4: Correct content and image alternatives

**Files:**
- Modify: `tests/homepage-static.test.cjs`
- Modify: `index.html`

- [ ] Add failing checks for the Shanghai school spelling and the Qwen, SJTU, and FDU logo alternatives.
- [ ] Run the static tests and confirm the content checks fail.
- [ ] Correct the spelling and `alt` values in both duplicated marquee sets.
- [ ] Run the complete Node test suite and local-reference audit.
- [ ] Commit as `fix: correct homepage labels`.

### Final Verification

- [ ] Run `node --test tests/*.test.cjs`.
- [ ] Render English and Chinese homepages at desktop and 375×812 mobile sizes.
- [ ] Verify Talk search finds an older entry without expanding all Talks first.
- [ ] Verify homepage and team-page consoles contain no errors.
- [ ] Run `git status --short` and confirm the worktree is clean.
- [ ] Run `git log --oneline origin/main..HEAD` and confirm exactly four local commits.
- [ ] Do not push.
