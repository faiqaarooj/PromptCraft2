## Description
<!-- What does this PR do? Link the related issue if applicable. -->

Closes #

## Type of change
- [ ] Bug fix
- [ ] New feature / enhancement
- [ ] Refactor (no functional change)
- [ ] Docs / config only

## Quality checklist

### Functional
- [ ] The change solves the stated problem first — no cosmetic-only PRs on critical paths
- [ ] Existing behaviour is not broken (build passes, no regressions)
- [ ] New or changed logic is covered by tests (if test infrastructure exists)

### Security
- [ ] No secrets, API keys, or sensitive data are committed or logged client-side
- [ ] Any user-entered text is validated with Zod before processing (`src/validation.js`)
- [ ] Any AI-generated / external content rendered in the UI is sanitised with DOMPurify
- [ ] No new `dangerouslySetInnerHTML` without explicit DOMPurify sanitisation

### Motion / UI (if applicable)
- [ ] No unintentional re-render loops introduced by animation logic
- [ ] `AnimatePresence` / `motion.*` usage follows `motionConfig.js` patterns
- [ ] Memory cleanup: rAF loops / Three.js geometries disposed on unmount

### Accessibility
- [ ] Text colour contrast meets WCAG AA (≥ 4.5:1 for normal text, ≥ 3:1 for large text)
- [ ] Interactive elements are keyboard-focusable

## Screenshots (UI changes only)
<!-- Attach a before / after screenshot for any visual change. -->
