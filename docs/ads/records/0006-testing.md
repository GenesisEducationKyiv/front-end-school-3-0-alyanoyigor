# ADR 0006: Decision to Implement Testing with Vitest and React Testing Library

## Context

Currently, we don't have any testing in our project. But without proper testing, bugs could slip through and make it harder to add new features or fix existing ones. We want to catch issues early and make sure our code stays clean and easy to work with.

## Decision

**We will adopt Vitest and React Testing Library as the primary testing solutions for our React application.**

## Rationale

Since we are already using **Vite**, **Vitest** is an excellent choice for unit testing business logic, utility functions, hooks, and services. For UI and component testing, **React Testing Library (RTL)** is ideal, as it focuses on testing React components from the user's perspective.

## Alternatives Considered

- **Jest instead of Vitest**: Slightly slower in Vite projects; requires more configuration for Vite; heavier for small/medium projects; needs additional setup for ESM modules.
- **Enzyme instead of RTL**: Enzyme encourages testing implementation details, which leads to brittle tests, while RTL promotes testing user behavior. Additionally, Enzyme is no longer actively maintained.

## Consequences

- All new components and features will be covered by automated tests using Vitest and React Testing Library.
- Existing code will be gradually refactored to include tests.
- There may be a learning curve for the team.
- The process of developing new features could become slower initially.

## Status

[Proposed] 