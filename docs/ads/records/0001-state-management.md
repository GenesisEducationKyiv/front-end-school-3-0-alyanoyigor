# ADR 0001: Decision to Choose Zustand for State Management

## Context
Currently, the project uses React Context for global state management. For further development and scaling of the project, it is worth using more optimized state management solutions for better performance and maintainability of the project.

## Decision

We will adopt the [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) as the primary state management solution for our React application.

## Rationale

The main reasons for choosing Zustand as the state management method were:
- Simplicity of use and low entry threshold.
- Small library size.
- TypeScript support.
- Does not require wrapping in Context Providers unlike Redux.
- High popularity of the library in conjunction with React and a large community.

## Alternatives Considered

- **Redux**. Greater complexity and boilerplate code, which is unnecessary for a project of this size.
- **MobX**. Greater complexity and entry threshold. Also because the team (one person) had no experience with this library.
- **Context API** (currently used). An unoptimized approach that is difficult to scale.

## Consequences

- All new global/shared state will be managed via Zustand stores.
- Existing state management patterns will be gradually refactored to use Zustand.
- Setup and implementation will require additional time and effort.
- New developers unfamiliar with the library will need time to adapt.

## Status

[Proposed]