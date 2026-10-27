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
    ppl: [
      ["Murugan", 90, ["Scaffolding Safety (Level 2)", "Heavy Crane Rigging", "First Aid Responder"]],
      ["Selvi", 85, ["Concrete Pouring Specialist", "Site Gate Security", "OSHA Basics"]],
      ["Raju", 95, ["High-Altitude Scaffolding", "Equipment Maintenance"]]
    ]
  },
  col: {
    n: "College Campus",
    cap: 9,
    mult: 1.5,
    maxShift: 12,
    minRest: 10,
    maxStreak: 6,
    areas: ["Hostel block", "Canteen", "Labs"],
    ppl: [
      ["Lakshmi", 70, ["Chemical Lab Safety", "Hazardous Waste Handling"]],
      ["Karthik", 75, ["Campus Electrical Systems", "Fire Marshall Certified"]],
      ["Fatima", 72, ["Facility Sanitation Protocol", "First Aid Responder"]]
    ]
  },
  hos: {
    n: "Hospital & Healthcare",
    cap: 8,
    mult: 1.5,
    maxShift: 12,
    minRest: 11,
    maxStreak: 6,
    areas: ["ICU Ward", "Emergency Care", "Sanitation Bay"],
    ppl: [
      ["Nurse Priya", 120, ["ICU Emergency Protocol", "Infection Control Specialist", "BLS Certified"]],
      ["Dr. Anand", 150, ["Trauma Care Level 1", "Radiation Safety Protocol"]],
      ["Ramesh", 80, ["Biohazard Waste Disposal", "Sanitation Team Lead"]]
    ]
  },
  fac: {
    n: "Manufacturing Factory",
    cap: 8,
    mult: 2,
    maxShift: 12,
    minRest: 10,
    maxStreak: 6,
    areas: ["Assembly Line 1", "Press Machine B", "Chemical Storage"],
    ppl: [
      ["Vikram", 95, ["Hydraulic Press Operator", "Forklift Certified", "Machine Guarding"]],
      ["Deepa", 90, ["Assembly Line Quality Control", "Ergonomics Safety"]],
      ["Sunil", 85, ["Chemical Storage Handling", "Spill Response Protocol"]]
    ]
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

  // Seed 7 days of attendance
  for (let k = 7; k >= 1; k--) {
    g.ppl.forEach((_, i) => {
      if (i === 2 && k % 3 === 0) return;
      const s = t0 - k * 24 * HR + 8 * HR;
      add(d, i, s, s + (g.cap + (i === 0 && k <= 3 ? 5 : 0)) * HR);
    });
  }

  // Realistic seed hazard reports tailored to sector
  const hazardsMap = {
    "Scaffold A": ["Platform board cracked", "Loose railing near stairs"],
    "Hostel block": ["Water leak near stairs", "Faulty electrical switch"],
    "ICU Ward": ["Oxygen pressure sensor alert", "Spill near triage corridor"],
    "Assembly Line 1": ["Emergency stop button delayed", "Overheating bearing on roller 4"]
  };
  const defaultHazards = (g.areas && hazardsMap[g.areas[0]]) || ["Platform board cracked", "Loose railing near stairs"];

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

  // Flag 1: Long shifts exceeding limit
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
