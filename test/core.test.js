import test from "node:test";
import assert from "node:assert/strict";
import { ORG, HR, add, seed, verify, verifyWorker, calc, flags, groups } from "../src/core.js";

const NOW = new Date(2026, 9, 27, 12).getTime();

test("untouched ledger verifies", () => assert.equal(verify(seed(ORG.con, NOW)), -1));

test("editing a past record breaks the chain", () => {
  const d = seed(ORG.con, NOW);
  d.sh[3].e += HR;
  assert.equal(verify(d), 3);
});

test("overtime is paid at the sector multiplier", () => {
  const g = { cap: 8, mult: 2, ppl: [["a", 100]] }, d = { sh: [] };
  add(d, 0, 0, 10 * HR);
  assert.deepEqual(calc(d, g, 0), { reg: 8, ot: 2, rate: 100, pay: 1200 });
});

test("fatigue rules flag long shifts and long streaks", () => {
  const d = seed(ORG.con, NOW);
  assert.ok(flags(d, 0).includes("Shift >12h"));
  assert.ok(flags(d, 1).some(x => x.includes("days in a row")));
});

test("short rest between shifts is flagged", () => {
  const d = { sh: [] };
  add(d, 0, 0, 8 * HR);
  add(d, 0, 13 * HR, 21 * HR);
  assert.ok(flags(d, 0).includes("Rest <10h"));
});

test("reports group by area and type", () => {
  const g = groups(seed(ORG.con, NOW));
  assert.equal(g.length, 1);
  assert.equal(g[0][1].x.length, 2);
});

test("streak correctly identifies non-consecutive days as NOT in a row", () => {
  const d = { sh: [] };
  // Add 6 shifts, each on Mondays (7 days apart)
  for (let i = 0; i < 6; i++) {
    const s = i * 7 * 24 * HR;
    add(d, 0, s, s + 8 * HR);
  }
  const f = flags(d, 0);
  // Non-consecutive shifts should NOT trigger "days in a row"
  assert.ok(!f.some(x => x.includes("days in a row")));
});

test("verifyWorker accurately identifies which worker was affected", () => {
  const d = seed(ORG.con, NOW);
  // Tamper record 3 (which belongs to Murugan, w=0)
  const targetWorker = d.sh[3].w;
  d.sh[3].e += HR;
  const statusMurugan = verifyWorker(d, targetWorker);
  assert.equal(statusMurugan.intact, false);
  assert.equal(statusMurugan.ownAltered, true);
  assert.equal(statusMurugan.badIndex, 3);

  // Other worker (w=1) should know ledger is broken, but their own record wasn't the broken one
  const otherWorker = (targetWorker + 1) % 3;
  const statusOther = verifyWorker(d, otherWorker);
  assert.equal(statusOther.intact, false);
  assert.equal(statusOther.ownAltered, false);
});
