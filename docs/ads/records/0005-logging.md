# ADR 0005: Decision to Implement Logging with Sentry

## Context

We need a reliable way to track errors and monitor our app as it grows bigger. Without proper logging, we won't be able to spot issues quickly and keep everything running smoothly.

## Decision

**We will adopt Sentry as the primary logging and error tracking solution for our React application.**

## Rationale

- Sentry offers a straightforward integration with React, requiring minimal setup.
- Captures errors, stack traces, and user actions in real time.
- Provides dashboards, alerts, and session replays for rapid debugging.

Alternative: **Manual logging system**. This would require much more time to implement and would need consistent maintenance.

## Consequences

- All new error tracking and logging will be managed via Sentry.
- It will take additional time to adapt to the Sentry platform.
- Sentry may capture non-critical errors, leading to alert fatigue. We will use filtering (`beforeSend`) and alert rules to reduce noise.

## Status

[Proposed]