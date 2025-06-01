# ADR 0004: Decision to Implement Module-View-Presenter (MVP) Architecture

## Context

As our application grows, we want to enforce a clear separation of concerns and make the codebase easy to maintain, test, and scale.

## Decision

**We will organize the `src` directory by MVP layers, grouping code by feature/module where appropriate.**

### Proposed Structure

```
src/
  modules/                        # Each business domain/feature as a module
    tracks/
      module/                     # Data, state, and business logic (API, models, Zustand stores, validation)
        trackService.ts
        trackModel.ts
        trackStore.ts
        trackValidation.ts
        trackTypes.ts
      presenter/                  # Presentation logic (hooks, data transformation)
        useTrackPresenter.ts
        useTrackListPresenter.ts
      view/                       # UI components (React components, pages, modals)
        TrackListPage.tsx
        TrackItem.tsx
        TrackActions.tsx
        TrackModals/
          TrackCreateModal.tsx
          TrackUpdateModal.tsx
          TrackDeleteModal.tsx
      __tests__/                  # Module-specific tests
    auth/
      module/
      presenter/
      view/
      __tests__/
    ...other modules...
  shared/                         # Shared code across modules
    components/                   # Shared UI components (Button, Dialog, etc.)
    hooks/                        # Shared hooks
    services/                     # Shared services (e.g., axios instance)
    types/                        # Shared types/interfaces
    validation/                   # Shared validation schemas
    utils/                        # Shared utility functions
    consts/                       # Shared constants
    contexts/                     # Shared React contexts
  assets/                         # Static assets (images, fonts, etc.)
  index.css
  main.tsx
  App.tsx
  vite-env.d.ts
```

## Rationale

An MVP-based structure should improve several aspects of the project by:
- Implementing separation of concerns.
- Improving testability and maintainability.
- Enhancing scalability and flexibility.

## Alternatives Considered

- **Type-based**: Poor separation of concerns, hard to scale.
- **Feature-based**: Can lead to mixed concerns within features. Overkill for small projects.

## Consequences

- The codebase will be easier to test, maintain, and scale.
- Developers can work on different layers independently.
- New developers may need time to understand and adapt to the layered architecture.
- For very small features, the layered structure might feel like unnecessary overhead.

## Status

[Proposed]