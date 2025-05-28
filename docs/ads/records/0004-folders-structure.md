# ADR 0004: Decision to Implement Module-View-Presenter (MVP) Architecture

## Context

As our application grows, we want to enforce a clear separation of concerns and make the codebase easy to maintain, test, and scale.

- The project is a React SPA with business logic, API integration, and UI.
- We want to separate UI, business logic, and presentation logic.
- The team values testability, maintainability, and the ability to scale or refactor easily.

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
      presenter/                  # Presentation logic (hooks, state management, data transformation)
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

### MVP Separation of Concerns
- **Module:** Handles all business logic, data fetching, state, and validation for a feature.
- **Presenter:** Contains presentation logic, transforms data for the view, and mediates between the module and the view.
- **View:** Pure UI components, focused on rendering and user interaction, with minimal logic.

### Testability & Maintainability
- Presenters can be unit tested independently of the UI.
- Modules can be tested for business logic and data correctness.
- Views are simple and reusable.

### Scalability & Flexibility
- New features are added as new modules, each with its own MVP structure.
- Shared code is centralized in the `shared/` directory.
- Easy to refactor or swap implementations at any layer.

## Alternatives Considered

| Structure Type         | Pros                                              | Cons                                              |
|-----------------------|---------------------------------------------------|---------------------------------------------------|
| **Type-based**        | Simple, familiar                                  | Poor separation of concerns, hard to scale        |
| **Feature-based**     | Good for large teams/features                     | Can lead to mixed concerns within features        |
| **Layered (MVP, proposed)** | Clear boundaries, testable, scalable, maintainable | Slightly more complex for small projects          |

## Consequences

- The codebase will be easier to test, maintain, and scale.
- Developers can work on different layers independently.
- Refactoring or swapping implementations (e.g., API, UI) is easier.
- New features can be added as new modules with their own MVP structure.

## Status

[Proposed]