#!/usr/bin/env node
// Public-safe demo: "the false green, caught."
// Self-contained. Synthetic fixture. No dependencies. Touches nothing outside its own temp dir.
//
// Story in two acts:
//   ACT 1  A naive status check counts completion CLAIMS and reports 100% done (GREEN).
//   ACT 2  An integrity verifier checks each CLAIM against its ARTIFACT and catches the false ones.
// Plus a tamper test: edit any accepted row and the hash chain detects it.
//
// Usage:  node public-safe-demo.mjs
// Exit:   0 = demo passed (the false green WAS caught); 1 = demo failed.

import { createHash } from "node:crypto";
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sha = (s) => createHash("sha256").update(s).digest("hex");

// ---------- ACT 0: a synthetic fleet of completion claims ----------
// Generic counts on purpose. "repin" = a status marker with no fresh artifact behind it.
const N = 40;
const tasks = [];
for (let i = 1; i <= N; i++) {
  const id = `T-${String(i).padStart(2, "0")}`;
  // 8 of 40 are backed by a real artifact; the rest are status-marker-only re-pins.
  const hasArtifact = i % 5 === 0; // 8 tasks
  tasks.push({ id, claimed: "COMPLETE", hasArtifact });
}

// ---------- ACT 0b: a hash-chained ledger of those claims (append-only) ----------
const dir = mkdtempSync(join(tmpdir(), "integrity-demo-"));
const ledgerPath = join(dir, "ledger.jsonl");
let prev = "0".repeat(64);
const lines = [];
for (const t of tasks) {
  const row = {
    ts: new Date(0).toISOString(),
    id: t.id,
    event: "completion-claim",
    claim: t.claimed,
    artifact: t.hasArtifact ? sha(`artifact:${t.id}`) : null, // null = no artifact
    prev_hash: prev,
  };
  const hash = sha(JSON.stringify(row));
  lines.push(JSON.stringify({ ...row, hash }));
  prev = hash;
}
writeFileSync(ledgerPath, lines.join("\n") + "\n");
const rows = lines.map((l) => JSON.parse(l));

console.log(`integrity demo - synthetic fleet of ${N} tasks, hash-chained ledger at a temp path`);

// ---------- ACT 1: the naive status check (the false green) ----------
const claimedDone = rows.filter((r) => r.claim === "COMPLETE").length;
console.log("\n=== ACT 1: a naive status check ===");
console.log(`  claims marked COMPLETE: ${claimedDone}/${N}`);
console.log("  RESULT: GREEN (100% complete) - because it counted the CLAIM, not the evidence.");

// ---------- ACT 2: the integrity verifier (the catch) ----------
const falseGreens = rows.filter((r) => r.claim === "COMPLETE" && !r.artifact);
console.log("\n=== ACT 2: the integrity verifier (claim vs artifact) ===");
console.log(`  claims WITHOUT an artifact: ${falseGreens.length}/${N}`);
for (const r of falseGreens.slice(0, 3)) console.log(`    - ${r.id}: says COMPLETE, no artifact attached`);
if (falseGreens.length > 3) console.log(`    ... and ${falseGreens.length - 3} more`);
const act2Catch = falseGreens.length > 0;
console.log(`  RESULT: ${act2Catch ? "RED - false completion detected" : "clean"}`);

// ---------- ACT 3: tamper test on the hash chain ----------
console.log("\n=== ACT 3: tamper-evidence (recompute the chain) ===");
function chainOk(rs) {
  let p = "0".repeat(64);
  for (const r of rs) {
    const { hash, ...body } = r;
    if (body.prev_hash !== p || sha(JSON.stringify(body)) !== hash) return false;
    p = hash;
  }
  return true;
}
const clean = chainOk(rows);
console.log(`  chain intact: ${clean}`);
// Edit a throwaway copy and re-verify -> must fail.
const tampered = rows.map((r) => ({ ...r }));
// Mutate a body field to a genuinely DIFFERENT value (attach a fake artifact to a false claim).
tampered[Math.floor(N / 2)].artifact = sha("forged-artifact");
const stillIntact = chainOk(tampered);
console.log(`  after editing one row's body: chain intact = ${stillIntact} (must be false)`);
const act3Catch = !stillIntact && clean;

// ---------- verdict ----------
console.log("\n=== VERDICT ===");
const passed = act2Catch && act3Catch;
console.log(
  passed
    ? "DEMO PASS - the false green was caught (claim/artifact check + tamper-evident chain)."
    : "DEMO FAIL - a false claim slipped through."
);
rmSync(dir, { recursive: true, force: true });
process.exit(passed ? 0 : 1);
