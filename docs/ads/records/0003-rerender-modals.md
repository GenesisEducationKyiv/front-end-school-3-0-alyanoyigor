# ADR 0003: Decision to Prevent Unnecessary Rerenders of Modals

## Context

At this stage, modals in the project are managed using the ShadcnUI library. Due to its internal implementation, which provides smooth opening and closing animations, modals remain in the component tree. This causes unnecessary rerendering, which negatively affects the application's performance.

## Decision

**We will wrap all modal components with `React.memo` to prevent unnecessary rerenders when their props have not changed.**

## Rationale

`React.memo` is a simple, built-in React utility that requires minimal code changes. There is also no need for additional libraries or complex refactoring.

## Alternatives Considered

- **No Memoization** (currently used): Unnecessary rerenders and performance issues.
- **Unmount on Close**: Loses closing animation and requires more boilerplate code to implement.
- **Add AnimatePresence from Framer Motion**: Additional library with a large bundle size.

## Consequences

- All modal components will be wrapped with `React.memo`.
- Unnecessary rerenders of modals will be prevented, improving performance.
- If a modal's props are complex, developers should consider providing a custom comparison function to `React.memo`.
- For simple modals, the cost of memoization may not be justified.

## Status

[Proposed]
