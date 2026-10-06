# Changelog

Notable changes to this demo. Format: [Keep a Changelog](https://keepachangelog.com/). This project uses [SemVer](https://semver.org/).

## [0.1.0] — 2026-10-06

First public release. The pattern, reduced to a 30-second, dependency-free demo: **claim-vs-artifact verification** plus a **tamper-evident hash-chained log**, run against a synthetic fleet.

### Added
- `public-safe-demo.mjs` — three acts in one run:
  - **ACT 1** — the naive check counts *claims* and reports GREEN (the false green).
  - **ACT 2** — the integrity verifier checks each *claim against its artifact* → RED, listing the claims with no artifact attached.
  - **ACT 3** — tamper-evidence: edit any accepted row and the hash chain fails to verify.
  - Exit **0** = the false green was caught. Exit **1** = a false claim slipped through (the demo failed).

### Fixed before release — both caught by *running it*, not by review
- An **earlier draft printed a false count** of caught claims (a path bug — it looked in the wrong place). An integrity demo that ships a false *count* is the exact failure it warns against. Fixed.
- A **later draft's tamper test was a no-op**: it overwrote a field with the value it already held, so the chain still verified. Fixed to mutate a field to a genuinely different value.

We publish these because the whole point is that a claim should survive being checked. Ours did.

### Notes
- No dependencies, no network. Synthetic data only.
- The version starts at **0.1.0** on purpose: this is a **pattern demo, not a product**. An honest early number beats an inflated one.
