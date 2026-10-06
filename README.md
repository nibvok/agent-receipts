# proof-of-work for AI agents

`v0.1.0` · MIT · a pattern demo, not a product.

**We caught a false green in our own agent fleet — and here's the arithmetic.**

An AI agent reported its work `COMPLETE`. The status check agreed. It was wrong: the "completion" was a status marker with **no artifact behind it**. We only found it because we asked a different question — not *"what did the agent do?"* but *"is the claim TRUE?"*

This repo is the pattern that caught it, reduced to a 30-second, dependency-free demo.

## The problem

An agent says `DONE`. A dashboard turns green. Nobody checks whether the *claim* is backed by an *artifact*. We call that a **false green** — the quiet failure mode of every agent fleet.

- **Observability** answers *"what did the model do?"* — it trusts the agent's own telemetry.
- **Integrity** answers *"is the claim TRUE?"* — it demands the artifact and verifies the chain.

## The demo

```bash
node public-safe-demo.mjs
```

Self-contained. Synthetic data. No network, no dependencies.

| Act | What happens |
|---|---|
| **1 — the naive check** | Counts completion *claims* → **GREEN** (100% complete). This is the false green. |
| **2 — the integrity verifier** | Checks each **claim against its artifact** → **RED**: claims with no artifact attached. |
| **3 — tamper-evidence** | Claims live in a **hash-chained ledger**; edit any accepted row → the chain **fails to verify**. |

Exit code **0** = the false green was caught. Exit **1** = a false claim slipped through (the demo failed).

## Why we're giving it away

Because **credibility is built by showing the work, not by selling a guarantee.** We caught this on ourselves, we publish the artifact, and you can run it. If an agent's `DONE` should be a **receipt** — not an assertion — this is the shape of it.

## What this is (and isn't)

- It is a **proof-of-work pattern**: claim-vs-artifact verification + a tamper-evident ledger.
- It is **not** a compliance, certification, or "AI security" product. It attests **evidence**. Conformity determinations belong to your auditor or regulator.
- The ledger here is a plain **hash chain** — tamper-**evident**, which is not the same as a qualified legal timestamp.

## The idea in one line

> *Others attest that a statement was made and logged. This proves the statement is TRUE — or proves it false.*

## License

MIT — see [LICENSE](./LICENSE). Run it, fork it, put it on your own fleet.
