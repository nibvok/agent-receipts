# Contributing

Thanks for looking. This is a small, opinionated demo of one idea: **an agent's `DONE` should be a receipt, not an assertion.**

## Run it first

```bash
node public-safe-demo.mjs
```

Exit **0** means the false green was caught (good). Exit **1** means it slipped through (that would be a bug — please open an issue).

## What we most want

**Point it at your own fleet and tell us what it found.** That's the single most useful contribution: the pattern either catches real false greens in your setup or it doesn't, and we'd rather know than guess. Open an issue with the "fleet report" template.

## Ground rules

- **No unproven claims.** This project is about the difference between a claim and its evidence — so it holds itself to the same bar. Every claim in a PR or README must be backed by something runnable.
- **Keep it honest, keep it small.** The demo has no dependencies and no network on purpose. Prefer a clear script over a framework.
- **English copy stays inside the wording gate:** no "compliance", "certification", "guarantee", "court-admissible", or "tamper-proof". We attest **evidence**; we don't certify outcomes. See the README.

## Pull requests

1. Run the demo — it must exit 0.
2. Keep the change minimal and explained.
3. If you add a claim, add the artifact that proves it.
