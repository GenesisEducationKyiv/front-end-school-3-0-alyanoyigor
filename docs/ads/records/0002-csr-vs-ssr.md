# ADR 0002: Decision to Choose Client-Side Rendering (CSR) over Server-Side Rendering (SSR)

## Context

The project, which involves managing music tracks, requires high interactivity and responsiveness for the user. It does not require SEO optimizations or the additional complexity and costs associated with SSR frameworks.

## Decision

**We will use Client-Side Rendering (CSR) as the rendering strategy for the project.**

## Rationale

The main reasons for choosing the CSR strategy were:
- The application is highly interactive and benefits from fast client-side updates.
- There is no significant need for SEO, as the application is not intended to be indexed by search engines or discovered via organic search.
- CSR allows for a simpler deployment process, as it does not require a Node.js server or SSR infrastructure.
- Development is more straightforward, with a wide range of tools and libraries available for client-side frameworks like React.

## Consequences

- The project will benefit from easier scaling and hosting, as it can be served as static files from a CDN.
- The initial load time may be slightly longer, as the client must download and render the application before it becomes interactive.
- The application will not be easily indexable by search engines, which is acceptable for this use case.
- All rendering logic will reside on the client, so users with very old browsers or JavaScript disabled will not be able to use the application.

## Status

[Accepted]