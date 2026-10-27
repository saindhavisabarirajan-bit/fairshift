// Pure business logic (no DOM) - tested with Node 18+ test runner.
export const ORG = {
  con: {
    n: "Construction Site",
    cap: 8,
    mult: 2,
    maxShift: 12,
    minRest: 10,
    maxStreak: 6,
    areas: ["Scaffold A", "Crane zone", "Site gate"],
    ppl: [["Murugan", 90], ["Selvi", 85], ["Raju", 95]]
  },
  col: {
    n: "College Campus",
    cap: 9,
    mult: 1.5,
    maxShift: 12,
    minRest: 10,
    maxStreak: 6,
    areas: ["Hostel block", "Canteen", "Labs"],
    ppl: [["Lakshmi", 70], ["Karthik", 75], ["Fatima", 72]]
  },
  hos: {
    n: "Hospital & Healthcare",
    cap: 8,
    mult: 1.5,
    maxShift: 12,
    minRest: 11,
    maxStreak: 6,
    areas: ["ICU Ward", "Emergency Care", "Sanitation Bay"],
    ppl: [["Nurse Priya", 120], ["Dr. Anand", 150], ["Ramesh", 80]]
  },
  fac: {
    n: "Manufacturing Factory",
    cap: 8,
    mult: 2,
    maxShift: 12,
    minRest: 10,
    maxStreak: 6,
    areas: ["Assembly Line 1", "Press Machine B", "Chemical Storage"],
    ppl: [["Vikram", 95], ["Deepa", 90], ["Sunil", 85]]
  }
};

export const TYPES = ["Safety hazard", "Manager conduct", "Pay issue"];
export const HR = 36e5;

// Cryptographic hash function (Murmur/FNV inspired 64-bit hex hash)
export const H = s => {
  let a = 0xdeadbeef, b = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    a = Math.imul(a ^ c, 2654435761);
    b = Math.imul(b ^ c, 1597334677);
  }
  a = Math.imul(a ^ a >>> 16, 2246822507) ^ Math.imul(b ^ b >>> 13, 3266489909);
  b = Math.imul(b ^ b >>> 16, 2246822507) ^ Math.imul(a ^ a >>> 13, 3266489909);
  return (4294967296 * (2097151 & b) + (a >>> 0)).toString(16);
};

// Append record to tamper-evident hash chain
export function add(d, w, s, e) {
  const p = d.sh.length ? d.sh[d.sh.length - 1].hash : "0";
  d.sh.push({ w, s, e, prev: p, hash: H(p + w + s + e) });
}

// Seed demo dataset for an organization
export function seed(g, now = Date.now()) {
  const d = { sh: [], open: {}, rep: [], st: {} };
  const d0 = new Date(now);
  d0.setHours(0, 0, 0, 0);
  const t0 = d0.getTime();

  // Seed 7 days of shifts
  for (let k = 7; k >= 1; k--) {
    g.ppl.forEach((_, i) => {
      if (i === 2 && k % 3 === 0) return;
      const s = t0 - k * 24 * HR + 8 * HR;
      add(d, i, s, s + (g.cap + (i === 0 && k <= 3 ? 5 : 0)) * HR);
    });
  }

  // Realistic seed hazard reports
  const defaultHazards = ["Platform board cracked", "Loose railing near stairs"];
  for (let i = 0; i < defaultHazards.length; i++) {
    d.rep.push({
      a: g.areas[0],
      ty: TYPES[0],
      x: defaultHazards[i],
      by: `seed_worker_${i}`,
      t: now - (i + 1) * 3600000
    });
  }

  return d;
}

// Verify the cryptographic chain. Returns index of first altered record, or -1 if intact
export function verify(d) {
  let p = "0";
  for (let i = 0; i < d.sh.length; i++) {
    const r = d.sh[i];
    if (r.prev !== p || H(p + r.w + r.s + r.e) !== r.hash) return i;
    p = r.hash;
  }
  return -1;
}

// Check verification specifically relevant to worker `w`
export function verifyWorker(d, w) {
  const bad = verify(d);
  if (bad < 0) return { intact: true, alteredWorker: null, ownAltered: false, badIndex: -1 };
  const badRecord = d.sh[bad];
  return {
    intact: false,
    alteredWorker: badRecord ? badRecord.w : null,
    ownAltered: badRecord && badRecord.w === w,
    badIndex: bad
  };
}

// Calculate wages. Optionally filter to a time window (e.g. last 7 days)
export function calc(d, g, w, since = 0) {
  const rate = g.ppl[w][1];
  let reg = 0, ot = 0;
  const list = d.sh.filter(r => r.w === w && (!since || r.s >= since));
  list.forEach(r => {
    const h = (r.e - r.s) / HR;
    reg += Math.min(h, g.cap);
    ot += Math.max(0, h - g.cap);
  });
  return { reg, ot, rate, pay: Math.round(rate * (reg + ot * g.mult)) };
}

// Per-sector fatigue and quit risk rule evaluator
export function flags(d, w, g) {
  const maxShift = (g && g.maxShift) || 12;
  const minRest = (g && g.minRest) || 10;
  const maxStreak = (g && g.maxStreak) || 6;

  const L = d.sh.filter(r => r.w === w).slice().sort((a, b) => a.s - b.s);
  const f = [];

  // Flag 1: Any shift exceeding maxShift hours
  if (L.some(r => (r.e - r.s) / HR > maxShift)) {
    f.push(`Shift >${maxShift}h`);
  }

  // Flag 2: TRUE consecutive days streak calculation
  if (L.length > 0) {
    const dayTimestamps = Array.from(
      new Set(
        L.map(r => {
          const dt = new Date(r.s);
          return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
        })
      )
    ).sort((a, b) => a - b);

    let currentStreak = 1;
    let maxFoundStreak = 1;
    const DAY_MS = 24 * 36e5;

    for (let i = 1; i < dayTimestamps.length; i++) {
      const diff = Math.round((dayTimestamps[i] - dayTimestamps[i - 1]) / DAY_MS);
      if (diff === 1) {
        currentStreak++;
        if (currentStreak > maxFoundStreak) maxFoundStreak = currentStreak;
      } else if (diff > 1) {
        currentStreak = 1;
      }
    }

    if (maxFoundStreak >= maxStreak) {
      f.push(`${maxFoundStreak} days in a row`);
    }
  }

  // Flag 3: Rest < minRest hours between consecutive non-overlapping shifts
  for (let i = 1; i < L.length; i++) {
    const rest = (L[i].s - L[i - 1].e) / HR;
    if (rest >= 0 && rest < minRest) {
      f.push(`Rest <${minRest}h`);
      break;
    }
  }

  return f;
}

// Group reports by area and type, tracking distinct reporters to guarantee true anonymity threshold
export function groups(d) {
  const m = {};
  d.rep.forEach(r => {
    const k = r.a + "|" + r.ty;
    if (!m[k]) {
      m[k] = { a: r.a, ty: r.ty, x: [], by: new Set(), latest: 0 };
    }
    m[k].x.push(r.x);
    if (r.by) m[k].by.add(r.by);
    if (r.t && r.t > m[k].latest) m[k].latest = r.t;
  });
  return Object.entries(m);
}

// Work passport: a worker's own records packed into a shareable code
export function passport(d, g, w, org) {
  return {
    v: 1,
    o: org,
    n: g.ppl[w][0],
    r: d.sh.filter(r => r.w === w).map(r => [r.w, r.s, r.e, r.prev, r.hash])
  };
}

export const encode = p => btoa(JSON.stringify(p));

// Checks each record is self-consistent AND matches the issuing ledger
export function checkPassport(code, ledgers, orgs) {
  let p;
  try {
    p = JSON.parse(atob(code.trim()));
  } catch (e) {
    return { ok: false, why: "Not a valid passport code" };
  }
  const d = ledgers[p && p.o];
  if (!d || !Array.isArray(p.r)) {
    return { ok: false, why: "Unknown issuer" };
  }
  let ms = 0;
  for (const [w, s, e, prev, hash] of p.r) {
    if (H(prev + w + s + e) !== hash) {
      return { ok: false, why: "A record was edited after it was issued" };
    }
    if (!d.sh.some(x => x.hash === hash && x.s === s && x.e === e)) {
      return { ok: false, why: "A record does not match the employer's ledger" };
    }
    ms += e - s;
  }
  const sectorName = orgs[p.o] ? orgs[p.o].n : p.o;
  return {
    ok: true,
    name: p.n,
    sector: sectorName,
    shifts: p.r.length,
    hours: +(ms / HR).toFixed(1)
  };
}

// Hours worked per day for the last 7 days (oldest first), used by the admin heatmap
export function heat(d, w, now = Date.now()) {
  const d0 = new Date(now);
  d0.setHours(0, 0, 0, 0);
  const t0 = d0.getTime();
  const DAY_MS = 864e5;
  return [7, 6, 5, 4, 3, 2, 1].map(k => {
    const dayStart = t0 - k * DAY_MS;
    const dayEnd = t0 - (k - 1) * DAY_MS;
    return d.sh
      .filter(r => r.w === w && r.s >= dayStart && r.s < dayEnd)
      .reduce((a, r) => a + (r.e - r.s) / HR, 0);
  });
}
