# ADR 0007: Decision to Replace Axios with Ky

## Context

As part of our fourth homework assignment to evaluate and replace a library with security concerns, we identified that `axios` - our current HTTP request library - has several vulnerabilities that make it a candidate for replacement.

## Decision

**We will replace `axios` with `ky`**.

## Rationale

After carefully analyzing both libraries, here are the key findings from our security research and comparison:

### Dependency Vulnerabilities Check

Security reports from [Snyk](https://snyk.io/) show that Axios has had 114 vulnerabilities since 2014 [report](https://security.snyk.io/package/npm/axios), while Ky has had zero vulnerabilities since 2016 [report](https://security.snyk.io/package/npm/ky). This significant difference in security track record was a key factor in our decision.

### Zero-Day Vulnerabilities Check

Axios has transitive dependencies, so that can lead to Supply Chain Attacks as mentioned in [Socket.dev report](https://socket.dev/npm/package/axios/alerts/1.9.0). Also one of the transitive dependencies uses `eval` which is a security risk [report](https://socket.dev/npm/package/axios/alerts/1.9.0?tab=dependencies&alert_name=usesEval).

Ky in contrast has no transitive dependencies, so it is not vulnerable to Supply Chain Attacks ([Socket.dev report](https://socket.dev/npm/package/ky/alerts/1.5.0)).

### Manual Reliability Check

| Metric              | Axios                       | Ky                                                   |
| ------------------- | --------------------------- | ---------------------------------------------------- |
| ⭐ GitHub Stars     | ~107k                       | ~14,5k                                               |
| ⬇️ Weekly Downloads | ~62m                        | ~2,5m                                                |
| 🕙 Last Update      | 2025-04-24                  | 2025-04-14                                           |
| 🐛 Open Issues      | 577                         | 58                                                   |
| 📦 Size (gzipped)   | 13.7kB                      | 3.8kB                                                |
| 👤 Owner reputation | Reputable, but slower fixes | Maintained by Sindre Sorhus (trusted OSS maintainer) |

## Consequences

- Replace all instances of axios with ky across the codebase
- Simplify maintenance due to ky's minimal footprint
- Build custom interceptor functionality as needed
- Achieve better security with zero dependencies
- One-time migration effort required

## Status

[Proposed]
