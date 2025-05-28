# ADR 0002: Decision to Choose Client-Side Rendering (CSR) over Server-Side Rendering (SSR)

## Context

As we architect our React application, it is crucial to select the most appropriate approach for delivering content to users.

- The project is a single-page application (SPA) built with React, Vite, and React Router.
- All routing and rendering are handled on the client side; there is no use of Next.js or any SSR/SSG framework.
- Data is fetched from APIs using React Query and Axios after the initial page load.
- The application is not content-heavy and does not require SEO optimization for public search engines at this stage.
- The user experience prioritizes interactivity, responsiveness, and fast client-side navigation.
- The deployment and hosting environments are optimized for static assets and do not require Node.js servers for SSR.

## Decision

**We will use Client-Side Rendering (CSR) as the rendering strategy for the project.**

## Rationale

### Simplicity & Developer Experience
- CSR is straightforward to implement with Vite and React Router, requiring no additional server infrastructure.
- Developers can focus on building features without managing server-side rendering logic or hydration issues.
- Hot Module Replacement (HMR) and fast local development are fully supported.

### Performance
- Static assets can be served via any CDN or static hosting provider, ensuring fast initial loads for users globally.
- Client-side navigation is instant and does not require full page reloads.
- The app fetches only the data it needs, when it needs it, reducing server load and bandwidth.

### Flexibility
- The architecture is well-suited for authenticated, interactive, and dashboard-like applications.
- Easy to integrate with modern client-side libraries (React Query, Zustand, etc.).

### Drawbacks and Mitigations
- **SEO Limitations:** CSR is not ideal for SEO-critical public content. However, our app is not focused on public search engine discoverability.
- **Slower First Contentful Paint (FCP):** The initial load may be slower for users on slow networks, but this is mitigated by serving optimized static assets and using loading skeletons.
- **No Server-Side Personalization:** All personalization happens after the client loads, which is acceptable for our use case.

## Alternatives Considered

| Solution | Pros | Cons |
|----------|------|------|
| **SSR (e.g., Next.js)** | Better SEO, faster FCP for some use cases, server-side personalization | More complex setup, requires Node.js server, less optimal for SPA/dashboard apps, unnecessary for our needs |
| **Static Site Generation (SSG)** | Fast static delivery, good for blogs/docs | Not suitable for dynamic, interactive apps with authenticated content |
| **CSR (Vite + React Router)** | Simple, fast, flexible, great DX, works with static hosting | Not ideal for SEO, slower FCP on slow networks |

## Consequences

- The app will be deployed as static assets and can be hosted on any CDN or static hosting provider.
- All routing and rendering will occur on the client; the server will only provide API data.
- If SEO or public discoverability becomes a requirement, we may need to revisit this decision and consider SSR or SSG.
- The team can move quickly with a modern, streamlined development workflow.

## Status

[Accepted]