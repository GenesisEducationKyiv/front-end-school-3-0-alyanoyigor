# ADR 0003: Decision to Prevent Unnecessary Rerenders of Modals

## Context

As our application grows, the use of modal dialogs for various user interactions (such as creating, updating, uploading, or deleting tracks) has increased. Once a modal is opened for the first time, it remains mounted in the DOM and rerenders whenever its parent component rerenders. This can lead to unnecessary rerenders and potential performance issues, especially with complex modal content.

- Modals are used for track creation, update, upload, and deletion.
- The project leverages the shadcn UI library for modal dialogs and other UI components, which provides accessible, composable, and customizable primitives for React.
- After being opened once, modals stay mounted in the DOM for performance and UX reasons (e.g., to preserve state and avoid remounting costs).
- However, this means that any rerender of the parent component (such as a list or header) will also rerender the modal, even if the modal is not visible or its props have not changed.
- Unnecessary rerenders can degrade performance, especially if the modal contains complex forms, validation logic, or heavy child components.

## Decision

**We will wrap all modal components with `React.memo` to prevent unnecessary rerenders when their props have not changed.**

## Rationale

### Simplicity & Minimal Boilerplate
- `React.memo` is a simple, built-in React utility that requires minimal code changes.
- No need for additional libraries or complex refactoring.

### Performance
- Prevents modal components from rerendering unless their props actually change.
- Reduces CPU and memory usage, especially for complex or deeply nested modals.
- Improves perceived performance and responsiveness for end users.

### Compatibility
- Works seamlessly with existing modal patterns and state management (e.g., Zustand, useState).
- No impact on modal open/close logic or state preservation.

### Drawbacks and Mitigations
- **Stale Props:** If modal props are derived from parent state that changes outside of the modal, there is a risk of stale data. However, our modal open/close logic ensures that props are refreshed as needed.
- **Debugging:** Memoization can make debugging rerender issues slightly more complex, but React DevTools can help trace prop changes.
- **Overhead:** Minimal overhead for most use cases; only problematic if modal props are complex objects that change identity frequently (can be mitigated with custom comparison functions if needed).

## Alternatives Considered

| Solution                | Pros                                                                 | Cons                                                                 |
|-------------------------|----------------------------------------------------------------------|----------------------------------------------------------------------|
| **No Memoization**      | Simplest, no extra code                                              | Unnecessary rerenders, performance issues with complex modals        |
| **Unmount on Close**    | Frees resources, no hidden rerenders                                 | Loses modal state, worse UX, remount cost on every open              |
| **Custom shouldComponentUpdate** | Fine-grained control over rerenders                        | More boilerplate, less idiomatic in functional components            |
| **React.memo**          | Simple, idiomatic, minimal code, effective for most cases            | May need custom comparison for complex props                         |

## Consequences

- All modal components will be wrapped with `React.memo`.
- Unnecessary rerenders of modals will be prevented, improving performance.
- Developers should be aware of prop identity and avoid passing new object/array references unless necessary.
- If a modal's props are complex, consider providing a custom comparison function to `React.memo`.

## Status

[Proposed]
