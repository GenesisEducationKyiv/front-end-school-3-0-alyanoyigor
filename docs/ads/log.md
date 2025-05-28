# Architecture Decision Log

This document provides a chronological log of all Architecture Decision Records (ADRs) for this project, with links and brief summaries for each decision.

---

- [ADR 0001: Decision to Choose Zustand for State Management](./records/0001-state-management.md)
  - Zustand is adopted as the primary state management solution to ensure scalable, efficient, and type-safe global state handling in the React application.

- [ADR 0002: Decision to Choose Client-Side Rendering (CSR) over Server-Side Rendering (SSR)](./records/0002-csr-vs-ssr.md)
  - The project uses CSR for simplicity, fast development, and flexibility, as SEO and SSR are not current requirements.

- [ADR 0003: Decision to Prevent Unnecessary Rerenders of Modals](./records/0003-rerender-modals.md)
  - All modal components are wrapped with `React.memo` to prevent unnecessary rerenders and improve performance, especially with shadcn UI modals.

- [ADR 0004: Decision to Implement Module-View-Presenter (MVP) Architecture](./records/0004-folders-structure.md)
  - The codebase is organized by MVP layers (Module, Presenter, View) to improve separation of concerns, testability, and scalability.

- [ADR 0005: Decision to Implement Logging with Sentry](./records/0005-logging.md)
  - Sentry is adopted for real-time error tracking, performance monitoring, and actionable insights, integrated throughout the React stack.

- [ADR 0006: Decision to Implement Testing with Vitest and React Testing Library](./records/0006-testing.md)
  - Vitest and React Testing Library are adopted for testing the React application.