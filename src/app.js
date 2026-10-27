import {
  ORG, TYPES, HR, H,
  seed as seedOrg, add as addRec, verify as ver, verifyWorker as verW,
  calc as cal, flags as fl, groups as grp,
  passport, encode, checkPassport, heat
} from "./core.js";

// Comprehensive Trilingual Dictionary covering BOTH Worker & Admin views
const T = {
  en: {
    ci: "Check in",
    co: "Check out",
    pay: "Payslip",
    hrs: "Regular hours",
    ot: "Overtime hours",
    tot: "Total pay",
    rep: "Report a problem",
    send: "Send anonymously",
    ver: "Records verified",
    alt: "Records altered!",
    hello: "Hello",
    say: "Read aloud",
    in: "You are checked in",
    readyShift: "Ready for your shift",
    demoShiftLen: "Demo shift length",
    scanQrMsg: "Scan the site QR to start your shift",
    linesTamper: "Every line comes from your tamper-proof check-ins below.",
    checkins: "Check-ins",
    workPassport: "Work passport",
    passportDesc: "A code proving your verified hours. Share it with any new employer, in any sector.",
    createPassport: "Create my passport",
    speakBtn: "Speak",
    reportPlaceholder: "Describe the problem, or tap Speak",
    anonHelp: "No name is stored. Managers only see details once 3+ workers report the same issue.",
    workers: "Workers",
    hours7d: "Hours (7d)",
    overtime: "Overtime",
    openIssues: "Open issues",
    ledgerTitle: "Attendance ledger",
    allVerified: "All records verified (hash chain intact)",
    recordAltered: "Record was altered after it was logged",
    demoEdit: "Demo: edit a past record",
    reset: "Reset",
    heatTitle: "Seven-day fatigue heatmap",
    heatDesc: "Darker means a longer shift. Outlined cells go past the daily cap.",
    fatigueTitle: "Fatigue & quit risk",
    rulesFor: "Rules for",
    riskRule: "10h rest, max 6 days in a row. Quit risk = number of flags.",
    verifyPassport: "Verify a work passport",
    verifyPassportHelp: "New hire? Paste the code they share to confirm their record from any sector.",
    verifyBtn: "Verify",
    verifiedResult: "Verified",
    notVerifiedResult: "Not verified",
    anonReportsTitle: "Anonymous reports",
    reportsCount: "report(s). Details hidden until 3 workers report (protects identity)."
  },
  ta: {
    ci: "வருகை பதிவு",
    co: "வெளியேறு",
    pay: "சம்பளச் சீட்டு",
    hrs: "சாதாரண மணி",
    ot: "கூடுதல் நேரம்",
    tot: "மொத்த சம்பளம்",
    rep: "புகார் அளி",
    send: "பெயரின்றி அனுப்பு",
    ver: "பதிவுகள் சரிபார்க்கப்பட்டன",
    alt: "பதிவுகள் மாற்றப்பட்டன!",
    hello: "வணக்கம்",
    say: "படித்துக் காட்டு",
    in: "நீங்கள் உள்ளே உள்ளீர்கள்",
    readyShift: "உங்கள் பணிக்குத் தயார்",
    demoShiftLen: "மாதிரி பணி நேரம்",
    scanQrMsg: "பணியைத் தொடங்க தள QR-ஐ ஸ்கேன் செய்யவும்",
    linesTamper: "ஒவ்வொரு வரியும் உங்கள் மாற்ற முடியாத பதிவுகளிலிருந்து பெறப்பட்டது.",
    checkins: "வருகைப் பதிவுகள்",
    workPassport: "பணி பாஸ்போர்ட்",
    passportDesc: "உங்கள் பணி அனுபவத்தை உறுதிப்படுத்தும் குறியீடு. எந்த புதிய முதலாளியிடமும் பகிரலாம்.",
    createPassport: "பாஸ்போர்ட்டை உருவாக்கு",
    speakBtn: "பேசுக",
    reportPlaceholder: "பிரச்சனையை விவரிக்கவும், அல்லது பேச அழுத்தவும்",
    anonHelp: "பெயர் சேமிக்கப்படாது. 3+ தொழிலாளர்கள் புகார் அளித்த பிறகே நிர்வாகம் விவரங்களைப் பார்க்கும்.",
    workers: "தொழிலாளர்கள்",
    hours7d: "பணி நேரம் (7 நாட்கள்)",
    overtime: "கூடுதல் நேரம்",
    openIssues: "செயலில் உள்ள புகார்கள்",
    ledgerTitle: "வருகைப் பதிவேடு",
    allVerified: "அனைத்துப் பதிவுகளும் சரிபார்க்கப்பட்டன (ஹேஷ் சங்கிலி பாதுகாப்பானது)",
    recordAltered: "பதிவு செய்யப்பட்ட பின் மாற்றப்பட்டது",
    demoEdit: "மாதிரி: பழைய பதிவை மாற்று",
    reset: "மீட்டமை",
    heatTitle: "7-நாள் சோர்வு வரைபடம் (Heatmap)",
    heatDesc: "அடர்ந்த நிறம் நீண்ட பணியைக் குறிக்கிறது. அவுட்லைன் உள்ளவை தினசரி உச்சவரம்பைத் தாண்டியவை.",
    fatigueTitle: "சோர்வு & விலகல் அபாயம்",
    rulesFor: "விதிகள்",
    riskRule: "10 மணிநேர ஓய்வு, தொடர்ந்து அதிகபட்சம் 6 நாட்கள். விலகல் அபாயம் = எச்சரிக்கைகளின் எண்ணிக்கை.",
    verifyPassport: "பணி பாஸ்போர்ட்டைச் சரிபார்",
    verifyPassportHelp: "புதிய பணியாளரா? எந்தத் துறையிலிருந்தும் அவர்களின் பதிவை உறுதிப்படுத்த குறியீட்டை ஒட்டவும்.",
    verifyBtn: "சரிபார்",
    verifiedResult: "சரிபார்க்கப்பட்டது",
    notVerifiedResult: "சரிபார்க்கப்படவில்லை",
    anonReportsTitle: "பெயரற்ற புகார்கள்",
    reportsCount: "புகார்(கள்). 3 தொழிலாளர்கள் தெரிவிக்கும் வரை விவரங்கள் மறைக்கப்படும்."
  },
  hi: {
    ci: "हाजिरी लगाएँ",
    co: "बाहर निकलें",
    pay: "वेतन पर्ची",
    hrs: "सामान्य घंटे",
    ot: "ओवरटाइम घंटे",
    tot: "कुल वेतन",
    rep: "समस्या बताएँ",
    send: "गुमनाम भेजें",
    ver: "रिकॉर्ड सत्यापित",
    alt: "रिकॉर्ड बदले गए!",
    hello: "नमस्ते",
    say: "सुनें",
    in: "आप अंदर हैं",
    readyShift: "अपनी शिफ्ट के लिए तैयार",
    demoShiftLen: "डेमो शिफ्ट अवधि",
    scanQrMsg: "शिफ्ट शुरू करने हेतु साइट QR स्कैन करें",
    linesTamper: "प्रत्येक पंक्ति नीचे दिए गए छेड़छाड़-मुक्त रिकॉर्ड से ली गई है।",
    checkins: "हाजिरी रिकॉर्ड",
    workPassport: "कार्य पासपोर्ट",
    passportDesc: "सत्यापित घंटों को प्रमाणित करने वाला कोड। किसी भी क्षेत्र में नए नियोक्ता के साथ साझा करें।",
    createPassport: "मेरा पासपोर्ट बनाएँ",
    speakBtn: "बोलें",
    reportPlaceholder: "समस्या का विवरण दें, या बोलें पर टैप करें",
    anonHelp: "कोई नाम संग्रहीत नहीं होता। 3+ श्रमिकों द्वारा रिपोर्ट करने पर ही प्रबंधन को विवरण दिखता है।",
    workers: "श्रमिक",
    hours7d: "कार्य घंटे (7 दिन)",
    overtime: "ओवरटाइम",
    openIssues: "लंबित समस्याएँ",
    ledgerTitle: "हाजिरी लेज़र",
    allVerified: "सभी रिकॉर्ड सत्यापित (हैश शृंखला अक्षुण्ण)",
    recordAltered: "रिकॉर्ड दर्ज होने के बाद बदला गया",
    demoEdit: "डेमो: पुराने रिकॉर्ड में बदलाव",
    reset: "रीसेट",
    heatTitle: "सात-दिवसीय थकान हीटमैप",
    heatDesc: "गहरा रंग लंबी शिफ्ट दर्शाता है। आउटलाइन वाले सेल दैनिक सीमा पार करते हैं।",
    fatigueTitle: "थकान व छोड़ने का जोखिम",
    rulesFor: "नियम",
    riskRule: "10 घंटे विश्राम, अधिकतम लगातार 6 दिन। जोखिम = चेतावनियों की संख्या।",
    verifyPassport: "कार्य पासपोर्ट सत्यापित करें",
    verifyPassportHelp: "नया कर्मचारी? किसी भी क्षेत्र से उनका रिकॉर्ड सत्यापित करने हेतु कोड यहाँ पेस्ट करें।",
    verifyBtn: "सत्यापित करें",
    verifiedResult: "सत्यापित",
    notVerifiedResult: "असत्यापित",
    anonReportsTitle: "गुमनाम शिकायतें",
    reportsCount: "रिपोर्ट। 3 श्रमिकों द्वारा रिपोर्ट करने तक विवरण छिपा रहेगा।"
  }
};

const SP = { en: "en-IN", ta: "ta-IN", hi: "hi-IN" };
let prevRoleIdx = 0;
let lastRenderKey = "";
let lastPointerX = window.innerWidth / 2;
let lastPointerY = window.innerHeight / 2;

window.addEventListener("pointerdown", e => {
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
});

const S = {
  org: "con",
  role: "w",
  lang: "en",
  wk: 0,
  len: 9,
  mine: {}, // Scoped per worker to prevent shared terminal privacy leaks
  pp: "",
  vr: null,
  vc: ""
};

const D = {};

const t = key => (T[S.lang] && T[S.lang][key]) || T.en[key] || key;
const $ = selector => document.querySelector(selector);
const esc = str => String(str).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const seed = o => { D[o] = seedOrg(ORG[o]); };
const add = (o, ...args) => addRec(D[o], ...args);
const verify = o => ver(D[o]);
const verifyWorker = (o, w) => verW(D[o], w);
const calc = (o, w, since = 0) => cal(D[o], ORG[o], w, since);
const flags = (o, w) => fl(D[o], w, ORG[o]);
const groups = o => grp(D[o]);
const fmt = ms => new Date(ms).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

// Speech Synthesis with native currency localization
function speak(text) {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SP[S.lang] || "en-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } catch (err) {}
}

// Navigation Header
function hdr() {
  const currentRoleIdx = S.role === "w" ? 0 : 1;
  const fromRoleIdx = prevRoleIdx;
  prevRoleIdx = currentRoleIdx;

  return `
  <header>
    <h1>
      <span class="logo" aria-hidden="true">F</span> FairShift
      <span class="m">Decent Work · SDG 8</span>
    </h1>
    <div class="r">
      <select aria-label="Sector" onchange="changeSector(this.value)">
        ${Object.entries(ORG).map(([k, v]) => `<option value="${k}" ${S.org === k ? "selected" : ""}>${esc(v.n)}</option>`).join("")}
      </select>
      <select aria-label="Language" onchange="S.lang=this.value;render()">
        <option value="en" ${S.lang === "en" ? "selected" : ""}>English</option>
        <option value="ta" ${S.lang === "ta" ? "selected" : ""}>தமிழ்</option>
        <option value="hi" ${S.lang === "hi" ? "selected" : ""}>हिन्दी</option>
      </select>
      <div class="seg" style="--i:${currentRoleIdx};--f:${fromRoleIdx}">
        <button class="t ${S.role === "w" ? "on" : ""}" aria-pressed="${S.role === "w"}" onclick="S.role='w';render()">Worker</button>
        <button class="t ${S.role === "a" ? "on" : ""}" aria-pressed="${S.role === "a"}" onclick="S.role='a';render()">Admin</button>
      </div>
    </div>
  </header>`;
}

// Safe sector switcher ensuring worker index is in bounds
window.changeSector = function (newOrg) {
  S.org = newOrg;
  if (S.wk >= ORG[newOrg].ppl.length) S.wk = 0;
  S.pp = "";
  S.vr = null;
  render();
};

// Worker View
function worker() {
  const o = S.org;
  const g = ORG[o];
  const w = S.wk;
  const op = D[o].open[w];
  const c = calc(o, w);
  const ledgerStatus = verifyWorker(o, w);
  const generalBad = verify(o);

  const currencyWord = S.lang === "ta" ? "ரூபாய்" : S.lang === "hi" ? "रुपये" : "rupees";
  const sayText = `${t("hello")} ${g.ppl[w][0]}. ${t("hrs")} ${c.reg}. ${t("ot")} ${c.ot}. ${t("tot")} ${c.pay} ${currencyWord}.`;
  window.__currentSayText = sayText;

  // Scoped reports: worker only sees reports submitted by themselves from this terminal
  const myKey = `${o}_${w}`;
  const workerSubmittedKeys = S.mine[myKey] || [];
  const allGroups = groups(o);
  const mineHtml = workerSubmittedKeys.map(k => {
    const gr = allGroups.find(x => x[0] === k);
    return gr ? `<li>${esc(gr[1].a)} · ${esc(gr[1].ty)} — <b>${esc(D[o].st[k] || "Received")}</b></li>` : "";
  }).join("");

  return `
  <div class="c">
    <div class="r">
      <select aria-label="Worker" onchange="S.wk=+this.value;S.pp='';render()">
        ${g.ppl.map((p, i) => `<option value="${i}" ${w === i ? "selected" : ""}>${esc(p[0])}</option>`).join("")}
      </select>
      <span class="pill ${ledgerStatus.intact ? 'ok' : (ledgerStatus.ownAltered ? 'bad' : 'wa')}">
        ${ledgerStatus.intact ? '✔ ' + t("ver") : (ledgerStatus.ownAltered ? '⚠ ' + t("alt") : 'ℹ ' + t("alt"))}
      </span>
    </div>
  </div>

  <div class="c">
    <h2>${op ? t("in") + " · " + fmt(op.s) : t("readyShift")}</h2>
    ${op ? `
      <div class="r m">${t("demoShiftLen")}
        <select aria-label="Demo shift length in hours" onchange="S.len=+this.value">
          ${[4, 8, 9, 10, 12, 13].map(h => `<option value="${h}" ${S.len === h ? "selected" : ""}>${h}</option>`).join("")}
        </select> h
      </div>
      <div class="live" id="lv">
        <span id="live">₹0</span>
        <small id="lh">0.0h</small>
      </div>
      <button class="orb out" onclick="out()">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"/>
            <rect x="9" y="9" width="6" height="6" rx="1"/>
          </svg>
        </span>
        ${t("co")}
      </button>
    ` : `
      <button class="orb" onclick="inn()">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 2"/>
          </svg>
        </span>
        ${t("ci")}
      </button>
      <p class="m ctr">${t("scanQrMsg")}</p>
    `}
  </div>

  <div class="c receipt">
    <h2>${t("pay")}</h2>
    <table>
      <tr>
        <td>${t("hrs")}</td>
        <td>${c.reg}h × ₹${c.rate}</td>
      </tr>
      <tr>
        <td>${t("ot")} (×${g.mult})</td>
        <td>${c.ot}h × ₹${c.rate * g.mult}</td>
      </tr>
      <tr>
        <th>${t("tot")}</th>
        <th>₹${c.pay.toLocaleString()}</th>
      </tr>
    </table>
    <p class="m">${t("linesTamper")}</p>
    <button class="p" onclick="speak(window.__currentSayText)">🔊 ${t("say")}</button>
  </div>

  <div class="c">
    <h2>${t("checkins")}</h2>
    <ol class="chain">
      ${D[o].sh.filter(r => r.w === w).slice(-5).map(r => `
        <li>
          <b>${fmt(r.s)}</b> · ${((r.e - r.s) / HR).toFixed(1)}h
          <code>#${r.hash.slice(0, 8)}</code>
        </li>
      `).join("")}
    </ol>
  </div>

  <div class="c">
    <h2>${t("workPassport")}</h2>
    <p class="m">${t("passportDesc")}</p>
    <button class="p" onclick="mkpp()">${t("createPassport")}</button>
    ${S.pp ? `
      <div class="pp">
        ${qr(S.pp)}
        <textarea readonly aria-label="Your passport code">${S.pp}</textarea>
      </div>
    ` : ""}
  </div>

  <div class="c">
    <h2>${t("rep")}</h2>
    <div class="r">
      <select id="ra" aria-label="Area">
        ${g.areas.map(a => `<option>${esc(a)}</option>`).join("")}
      </select>
      <select id="rt" aria-label="Issue type">
        ${TYPES.map(a => `<option>${esc(a)}</option>`).join("")}
      </select>
    </div>
    <br>
    <textarea id="rx" aria-label="Describe the problem" placeholder="${t("reportPlaceholder")}"></textarea>
    <div class="r">
      <button class="t" aria-label="Speak your report" onclick="mic()">🎤 ${t("speakBtn")}</button>
      <button class="p" onclick="sendRep()">${t("send")}</button>
    </div>
    <p class="m">${t("anonHelp")}</p>
    ${mineHtml ? `<ul>${mineHtml}</ul>` : ""}
  </div>`;
}

// Admin View
function admin() {
  const o = S.org;
  const g = ORG[o];
  const bad = verify(o);
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * HR;

  let total7dHours = 0;
  let total7dOT = 0;

  const rows = g.ppl.map((p, i) => {
    // Correctly measure last 7 calendar days
    const c = calc(o, i, sevenDaysAgo);
    const f = flags(o, i);
    total7dHours += c.reg + c.ot;
    total7dOT += c.ot;

    const risk = f.length >= 2 ? ["High", "bad"] : f.length ? ["Medium", "wa"] : ["Low", "ok"];
    const weeklyCapacity = g.cap * (g.maxStreak || 6);
    const barPct = Math.min(100, (c.reg + c.ot) / weeklyCapacity * 100);

    return `
    <tr>
      <td><b>${esc(p[0])}</b></td>
      <td>
        <div class="bar" style="--v:${barPct}%"></div>
        ${(c.reg + c.ot).toFixed(0)}h
      </td>
      <td>${c.ot.toFixed(0)}</td>
      <td>${f.join(", ") || "–"}</td>
      <td><span class="pill ${risk[1]}">${risk[0]}</span></td>
    </tr>`;
  }).join("");

  const gr = groups(o);
  const openCount = gr.filter(x => x[1].x.length >= 3 && D[o].st[x[0]] !== "Resolved").length;

  const rg = gr.map(([k, v]) => v.x.length >= 3 ? `
    <div class="c rep hot">
      <b>${esc(v.a)} · ${esc(v.ty)}</b> <span class="m">(${v.x.length} reports)</span>
      <ul>${v.x.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="r">
        ${["Received", "In progress", "Resolved"].map(s => `
          <button class="t ${(D[o].st[k] || "Received") === s ? "on" : ""}" onclick='stat(${JSON.stringify(k)},"${s}")'>${s}</button>
        `).join("")}
      </div>
    </div>` : `
    <div class="c rep">
      <b>🔒 ${esc(v.a)} · ${esc(v.ty)}</b><br>
      <span class="m">${v.x.length} ${t("reportsCount")}</span>
    </div>`
  ).join("");

  return `
  <div class="g">
    <div class="c stat"><div class="m">${t("workers")}</div><div class="n">${g.ppl.length}</div></div>
    <div class="c stat"><div class="m">${t("hours7d")}</div><div class="n">${total7dHours.toFixed(0)}</div></div>
    <div class="c stat"><div class="m">${t("overtime")}</div><div class="n">${total7dOT.toFixed(0)}h</div></div>
    <div class="c stat"><div class="m">${t("openIssues")}</div><div class="n">${openCount}</div></div>
  </div>

  <div class="c">
    <h2>${t("ledgerTitle")}</h2>
    <div class="blocks" role="img" aria-label="Ledger blocks, red means altered">
      ${D[o].sh.map((r, i) => `<i style="--d:${Math.max(0, i - bad)}" class="${bad >= 0 && i >= bad ? "x" : ""}"></i>`).join("")}
    </div>
    <p class="${bad < 0 ? "ok" : "bad"}">
      ${bad < 0 ? "✔ " + t("allVerified") : "⚠ Record #" + (bad + 1) + " was altered after it was logged"}
    </p>
    <div class="r">
      <button onclick="tamper()">${t("demoEdit")}</button>
      <button onclick="seed(S.org);render()">${t("reset")}</button>
    </div>
  </div>

  <div class="c">
    <h2>${t("heatTitle")}</h2>
    <div class="heat">
      ${g.ppl.map((p, i) => `
        <b>${esc(p[0])}</b>
        ${heat(D[o], i, now).map(h => `
          <i class="${h > g.cap ? "hi" : ""}" style="--p:${Math.min(100, h / 13 * 100)}%" title="${h.toFixed(0)}h">
            ${h ? h.toFixed(0) : "–"}
          </i>
        `).join("")}
      `).join("")}
    </div>
    <p class="m">${t("heatDesc")}</p>
  </div>

  <div class="c">
    <h2>${t("fatigueTitle")}</h2>
    <div class="sc">
      <table>
        <tr>
          <th>Worker</th>
          <th>Hours</th>
          <th>OT</th>
          <th>Flags</th>
          <th>Quit risk</th>
        </tr>
        ${rows}
      </table>
    </div>
    <p class="m">${t("rulesFor")} ${esc(g.n)}: ${g.cap}h/day, OT ×${g.mult}, ${t("riskRule")}</p>
  </div>

  <div class="c">
    <h2>${t("verifyPassport")}</h2>
    <p class="m">${t("verifyPassportHelp")}</p>
    <textarea id="vc" aria-label="Passport code">${esc(S.vc)}</textarea>
    <button class="p" onclick="chk()">${t("verifyBtn")}</button>
    ${S.vr ? (S.vr.ok ? `
      <p class="ok">✔ ${t("verifiedResult")}: ${esc(S.vr.name)}, ${S.vr.shifts} shifts, ${S.vr.hours}h at ${esc(S.vr.sector)}</p>
    ` : `
      <p class="bad">❌ ${t("notVerifiedResult")}: ${esc(S.vr.why)}</p>
    `) : ""}
  </div>

  <h2>${t("anonReportsTitle")}</h2>
  ${rg}`;
}

// User Actions
function inn() {
  D[S.org].open[S.wk] = { s: Date.now() };
  render();
  fx("Shift started");
}

function out() {
  const op = D[S.org].open[S.wk];
  if (!op) return;
  add(S.org, S.wk, op.s, op.s + S.len * HR);
  delete D[S.org].open[S.wk];
  render();
  fx("Shift saved to your ledger");
}

function tamper() {
  if (!D[S.org].sh || D[S.org].sh.length < 4) return;
  const r = D[S.org].sh[3];
  r.e += 2 * HR;
  render();
  fx("Record edited: chain broken", 0);
}

function sendRep() {
  const rx = $("#rx");
  if (!rx) return;
  const x = rx.value.trim();
  if (!x) return;

  const a = $("#ra").value;
  const ty = $("#rt").value;
  const k = a + "|" + ty;
  const workerHash = H(S.wk + "_anonymized_salt");

  D[S.org].rep.push({
    a,
    ty,
    x,
    by: workerHash,
    t: Date.now()
  });

  const myKey = `${S.org}_${S.wk}`;
  if (!S.mine[myKey]) S.mine[myKey] = [];
  if (!S.mine[myKey].includes(k)) S.mine[myKey].push(k);

  rx.value = "";
  render();
  fx("Report sent anonymously");
}

// Inline SVG Cryptographic Seal QR
function qr(c) {
  const n = 21;
  const fin = (x, y) => [[0, 0], [14, 0], [0, 14]].some(([a, b]) => {
    const u = x - a;
    const v = y - b;
    return u >= 0 && u < 7 && v >= 0 && v < 7 && (u % 6 === 0 || v % 6 === 0 || (u > 1 && u < 5 && v > 1 && v < 5));
  });

  let r = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inF = (x < 8 && y < 8) || (x > 13 && y < 8) || (x < 8 && y > 13);
      if (inF ? fin(x, y) : parseInt(H(c + x + "," + y).slice(-1), 16) & 1) {
        r += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
  }
  return `<svg viewBox="0 0 21 21" role="img" aria-label="Unique seal drawn from your passport code" fill="currentColor">${r}</svg>`;
}

function mkpp() {
  S.pp = encode(passport(D[S.org], ORG[S.org], S.wk, S.org));
  render();
  fx("Passport created");
}

function chk() {
  const vc = $("#vc");
  if (!vc) return;
  S.vc = vc.value;
  S.vr = checkPassport(S.vc, D, ORG);
  render();
  fx(S.vr.ok ? "Passport verified" : "Verification failed", S.vr.ok ? 1 : 0);
}

function stat(k, s) {
  D[S.org].st[k] = s;
  render();
}

// Safe microphone dictation appending to existing text
function mic() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return alert("Voice input not supported in this browser");
  const r = new SpeechRec();
  r.lang = SP[S.lang] || "en-IN";
  r.onresult = e => {
    const transcript = e.results[0][0].transcript;
    const rx = $("#rx");
    if (rx) {
      rx.value = rx.value ? rx.value + " " + transcript : transcript;
    }
  };
  r.start();
}

// Visual Particle Burst & Floating Toast Notifications
function fx(msg, isSuccess = 1) {
  if (isSuccess) {
    for (let k = 0; k < 18; k++) {
      const n = document.createElement("i");
      const a = Math.random() * 6.283;
      const d = 60 + Math.random() * 90;
      n.className = "bs";
      n.style.cssText = `left:${lastPointerX}px;top:${lastPointerY}px;--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d}px`;
      document.body.append(n);
      setTimeout(() => n.remove(), 950);
    }
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = msg;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 2400);
}

// Main DOM Render Function
function render() {
  document.body.dataset.org = S.org;
  document.documentElement.lang = S.lang;
  const renderKey = S.org + S.role + S.lang;
  const isEntering = renderKey !== lastRenderKey;
  lastRenderKey = renderKey;

  const app = $("#app");
  if (app) {
    app.innerHTML = hdr() + `<div class="v-${S.role}${isEntering ? " enter" : ""}">${S.role === "w" ? worker() : admin()}</div>`;
  }
  if (isEntering) enter();
}

// Animation controller on route/role change
function enter() {
  const q = selector => document.querySelectorAll(".enter " + selector);
  document.querySelectorAll(".enter > *").forEach((el, i) => {
    el.style.animationDelay = (i * 70) + "ms";
  });
  q(".heat i").forEach((el, i) => {
    el.style.animationDelay = (300 + i * 20) + "ms";
  });
  q(".blocks i").forEach((el, i) => {
    el.style.animationDelay = (300 + i * 12) + "ms";
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Staggered number rolling animation for KPI metrics
  q(".n").forEach(el => {
    const match = el.textContent.match(/^(\d+)(.*)$/);
    if (!match) return;
    const targetVal = +match[1];
    const unit = match[2];
    const startTime = performance.now();
    (function roll(now) {
      const progress = Math.min(1, (now - startTime) / 900);
      el.textContent = Math.round(targetVal * (1 - (1 - progress) ** 3)) + unit;
      if (progress < 1) requestAnimationFrame(roll);
    })(startTime);
  });
}

// Attach functions to global window for inline event triggers
Object.assign(window, {
  fx, mkpp, chk, S, render, speak, seed, inn, out, tamper, sendRep, stat, mic
});

// Initialize all 4 sectors
seed("con");
seed("col");
seed("hos");
seed("fac");
render();

// Live Shift Wage Ticker
setInterval(() => {
  if (S.role !== "w") return;
  const op = D[S.org] && D[S.org].open && D[S.org].open[S.wk];
  const el = $("#live");
  if (!op || !el) return;
  const g = ORG[S.org];
  const elapsedHours = (Date.now() - op.s) * 360 / HR;
  const regHours = Math.min(elapsedHours, g.cap);
  const otHours = Math.max(0, elapsedHours - g.cap);
  const totalEarned = Math.round(g.ppl[S.wk][1] * (regHours + otHours * g.mult));

  el.textContent = "₹" + totalEarned.toLocaleString();

  const lh = $("#lh");
  if (lh) lh.textContent = elapsedHours.toFixed(1) + "h (demo speed ×360)";

  const lv = $("#lv");
  if (lv) lv.classList.toggle("ot", elapsedHours > g.cap);
}, 100);

// Hero CTA buttons binding
document.querySelectorAll(".pick button").forEach(btn => {
  btn.onclick = () => {
    S.role = btn.dataset.role;
    render();
    const mainEl = document.querySelector("main");
    if (mainEl) mainEl.scrollIntoView({ behavior: "smooth" });
  };
});
