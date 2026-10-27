import {
  ORG, TYPES, HR, H,
  seed as seedOrg, add as addRec, verify as ver, verifyWorker as verW,
  calc as cal, flags as fl, groups as grp,
  passport as genPassport, encode as encodePassport, checkPassport, heat
} from "./core.js";

// Comprehensive Trilingual Dictionary
const T = {
  en: {
    heroBadge: "Welcome to a new era · FairShift Protocol",
    heroTitle: "Technology that redefines fair labor & interaction",
    heroSub: "Decent work intelligence platform powered by tamper-evident cryptographic ledgers, automated payslips, anonymous hazard dispatch, and fatigue risk intelligence.",
    roleWorker: "Worker Portal",
    roleAdmin: "Admin Radar",
    tabAttendance: "Attendance Terminal",
    tabPayslip: "Cryptographic Payslip",
    tabLedger: "Attendance Ledger",
    tabReports: "Hazard Reports",
    tabSkills: "Skill Passport",
    ci: "Check In (QR)",
    co: "Check Out",
    scanQR: "Scan Site QR",
    inProgress: "Shift in Progress",
    offDuty: "Off Duty · Ready to Check In",
    elapsed: "Active Elapsed Time",
    demoShiftLen: "Simulated Shift Duration",
    simScan: "Scan Gate Badge",
    scanSubtitle: "Align holographic scanner frame over site terminal",
    scanning: "Scanning QR Matrix...",
    scanSuccess: "QR Token Verified · Attendance Recorded",
    close: "Close",
    pay: "Cryptographic Payslip",
    hrs: "Regular Hours",
    ot: "Overtime Hours",
    tot: "Total Gross Payout",
    rate: "Base Rate",
    say: "Read Aloud (TTS)",
    playing: "Speaking...",
    tamperAlert: "Ledger Alert: Calculation includes altered or unverified hours!",
    chainTitle: "Cryptographic Attendance Chain",
    verifiedChain: "Hash Chain Intact · All Records Cryptographically Verified",
    alteredChain: "Hash Mismatch Detected · Compromised at Record #",
    repTitle: "Anonymous Hazard Dispatch",
    repSubtitle: "Protected by k-anonymity protocol. Details revealed only when ≥2 distinct workers report.",
    area: "Location / Zone",
    type: "Category",
    descPlaceholder: "Describe the hazard or safety concern… / tap 🎤 to dictate",
    voiceInput: "Voice Dictation",
    listening: "Listening… Speak now",
    send: "Send Encrypted Report",
    myReports: "My Submitted Reports",
    statusReceived: "Received",
    statusProgress: "In Progress",
    statusResolved: "Resolved",
    skillPassport: "Portable Skill Passport",
    skillSubtitle: "Cryptographically verified record of training, experience, and safety accreditations.",
    verifiedSkill: "Verified Credential",
    createPassport: "Export Work Passport",
    passportHelp: "A tamper-proof credential code proving your verified hours and skills. Share it with any new employer across any sector.",
    copyCode: "Copy Credential Code",
    kpiWorkers: "Active Workforce",
    kpiHours: "7-Day Verified Hours",
    kpiOt: "7-Day Overtime",
    kpiHazards: "Pending Hazards",
    kpiIntegrity: "Chain Integrity",
    integrityOk: "100% Verified",
    integrityBad: "Compromised",
    adminLedger: "Cryptographic Audit Ledger",
    tamperBtn: "⚡ Simulate Tamper Attack",
    restoreBtn: "🔄 Restore Ledger Integrity",
    resetBtn: "↺ Reset Demo",
    fatigueTitle: "Fatigue & Quit-Risk Intelligence",
    heatmapTitle: "Seven-Day Fatigue Heatmap",
    heatmapSubtitle: "Daily hours breakdown. Outlined red cells indicate shifts exceeding the daily sector cap.",
    colWorker: "Worker",
    colHours: "Hours",
    colOt: "OT",
    colStreak: "Consecutive Streak",
    colFlags: "Fatigue Flags",
    colRisk: "Quit Risk",
    riskLow: "Low",
    riskMed: "Medium",
    riskHigh: "Critical",
    verifyPassportTitle: "Verify Applicant Work Passport",
    verifyPassportSubtitle: "Hiring a new worker? Paste their portable credential code below to verify their work history against the issuing sector's ledger.",
    verifyBtn: "Verify Credential",
    adminIncidents: "Anonymous Incident Investigation Center",
    sealedTitle: "Cryptographically Sealed Incident",
    sealedDesc: "report registered. Awaiting independent worker confirmation to protect reporter identity.",
    unlockedReports: "reports confirmed by distinct workers",
    ruleDesc: "Sector Policy",
    currencyWord: "rupees",
    hello: "Hello",
    allTime: "Cumulative (All Time)",
    blockInfo: "Block Verification Info"
  },
  ta: {
    heroBadge: "புதிய யுகத்திற்கு நல்வரவு · FairShift நெறிமுறை",
    heroTitle: "நியாயமான உழைப்பு மற்றும் பாதுகாப்பை மறுவரையறை செய்யும் தொழில்நுட்பம்",
    heroSub: "கிரிப்டோகிராஃபிக் வருகைப் பதிவு, தானியங்கி சம்பளச் சீட்டு, பெயர் குறிப்பிடாத புகார் மற்றும் சோர்வு அபாய நுண்ணறிவு.",
    roleWorker: "தொழிலாளர் தளம்",
    roleAdmin: "நிர்வாகக் குழு",
    tabAttendance: "வருகை முனையம்",
    tabPayslip: "கிரிப்டோகிராஃபிக் சம்பளச் சீட்டு",
    tabLedger: "வருகைப் பதிவேடு",
    tabReports: "பாதுகாப்புப் புகார்கள்",
    tabSkills: "திறன் பாஸ்போர்ட்",
    ci: "வருகை பதிவு (QR)",
    co: "வெளியேறு",
    scanQR: "QR ஸ்கேன் செய்",
    inProgress: "பணியில் உள்ளார்",
    offDuty: "பணியில் இல்லை · பதிவு செய்யத் தயார்",
    elapsed: "பணியாற்றிய நேரம்",
    demoShiftLen: "மாதிரி பணி நேரம்",
    simScan: "வாயில் பேட்ஜை ஸ்கேன் செய்",
    scanSubtitle: "ஸ்கேனர் சட்டத்தை தள முனையத்தில் காட்டவும்",
    scanning: "QR குறியீடு ஸ்கேன் செய்யப்படுகிறது...",
    scanSuccess: "QR சரிபார்க்கப்பட்டது · வருகை பதிவானது",
    close: "மூடு",
    pay: "கிரிப்டோகிராஃபிக் சம்பளச் சீட்டு",
    hrs: "சாதாரண மணிநேரம்",
    ot: "கூடுதல் நேரம்",
    tot: "மொத்த சம்பளம்",
    rate: "அடிப்படை விகிதம்",
    say: "படித்துக் காட்டு",
    playing: "பேசுகிறது...",
    tamperAlert: "பதிவேடு மாற்றப்பட்டுள்ளது! சம்பளக் கணக்கில் சரிபார்க்கப்படாத மணிநேரம் உள்ளது.",
    chainTitle: "கிரிப்டோகிராஃபிக் வருகைச் சங்கிலி",
    verifiedChain: "ஹேஷ் சங்கிலி பாதுகாப்பானது · அனைத்துப் பதிவுகளும் சரிபார்க்கப்பட்டன",
    alteredChain: "ஹேஷ் பொருந்தவில்லை · பதிவு எண் #",
    repTitle: "பெயரற்ற பாதுகாப்புப் புகார்",
    repSubtitle: "k-அநாமதேய நெறிமுறை மூலம் பாதுகாக்கப்படுகிறது. ≥2 தொழிலாளர்கள் உறுதிசெய்த பின்னரே விவரங்கள் தெரியும்.",
    area: "இடம் / பகுதி",
    type: "வகை",
    descPlaceholder: "பாதுகாப்புப் பிரச்சனை அல்லது அபாயத்தை விவரிக்கவும்… / பேச 🎤 அழுத்தவும்",
    voiceInput: "குரல் பதிவு",
    listening: "கேட்கிறது… இப்போது பேசுங்கள்",
    send: "குறியாக்கப்பட்ட புகாரை அனுப்பு",
    myReports: "நான் அனுப்பிய புகார்கள்",
    statusReceived: "பெறப்பட்டது",
    statusProgress: "செயலில் உள்ளது",
    statusResolved: "தீர்க்கப்பட்டது",
    skillPassport: "டிஜிட்டல் திறன் பாஸ்போர்ட்",
    skillSubtitle: "சரிபார்க்கப்பட்ட தொழில் திறன், பாதுகாப்புப் பயிற்சி மற்றும் அனுபவச் சான்று.",
    verifiedSkill: "சரிபார்க்கப்பட்ட சான்றிதழ்",
    createPassport: "பணி பாஸ்போர்ட்டை உருவாக்கு",
    passportHelp: "உங்கள் பணி அனுபவத்தை உறுதிப்படுத்தும் குறியீடு. எந்த ஒரு புதிய முதலாளியிடமும் இதைப் பகிரலாம்.",
    copyCode: "சான்றிதழ் குறியீட்டை நகலெடு",
    kpiWorkers: "தொழிலாளர்கள்",
    kpiHours: "பணி நேரம் (7 நாட்கள்)",
    kpiOt: "கூடுதல் நேரம் (7 நாட்கள்)",
    kpiHazards: "செயலில் உள்ள புகார்கள்",
    kpiIntegrity: "பதிவேட்டுப் பாதுகாப்பு",
    integrityOk: "100% பாதுகாப்பானது",
    integrityBad: "மாற்றப்பட்டது",
    adminLedger: "கிரிப்டோகிராஃபிக் தணிக்கைப் பதிவேடு",
    tamperBtn: "⚡ போலி மாற்றத்தை சோதிக்கவும்",
    restoreBtn: "🔄 பதிவேட்டைச் சரிசெய்",
    resetBtn: "↺ மீட்டமை",
    fatigueTitle: "சோர்வு & விலகல் அபாய நுண்ணறிவு",
    heatmapTitle: "7-நாள் சோர்வு வரைபடம் (Heatmap)",
    heatmapSubtitle: "தினசரி பணி மணிநேரம். சிவப்பு கட்டங்கள் தினசரி உச்சவரம்பைத் தாண்டியதைக் குறிக்கின்றன.",
    colWorker: "தொழிலாளி",
    colHours: "மணிநேரம்",
    colOt: "கூடுதல்",
    colStreak: "தொடர் நாட்கள்",
    colFlags: "சோர்வு எச்சரிக்கைகள்",
    colRisk: "விலகல் அபாயம்",
    riskLow: "குறைவு",
    riskMed: "நடுத்தரம்",
    riskHigh: "அபாயகரமானது",
    verifyPassportTitle: "தொழிலாளர் பாஸ்போர்ட்டைச் சரிபார்",
    verifyPassportSubtitle: "புதிய தொழிலாளரின் சான்றிதழ் குறியீட்டை உள்ளிட்டு முந்தைய நிறுவனப் பதிவேட்டுடன் சரிபார்க்கவும்.",
    verifyBtn: "சரிபார்",
    adminIncidents: "பெயரற்ற விபத்து விசாரணை மையம்",
    sealedTitle: "குறியாக்கம் செய்யப்பட்ட புகார்",
    sealedDesc: "புகார் பெறப்பட்டது. தொழிலாளரின் பாதுகாப்பிற்காக அடுத்த உறுதிப்படுத்தல் வரை விவரங்கள் பூட்டப்பட்டுள்ளன.",
    unlockedReports: "வெவ்வேறு தொழிலாளர்களின் உறுதிப்படுத்தப்பட்ட புகார்கள்",
    ruleDesc: "துறை விதிமுறை",
    currencyWord: "ரூபாய்",
    hello: "வணக்கம்",
    allTime: "மொத்த காலம்",
    blockInfo: "தொகுதி விவரம்"
  },
  hi: {
    heroBadge: "नए युग में आपका स्वागत है · FairShift प्रोटोकॉल",
    heroTitle: "उचित श्रम और सुरक्षा को पुनर्परिभाषित करने वाली तकनीक",
    heroSub: "क्रिप्टोग्राफ़िक हाजिरी लेज़र, स्वचालित वेतन पर्ची, गुमनाम खतरा रिपोर्टिंग और थकान जोखिम विश्लेषण।",
    roleWorker: "श्रमिक पोर्टल",
    roleAdmin: "प्रबंधन रडार",
    tabAttendance: "हाजिरी टर्मिनल",
    tabPayslip: "क्रिप्टोग्राफ़िक वेतन पर्ची",
    tabLedger: "हाजिरी लेज़र",
    tabReports: "सुरक्षा रिपोर्ट",
    tabSkills: "कौशल पासपोर्ट",
    ci: "हाजिरी लगाएँ (QR)",
    co: "बाहर निकलें",
    scanQR: "QR स्कैन करें",
    inProgress: "शिफ्ट जारी है",
    offDuty: "ड्यूटी समाप्त · हाजिरी लगाने हेतु तैयार",
    elapsed: "सक्रिय कार्य समय",
    demoShiftLen: "सिम्युलेटेड शिफ्ट अवधि",
    simScan: "साइट QR कोड स्कैन करें",
    scanSubtitle: "स्कैनर फ्रेम को साइट टर्मिनल पर रखें",
    scanning: "QR मैट्रिक्स स्कैन हो रहा है...",
    scanSuccess: "QR सत्यापित · हाजिरी दर्ज हुई",
    close: "बंद करें",
    pay: "क्रिप्टोग्राफ़िक वेतन पर्ची",
    hrs: "सामान्य घंटे",
    ot: "ओवरटाइम घंटे",
    tot: "कुल देय वेतन",
    rate: "आधार दर",
    say: "सुनें (TTS)",
    playing: "बोल रहा है...",
    tamperAlert: "लेज़र में छेड़छाड़ हुई है! वेतन गणना में असत्यापित घंटे शामिल हैं।",
    chainTitle: "क्रिप्टोग्राफ़िक हाजिरी शृंखला",
    verifiedChain: "हैश शृंखला अक्षुण्ण · सभी रिकॉर्ड सत्यापित",
    alteredChain: "हैश बेमेल · रिकॉर्ड #",
    repTitle: "गुमनाम सुरक्षा रिपोर्टिंग",
    repSubtitle: "k-अनामिकता प्रोटोकॉल द्वारा सुरक्षित। जब ≥2 विभिन्न श्रमिक रिपोर्ट करेंगे तभी विवरण दिखेगा।",
    area: "स्थान / क्षेत्र",
    type: "श्रेणी",
    descPlaceholder: "खतरे या सुरक्षा समस्या का वर्णन करें… / बोलने के लिए 🎤 दबाएँ",
    voiceInput: "ध्वनि इनपुट",
    listening: "सुन रहा हूँ… अब बोलें",
    send: "एन्क्रिप्टेड रिपोर्ट भेजें",
    myReports: "मेरी दर्ज रिपोर्ट",
    statusReceived: "प्राप्त हुई",
    statusProgress: "प्रगति पर",
    statusResolved: "समाधान हुआ",
    skillPassport: "पोर्टेबल कौशल पासपोर्ट",
    skillSubtitle: "सत्यापित प्रशिक्षण, सुरक्षा प्रमाणन और कार्य अनुभव का डिजिटल प्रमाण।",
    verifiedSkill: "सत्यापित कौशल",
    createPassport: "वर्क पासपोर्ट तैयार करें",
    passportHelp: "आपके सत्यापित कार्य अनुभव का प्रमाण कोड। किसी भी नए नियोक्ता के साथ साझा करें।",
    copyCode: "कोड कॉपी करें",
    kpiWorkers: "सक्रिय श्रमिक",
    kpiHours: "कार्य घंटे (7 दिन)",
    kpiOt: "ओवरटाइम (7 दिन)",
    kpiHazards: "लंबित खतरे",
    kpiIntegrity: "लेज़र सुरक्षा",
    integrityOk: "100% सत्यापित",
    integrityBad: "छेड़छाड़ युक्त",
    adminLedger: "क्रिप्टोग्राफ़िक ऑडिट लेज़र",
    tamperBtn: "⚡ छेड़छाड़ का परीक्षण करें",
    restoreBtn: "🔄 लेज़र पुनः स्थापित करें",
    resetBtn: "↺ रीसेट करें",
    fatigueTitle: "थकान व छोड़ने के जोखिम का विश्लेषण",
    heatmapTitle: "सात-दिवसीय थकान हीटमैप",
    heatmapSubtitle: "दैनिक कार्य घंटे। लाल बॉर्डर वाले बॉक्स दैनिक कैप से अधिक काम दर्शाते हैं।",
    colWorker: "श्रमिक",
    colHours: "घंटे",
    colOt: "ओवरटाइम",
    colStreak: "लगातार दिन",
    colFlags: "थकान चेतावनी",
    colRisk: "जोखिम स्तर",
    riskLow: "कम",
    riskMed: "मध्यम",
    riskHigh: "गंभीर",
    verifyPassportTitle: "कार्य पासपोर्ट सत्यापित करें",
    verifyPassportSubtitle: "नए उम्मीदवार का पासपोर्ट कोड दर्ज कर जारीकर्ता लेज़र से तुरंत पुष्टि करें।",
    verifyBtn: "पुष्टि करें",
    adminIncidents: "गुमनाम शिकायत अन्वेषण केंद्र",
    sealedTitle: "एन्क्रिप्टेड सुरक्षित शिकायत",
    sealedDesc: "शिकायत दर्ज। पहचान की रक्षा हेतु दूसरे श्रमिक की पुष्टि की प्रतीक्षा है।",
    unlockedReports: "विभिन्न श्रमिकों की सत्यापित रिपोर्ट",
    ruleDesc: "क्षेत्रीय नीति",
    currencyWord: "रुपये",
    hello: "नमस्ते",
    allTime: "कुल समय",
    blockInfo: "ब्लॉक सत्यापन विवरण"
  }
};

const SP = { en: "en-IN", ta: "ta-IN", hi: "hi-IN" };
const S = {
  org: "con",
  role: "w",
  lang: "en",
  wk: 0,
  len: 8,
  myReports: {},
  showQRModal: false,
  isListening: false,
  isSpeaking: false,
  tamperedBackup: null,
  activeBlockInspect: null,
  passportCode: "",
  verifyCode: "",
  verifyResult: null
};

const D = {};
const t = k => (T[S.lang] && T[S.lang][k]) || T.en[k] || k;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Seed wrapper & helpers
const seed = o => { D[o] = seedOrg(ORG[o]); };
const add = (o, ...a) => addRec(D[o], ...a);
const verify = o => ver(D[o]);
const verifyWorker = (o, w) => verW(D[o], w);
const calc = (o, w, since = 0) => cal(D[o], ORG[o], w, since);
const flags = (o, w) => fl(D[o], w, ORG[o]);
const groups = o => grp(D[o]);
const fmt = ms => new Date(ms).toLocaleString([], { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

// Sound effect synthesizer (Web Audio API)
function playTone(freq = 600, type = "sine", duration = 0.12) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// Localized Speech Synthesis
function speakPayslip(txt) {
  try {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = SP[S.lang] || "en-IN";
    u.rate = 0.95;
    S.isSpeaking = true;
    render();
    u.onend = () => { S.isSpeaking = false; render(); };
    u.onerror = () => { S.isSpeaking = false; render(); };
    speechSynthesis.speak(u);
  } catch (e) {
    S.isSpeaking = false;
  }
}

// Inline SVG QR Seal Generator
function generateQRSeal(code) {
  const n = 21;
  const isCorner = (x, y) =>
    (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
  let rects = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (isCorner(x, y)) {
        const isBorder = (x === 0 || x === 6 || y === 0 || y === 6 || x === 14 || x === 20 || y === 14 || y === 20);
        const isCore = (x >= 2 && x <= 4 && y >= 2 && y <= 4) || (x >= 16 && x <= 18 && y >= 2 && y <= 4) || (x >= 2 && x <= 4 && y >= 16 && y <= 18);
        if (isBorder || isCore) {
          rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="#38bdf8"/>`;
        }
      } else {
        const hashVal = parseInt(H(code + x + "," + y).slice(-1), 16);
        if (hashVal % 2 === 0) {
          rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="#8b5cf6"/>`;
        }
      }
    }
  }
  return `<svg class="passport-qr" viewBox="0 0 21 21" role="img" aria-label="Cryptographic Passport Seal">${rects}</svg>`;
}

// Header & Navigation Bar
function hdr() {
  return `
  <header>
    <div class="brand">
      <div class="logo-badge" aria-hidden="true">⚖</div>
      <div class="brand-text">
        <h1>FairShift <span class="brand-tag">SDG 8</span></h1>
      </div>
    </div>
    <div class="nav-controls">
      <select aria-label="Sector Selector" onchange="changeSector(this.value)">
        ${Object.entries(ORG).map(([k, v]) => `<option value="${k}" ${S.org === k ? "selected" : ""}>${esc(v.n)}</option>`).join("")}
      </select>
      <select aria-label="Language Selector" onchange="S.lang=this.value;render()">
        <option value="en" ${S.lang === "en" ? "selected" : ""}>English</option>
        <option value="ta" ${S.lang === "ta" ? "selected" : ""}>தமிழ்</option>
        <option value="hi" ${S.lang === "hi" ? "selected" : ""}>हिन्दी</option>
      </select>
      <div class="role-toggle">
        <button class="role-btn ${S.role === "w" ? "active" : ""}" onclick="S.role='w';render()">${t("roleWorker")}</button>
        <button class="role-btn ${S.role === "a" ? "active" : ""}" onclick="S.role='a';render()">${t("roleAdmin")}</button>
      </div>
    </div>
  </header>`;
}

// Hero Section
function hero() {
  return `
  <section class="hero-ref">
    <div class="hero-pill">
      <span class="hero-pill-sparkle">✦</span>
      <span>${t("heroBadge")}</span>
    </div>
    <h2 class="hero-title">${t("heroTitle")}</h2>
    <p class="hero-sub">${t("heroSub")}</p>
    <div class="hero-actions">
      <button class="btn-pill-primary" onclick="${S.role === 'w' ? 'triggerQRModal()' : 'S.role=\'w\';render()'}">
        <span>⚡</span> ${S.role === 'w' ? t("scanQR") : t("roleWorker")}
      </button>
      <button class="btn-pill-secondary" onclick="${S.role === 'a' ? 'scrollToElement(\'#audit-anchor\')' : 'S.role=\'a\';render()'}">
        <span>🛡</span> ${t("roleAdmin")}
      </button>
    </div>
  </section>`;
}

window.changeSector = function (newOrg) {
  S.org = newOrg;
  if (S.wk >= ORG[newOrg].ppl.length) S.wk = 0;
  S.passportCode = "";
  S.verifyResult = null;
  render();
};

// Worker Interface
function worker() {
  const o = S.org, g = ORG[o], w = S.wk;
  const op = D[o].open[w];
  const c = calc(o, w);
  const ledgerStatus = verifyWorker(o, w);
  const generalBad = verify(o);

  const currencyWord = t("currencyWord");
  const sayText = `${t("hello")} ${g.ppl[w][0]}. ${t("hrs")}: ${c.reg}. ${t("ot")}: ${c.ot}. ${t("tot")}: ${c.pay} ${currencyWord}.`;

  const myKey = `${o}_${w}`;
  const workerReportKeys = S.myReports[myKey] || [];
  const allGroups = groups(o);
  const myReportsHtml = workerReportKeys.map(k => {
    const gr = allGroups.find(x => x[0] === k);
    if (!gr) return "";
    const st = D[o].st[k] || t("statusReceived");
    return `<li style="display:flex;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:10px;margin-bottom:6px;font-size:13px;">
      <span><b>${esc(gr[1].a)}</b> · ${esc(gr[1].ty)}</span>
      <span class="pill ok">${esc(st)}</span>
    </li>`;
  }).join("");

  const skills = (g.ppl[w] && g.ppl[w][2]) || ["General Operations & Site Safety", "First Aid Responder"];
  const skillsHtml = skills.map(sk => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.06);margin-bottom:8px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:16px;">🎓</span>
        <div>
          <div style="font-weight:700;color:#fff;font-size:13.5px;">${esc(sk)}</div>
          <div style="font-size:11.5px;color:var(--tx-muted);">${c.reg + c.ot}h verified site experience</div>
        </div>
      </div>
      <span class="pill ok" style="font-size:11px;">${t("verifiedSkill")}</span>
    </div>
  `).join("");

  const workerShifts = D[o].sh.filter(r => r.w === w);
  const chainHtml = workerShifts.slice(-5).reverse().map(r => {
    const isAltered = generalBad >= 0 && D[o].sh[generalBad] === r;
    const durH = ((r.e - r.s) / HR).toFixed(1);
    return `
    <li class="chain-item ${isAltered ? 'tampered' : ''}">
      <div class="chain-item-meta">
        <span class="chain-item-date">${fmt(r.s)} → ${durH}h</span>
        <span class="chain-hash-pill">#${r.hash.slice(0, 10)} · prev: #${r.prev.slice(0, 6)}</span>
      </div>
      <div>
        ${isAltered ? `<span class="pill bad">⚠ Tampered</span>` : `<span class="pill ok">✔ Verified</span>`}
      </div>
    </li>`;
  }).join("");

  let elapsedFormatted = "00h 00m 00s";
  let liveWage = 0;
  if (op) {
    const diff = Math.max(0, Date.now() - op.s);
    const hrs = Math.floor(diff / 36e5).toString().padStart(2, "0");
    const mins = Math.floor((diff % 36e5) / 6e4).toString().padStart(2, "0");
    const secs = Math.floor((diff % 6e4) / 1e3).toString().padStart(2, "0");
    elapsedFormatted = `${hrs}h ${mins}m ${secs}s`;
    const liveHours = diff / HR;
    const liveReg = Math.min(liveHours, g.cap);
    const liveOT = Math.max(0, liveHours - g.cap);
    liveWage = Math.round(g.ppl[w][1] * (liveReg + liveOT * g.mult));
  }

  return `
  <div class="worker-layout">
    <!-- Worker Profile Bar -->
    <div class="profile-bar">
      <div class="profile-select-wrapper">
        <div class="avatar-badge">${g.ppl[w][0][0]}</div>
        <select aria-label="Select Worker" onchange="S.wk=+this.value;S.passportCode='';render()">
          ${g.ppl.map((p, i) => `<option value="${i}" ${w === i ? "selected" : ""}>${p[0]} (₹${p[1]}/h)</option>`).join("")}
        </select>
      </div>
      <div>
        <span class="pill ${ledgerStatus.intact ? 'ok' : (ledgerStatus.ownAltered ? 'bad' : 'wa')}">
          ${ledgerStatus.intact ? '✔ ' + t("verifiedChain") : (ledgerStatus.ownAltered ? '⚠ ' + t("alteredChain") + (ledgerStatus.badIndex + 1) : 'ℹ Chain Alert')}
        </span>
      </div>
    </div>

    <!-- Attendance Action Terminal Card -->
    <div class="card terminal-card">
      <div>
        <span class="status-dot ${op ? 'active' : 'idle'}"></span>
        <span style="font-size:13px;font-weight:600;color:${op ? 'var(--neon-green)' : 'var(--tx-dim)'}">
          ${op ? t("inProgress") + ' · ' + fmt(op.s) : t("offDuty")}
        </span>
      </div>

      ${op ? `
        <div class="elapsed-timer">${elapsedFormatted}</div>
        <div style="font-size:20px;font-weight:700;color:var(--neon-cyan);margin-bottom:6px;">Live Earned: ₹${liveWage}</div>
        <p class="shift-info-sub">${t("elapsed")} · ${g.n}</p>
        <div class="action-orb-wrapper">
          <button class="action-orb checkout-mode" onclick="out()">
            <span class="orb-icon">⏹</span>
            <span>${t("co")}</span>
          </button>
        </div>
        <div class="sim-shift-row">
          <span>${t("demoShiftLen")}:</span>
          <select aria-label="Simulated Shift Length" onchange="S.len=+this.value">
            ${[4, 8, 9, 10, 12, 13].map(h => `<option value="${h}" ${S.len === h ? "selected" : ""}>${h}h</option>`).join("")}
          </select>
        </div>
      ` : `
        <div class="action-orb-wrapper" style="margin-top:24px;">
          <button class="action-orb" onclick="triggerQRModal()">
            <span class="orb-icon">▶</span>
            <span>${t("ci")}</span>
          </button>
        </div>
        <p class="shift-info-sub" style="margin-top:12px;">${t("scanSubtitle")}</p>
      `}
    </div>

    <!-- Cryptographic Payslip Card -->
    <div class="card receipt-card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">🧾</span>
          ${t("pay")}
        </h3>
        <span class="pill cyan">${g.n}</span>
      </div>

      ${generalBad >= 0 ? `
        <div class="tamper-warning-banner">
          <span>⚠</span>
          <span>${t("tamperAlert")}</span>
        </div>
      ` : ""}

      <table class="receipt-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:right;">Calculation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${t("hrs")}</td>
            <td>${c.reg}h × ₹${c.rate} = ₹${c.reg * c.rate}</td>
          </tr>
          <tr>
            <td>${t("ot")} (${g.mult}× OT)</td>
            <td>${c.ot}h × ₹${c.rate * g.mult} = ₹${Math.round(c.ot * c.rate * g.mult)}</td>
          </tr>
          <tr class="total-row">
            <th>${t("tot")}</th>
            <th>₹${c.pay.toLocaleString()}</th>
          </tr>
        </tbody>
      </table>

      <button class="audio-btn" onclick="speakPayslip(${esc(JSON.stringify(sayText))})">
        ${S.isSpeaking ? `
          <div class="equalizer-wave">
            <span class="equalizer-bar"></span>
            <span class="equalizer-bar"></span>
            <span class="equalizer-bar"></span>
            <span class="equalizer-bar"></span>
          </div>
          <span>${t("playing")}</span>
        ` : `
          <span>🔊</span>
          <span>${t("say")}</span>
        `}
      </button>
    </div>

    <!-- Skill Passport & Work Credential Exporter -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">📜</span>
          ${t("skillPassport")}
        </h3>
        <span class="pill cyan">ID: #${H(g.ppl[w][0]).slice(0, 8)}</span>
      </div>
      <p style="font-size:12.5px;color:var(--tx-dim);margin-bottom:14px;line-height:1.5;">
        ${t("skillSubtitle")}
      </p>
      <div>${skillsHtml}</div>

      <div style="margin-top:16px;">
        <button class="btn-pill-secondary" onclick="exportWorkerPassport()" style="width:100%;justify-content:center;">
          <span>📦</span> ${t("createPassport")}
        </button>
      </div>

      ${S.passportCode ? `
        <div class="passport-container">
          ${generateQRSeal(S.passportCode)}
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--neon-cyan);margin-bottom:4px;">✦ Portable Work Passport Code</div>
            <textarea class="passport-code-area" readonly>${S.passportCode}</textarea>
            <p style="font-size:11px;color:var(--tx-muted);margin-top:4px;">${t("passportHelp")}</p>
          </div>
        </div>
      ` : ""}
    </div>

    <!-- Cryptographic Attendance Chain -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">🔗</span>
          ${t("chainTitle")}
        </h3>
      </div>
      <ul class="chain-timeline">
        ${chainHtml || `<li style="font-size:13px;color:var(--tx-muted);">${t("offDuty")}</li>`}
      </ul>
    </div>

    <!-- Anonymous Hazard Dispatch Card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">📣</span>
          ${t("repTitle")}
        </h3>
      </div>
      <div class="privacy-notice">
        <span>🛡</span>
        <span>${t("repSubtitle")}</span>
      </div>
      <form class="hazard-form" onsubmit="event.preventDefault();sendRep();" style="margin-top:14px;">
        <div class="form-row">
          <div style="flex:1;min-width:140px;">
            <label style="font-size:12px;color:var(--tx-dim);display:block;margin-bottom:4px;">${t("area")}</label>
            <select id="ra" aria-label="Hazard Area">
              ${g.areas.map(a => `<option>${esc(a)}</option>`).join("")}
            </select>
          </div>
          <div style="flex:1;min-width:140px;">
            <label style="font-size:12px;color:var(--tx-dim);display:block;margin-bottom:4px;">${t("type")}</label>
            <select id="rt" aria-label="Hazard Type">
              ${TYPES.map(ty => `<option>${esc(ty)}</option>`).join("")}
            </select>
          </div>
        </div>
        <textarea id="rx" placeholder="${t("descPlaceholder")}"></textarea>
        <div class="dictation-row">
          <button type="button" class="mic-btn ${S.isListening ? 'listening' : ''}" onclick="toggleMic()">
            <span>🎤</span>
            <span>${S.isListening ? t("listening") : t("voiceInput")}</span>
          </button>
          <button type="submit" class="btn-pill-primary">${t("send")}</button>
        </div>
      </form>

      ${myReportsHtml ? `
        <div style="margin-top:20px;">
          <h4 style="font-size:13px;font-weight:700;color:var(--tx-dim);margin-bottom:8px;text-transform:uppercase;">${t("myReports")}</h4>
          <ul style="list-style:none;">${myReportsHtml}</ul>
        </div>
      ` : ""}
    </div>
  </div>`;
}

// Admin Interface
function admin() {
  const o = S.org, g = ORG[o];
  const bad = verify(o);
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * HR;

  let total7dHours = 0;
  let total7dOT = 0;

  const rows = g.ppl.map((p, i) => {
    const c = calc(o, i, sevenDaysAgo);
    const f = flags(o, i);
    total7dHours += c.reg + c.ot;
    total7dOT += c.ot;

    const riskLevel = f.length >= 2 ? ["Critical", "bad"] : f.length === 1 ? ["Medium", "wa"] : ["Low", "ok"];
    const weeklyCap = g.cap * (g.maxStreak || 6);
    const workloadPct = Math.min(100, Math.round(((c.reg + c.ot) / weeklyCap) * 100));

    return `
    <tr>
      <td><b>${esc(p[0])}</b></td>
      <td>
        <div class="workload-bar-wrapper">
          <div class="workload-bar">
            <div class="workload-bar-fill" style="width:${workloadPct}%;"></div>
          </div>
          <span>${(c.reg + c.ot).toFixed(0)}h</span>
        </div>
      </td>
      <td>${c.ot.toFixed(0)}h</td>
      <td><span class="pill ${f.some(x => x.includes("days")) ? 'wa' : 'cyan'}">${f.find(x => x.includes("days")) || "–"}</span></td>
      <td>${f.filter(x => !x.includes("days")).join(", ") || "–"}</td>
      <td><span class="pill ${riskLevel[1]}">${riskLevel[0]}</span></td>
    </tr>`;
  }).join("");

  // 7-day fatigue heatmap generator
  const heatmapRows = g.ppl.map((p, i) => {
    const dailyHours = heat(D[o], i, now);
    const cells = dailyHours.map(h => {
      const isOverCap = h > g.cap;
      const intensity = Math.min(100, Math.round((h / 14) * 100));
      return `<div class="heat-cell ${isOverCap ? 'hi' : ''}" style="--p:${intensity}%;" title="${h.toFixed(1)}h logged">
        ${h > 0 ? h.toFixed(0) + 'h' : '–'}
      </div>`;
    }).join("");
    return `<div class="heat-label">${esc(p[0])}</div>${cells}`;
  }).join("");

  const threshold = 2;
  const gr = groups(o);
  const pendingCount = gr.filter(x => (D[o].st[x[0]] || "Received") !== "Resolved").length;

  const incidentCards = gr.map(([k, v]) => {
    const distinctCount = v.by ? v.by.size : v.x.length;
    const isUnlocked = distinctCount >= threshold;
    const status = D[o].st[k] || "Received";

    if (!isUnlocked) {
      return `
      <div class="incident-card sealed">
        <div class="incident-header">
          <span class="incident-location">🔒 ${esc(v.a)} · ${esc(v.ty)}</span>
          <span class="pill cyan">1 / ${threshold} confirmations</span>
        </div>
        <p style="font-size:13px;color:var(--tx-dim);line-height:1.5;">
          ${t("sealedTitle")}: 1 ${t("sealedDesc")}
        </p>
      </div>`;
    }

    return `
    <div class="incident-card hot">
      <div class="incident-header">
        <span class="incident-location">⚠ ${esc(v.a)} · ${esc(v.ty)}</span>
        <span class="pill bad">${distinctCount} ${t("unlockedReports")}</span>
      </div>
      <ul class="incident-list">
        ${v.x.map(item => `<li>"${esc(item)}"</li>`).join("")}
      </ul>
      <div class="status-button-group">
        ${["Received", "In Progress", "Resolved"].map(st => `
          <button class="status-btn ${status === st ? 'active' : ''}" onclick="setIncidentStatus('${esc(k)}', '${st}')">
            ${st}
          </button>
        `).join("")}
      </div>
    </div>`;
  }).join("");

  return `
  <div class="admin-layout" id="audit-anchor">
    <!-- Executive KPI Metrics Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">${t("kpiWorkers")}</div>
        <div class="kpi-value">${g.ppl.length}</div>
        <div class="kpi-sub">${esc(g.n)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("kpiHours")}</div>
        <div class="kpi-value">${total7dHours.toFixed(0)}h</div>
        <div class="kpi-sub">Verified ledger records</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("kpiOt")}</div>
        <div class="kpi-value" style="color:var(--neon-coral);">${total7dOT.toFixed(0)}h</div>
        <div class="kpi-sub">${g.mult}× sector rate</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("kpiHazards")}</div>
        <div class="kpi-value" style="color:var(--neon-amber);">${pendingCount}</div>
        <div class="kpi-sub">Active site clusters</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t("kpiIntegrity")}</div>
        <div class="kpi-value" style="color:${bad < 0 ? 'var(--neon-green)' : 'var(--neon-red)'}; font-size:24px;">
          ${bad < 0 ? t("integrityOk") : t("integrityBad")}
        </div>
        <div class="kpi-sub">${bad < 0 ? 'Hash chain valid' : 'Broken at block #' + (bad + 1)}</div>
      </div>
    </div>

    <!-- Cryptographic Audit Ledger Matrix Card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">🔗</span>
          ${t("adminLedger")}
        </h3>
        <span class="pill ${bad < 0 ? 'ok' : 'bad'}">
          ${bad < 0 ? `✔ ${D[o].sh.length} Blocks Verified` : `⚠ Altered at Block #${bad + 1}`}
        </span>
      </div>

      <p style="font-size:13px;color:var(--tx-dim);">
        Every block encapsulates previous hash, worker ID, start timestamp, and end timestamp. Any tampering breaks subsequent cryptographic hashes.
      </p>

      <div class="block-matrix" role="img" aria-label="Cryptographic Block Grid">
        ${D[o].sh.map((r, i) => `
          <div class="matrix-block ${bad >= 0 && i >= bad ? 'altered' : ''}"
               onclick="inspectBlock(${i})"
               title="Block #${i + 1}: ${g.ppl[r.w] ? g.ppl[r.w][0] : 'Worker ' + r.w}">
            ${i + 1}
          </div>
        `).join("")}
      </div>

      ${S.activeBlockInspect !== null && D[o].sh[S.activeBlockInspect] ? `
        <div style="background:rgba(255,255,255,0.04);border-radius:14px;padding:12px 16px;margin:12px 0;font-family:var(--font-mono);font-size:12px;border:1px solid rgba(255,255,255,0.08);">
          <div style="font-weight:700;color:var(--neon-cyan);margin-bottom:4px;">✦ Block #${S.activeBlockInspect + 1} Inspection</div>
          <div>Worker: <b>${g.ppl[D[o].sh[S.activeBlockInspect].w][0]}</b> | Shift: ${fmt(D[o].sh[S.activeBlockInspect].s)} → ${fmt(D[o].sh[S.activeBlockInspect].e)}</div>
          <div>Hash: <span style="color:#a78bfa;">#${D[o].sh[S.activeBlockInspect].hash}</span></div>
          <div>Prev: <span style="color:var(--tx-muted);">#${D[o].sh[S.activeBlockInspect].prev}</span></div>
        </div>
      ` : ""}

      <div class="matrix-controls">
        <button class="btn-demo danger" onclick="tamperRecord()">${t("tamperBtn")}</button>
        <button class="btn-demo" onclick="restoreLedger()">${t("restoreBtn")}</button>
        <button class="btn-demo" onclick="resetOrg()">${t("resetBtn")}</button>
      </div>
    </div>

    <!-- 7-Day Fatigue Heatmap Card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">📊</span>
          ${t("heatmapTitle")}
        </h3>
        <span class="pill cyan">Last 7 Calendar Days</span>
      </div>
      <p style="font-size:12.5px;color:var(--tx-dim);margin-bottom:12px;">${t("heatmapSubtitle")}</p>
      <div class="heat-grid">
        ${heatmapRows}
      </div>
    </div>

    <!-- Fatigue & Quit-Risk Intelligence Radar -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">😴</span>
          ${t("fatigueTitle")}
        </h3>
        <span class="pill cyan">${g.cap}h/day Cap · ${g.maxStreak || 6}d Max Streak</span>
      </div>

      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>${t("colWorker")}</th>
              <th>${t("colHours")} (7d)</th>
              <th>${t("colOt")}</th>
              <th>${t("colStreak")}</th>
              <th>${t("colFlags")}</th>
              <th>${t("colRisk")}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Work Passport Cross-Sector Verification Card -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">🛡</span>
          ${t("verifyPassportTitle")}
        </h3>
        <span class="pill cyan">Cross-Sector Trust Protocol</span>
      </div>
      <p style="font-size:12.5px;color:var(--tx-dim);margin-bottom:12px;">
        ${t("verifyPassportSubtitle")}
      </p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <textarea id="vc" placeholder="Paste Base64 Work Passport credential here..." style="font-family:var(--font-mono);font-size:12px;height:75px;">${esc(S.verifyCode)}</textarea>
        <div>
          <button class="btn-pill-primary" onclick="verifyApplicantPassport()">${t("verifyBtn")}</button>
        </div>
      </div>

      ${S.verifyResult ? `
        <div style="margin-top:14px;padding:12px 16px;border-radius:14px;background:${S.verifyResult.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};border:1px solid ${S.verifyResult.ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};">
          ${S.verifyResult.ok ? `
            <div style="font-weight:700;color:var(--neon-green);margin-bottom:4px;">✔ Credential Authenticated</div>
            <div style="font-size:13.5px;color:#fff;">Worker: <b>${esc(S.verifyResult.name)}</b> | Issuer: <b>${esc(S.verifyResult.sector)}</b></div>
            <div style="font-size:12.5px;color:var(--tx-dim);margin-top:2px;">Verified: <b>${S.verifyResult.shifts} shifts</b> (${S.verifyResult.hours} hours logged)</div>
            ${S.verifyResult.skills && S.verifyResult.skills.length ? `<div style="font-size:12px;color:var(--neon-cyan);margin-top:4px;">Skills: ${S.verifyResult.skills.map(esc).join(", ")}</div>` : ""}
          ` : `
            <div style="font-weight:700;color:var(--neon-red);margin-bottom:2px;">❌ Verification Failed</div>
            <div style="font-size:13px;color:#ff9b9b;">${esc(S.verifyResult.why)}</div>
          `}
        </div>
      ` : ""}
    </div>

    <!-- Anonymous Incident Investigation Center -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          <span class="card-title-icon">📣</span>
          ${t("adminIncidents")}
        </h3>
      </div>
      <div class="incident-grid">
        ${incidentCards || `<p style="font-size:13px;color:var(--tx-muted);">No reports logged.</p>`}
      </div>
    </div>
  </div>`;
}

// Modal Container for Interactive Futuristic Laser QR Scanner
function renderModal() {
  if (!S.showQRModal) return "";
  const o = S.org, g = ORG[o];
  return `
  <div class="modal-overlay" onclick="if(event.target===this)closeQRModal()">
    <div class="scanner-modal">
      <h3 style="font-size:18px;font-weight:700;color:#fff;">${t("scanQR")}</h3>
      <p style="font-size:13px;color:var(--tx-dim);margin-top:4px;">${t("scanSubtitle")}</p>

      <div class="scanner-viewport">
        <div class="scanner-laser"></div>
        <svg class="qr-code-graphic" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="25" height="25" rx="4" stroke="#38bdf8" stroke-width="4"/>
          <rect x="16" y="16" width="13" height="13" rx="2" fill="#38bdf8"/>
          <rect x="65" y="10" width="25" height="25" rx="4" stroke="#38bdf8" stroke-width="4"/>
          <rect x="71" y="16" width="13" height="13" rx="2" fill="#38bdf8"/>
          <rect x="10" y="65" width="25" height="25" rx="4" stroke="#38bdf8" stroke-width="4"/>
          <rect x="16" y="71" width="13" height="13" rx="2" fill="#38bdf8"/>
          <circle cx="50" cy="50" r="10" fill="#8b5cf6"/>
          <rect x="42" y="18" width="6" height="14" rx="2" fill="#38bdf8"/>
          <rect x="42" y="68" width="6" height="14" rx="2" fill="#38bdf8"/>
          <rect x="68" y="42" width="14" height="6" rx="2" fill="#f43f5e"/>
          <rect x="18" y="42" width="14" height="6" rx="2" fill="#f43f5e"/>
        </svg>
      </div>

      <div style="font-size:13px;font-weight:600;color:var(--neon-cyan);margin-bottom:16px;">
        ✦ Terminal: ${esc(g.n)} Gate A
      </div>

      <div class="scanner-btn-row">
        <button class="btn-pill-primary" onclick="simulateScanBadge()">${t("simScan")}</button>
        <button class="btn-pill-secondary" onclick="closeQRModal()">${t("close")}</button>
      </div>
    </div>
  </div>`;
}

// User Actions
window.triggerQRModal = () => { S.showQRModal = true; render(); };
window.closeQRModal = () => { S.showQRModal = false; render(); };

window.simulateScanBadge = () => {
  playTone(880, "triangle", 0.18);
  inn();
  closeQRModal();
};

window.inn = () => {
  D[S.org].open[S.wk] = { s: Date.now() };
  render();
};

window.out = () => {
  const op = D[S.org].open[S.wk];
  if (!op) return;
  playTone(440, "sine", 0.15);
  const end = op.s + S.len * HR;
  add(S.org, S.wk, op.s, end);
  delete D[S.org].open[S.wk];
  render();
};

window.exportWorkerPassport = () => {
  const p = genPassport(D[S.org], ORG[S.org], S.wk, S.org);
  S.passportCode = encodePassport(p);
  playTone(720, "sine", 0.15);
  render();
};

window.verifyApplicantPassport = () => {
  const input = $("#vc");
  if (!input) return;
  S.verifyCode = input.value.trim();
  S.verifyResult = checkPassport(S.verifyCode, D, ORG);
  playTone(S.verifyResult.ok ? 800 : 250, "sine", 0.18);
  render();
};

window.tamperRecord = () => {
  if (!D[S.org].sh || D[S.org].sh.length < 4) return;
  const target = D[S.org].sh[3];
  if (!S.tamperedBackup) {
    S.tamperedBackup = { idx: 3, origE: target.e };
  }
  playTone(220, "sawtooth", 0.3);
  target.e += 2 * HR;
  render();
};

window.restoreLedger = () => {
  if (S.tamperedBackup && D[S.org].sh[S.tamperedBackup.idx]) {
    playTone(660, "sine", 0.2);
    D[S.org].sh[S.tamperedBackup.idx].e = S.tamperedBackup.origE;
    S.tamperedBackup = null;
    render();
  } else {
    resetOrg();
  }
};

window.resetOrg = () => {
  seed(S.org);
  S.tamperedBackup = null;
  S.activeBlockInspect = null;
  S.passportCode = "";
  S.verifyResult = null;
  render();
};

window.inspectBlock = idx => {
  S.activeBlockInspect = S.activeBlockInspect === idx ? null : idx;
  render();
};

window.sendRep = () => {
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
  if (!S.myReports[myKey]) S.myReports[myKey] = [];
  if (!S.myReports[myKey].includes(k)) S.myReports[myKey].push(k);

  rx.value = "";
  playTone(700, "sine", 0.1);
  render();
};

window.setIncidentStatus = (k, st) => {
  D[S.org].st[k] = st;
  render();
};

window.toggleMic = () => {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  if (S.isListening) {
    S.isListening = false;
    render();
    return;
  }

  try {
    const rec = new SpeechRec();
    rec.lang = SP[S.lang] || "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    S.isListening = true;
    render();

    rec.onresult = e => {
      const transcript = e.results[0][0].transcript;
      const rx = $("#rx");
      if (rx) {
        rx.value = rx.value ? `${rx.value} ${transcript}` : transcript;
      }
      S.isListening = false;
      render();
    };

    rec.onerror = () => {
      S.isListening = false;
      render();
    };

    rec.onend = () => {
      S.isListening = false;
      render();
    };

    rec.start();
  } catch (err) {
    S.isListening = false;
    render();
  }
};

window.scrollToElement = selector => {
  const el = $(selector);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// Main DOM Render Function
function render() {
  document.body.dataset.org = S.org;
  const app = $("#app");
  if (app) {
    app.innerHTML = hdr() + hero() + (S.role === "w" ? worker() : admin());
  }
  const modalRoot = $("#modal-root");
  if (modalRoot) {
    modalRoot.innerHTML = renderModal();
  }
}

// =========================================================================
// Interactive 3D Cosmic Particle Wave Mesh Orb Canvas Engine
// =========================================================================
function initOrbCanvas() {
  const canvas = $("#canvas-orb");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let rotX = 0;
  let rotY = 0;

  window.addEventListener("mousemove", e => {
    mouseX = (e.clientX - width / 2) / (width / 2);
    mouseY = (e.clientY - height / 2) / (height / 2);
    targetRotY = mouseX * 0.45;
    targetRotX = -mouseY * 0.35;
  });

  const RINGS = 32;
  const PTS_PER_RING = 64;
  const BASE_RADIUS = Math.min(width, height) * 0.42;
  let time = 0;

  function animate() {
    time += 0.016;
    rotX += (targetRotX - rotX) * 0.05;
    rotY += (targetRotY - rotY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = Math.min(height * 0.42, 380);
    const fov = 480;

    for (let r = 0; r < RINGS; r++) {
      const phi = ((r + 0.5) / RINGS) * Math.PI - Math.PI / 2;
      ctx.beginPath();

      for (let p = 0; p <= PTS_PER_RING; p++) {
        const theta = (p / PTS_PER_RING) * Math.PI * 2;

        const wave =
          Math.sin(theta * 4 + time * 1.8) * Math.cos(phi * 3 - time * 1.2) * 0.16 +
          Math.sin(theta * 7 - time * 2.4) * 0.06;
        const rad = BASE_RADIUS * (1 + wave);

        const x0 = rad * Math.cos(phi) * Math.sin(theta);
        const y0 = rad * Math.sin(phi);
        const z0 = rad * Math.cos(phi) * Math.cos(theta);

        const totalRotY = rotY + time * 0.25;
        const x1 = x0 * Math.cos(totalRotY) - z0 * Math.sin(totalRotY);
        const z1 = x0 * Math.sin(totalRotY) + z0 * Math.cos(totalRotY);

        const y2 = y0 * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y0 * Math.sin(rotX) + z1 * Math.cos(rotX);

        const scale = fov / (fov + z2 + 300);
        const sx = cx + x1 * scale;
        const sy = cy + y2 * scale;

        if (p === 0) {
          ctx.moveTo(sx, sy);
        } else {
          ctx.lineTo(sx, sy);
        }

        if (p % 4 === 0 && Math.abs(wave) > 0.05) {
          const particleGrad = x1 < 0 ? "rgba(139, 92, 246, 0.7)" : "rgba(244, 63, 94, 0.7)";
          ctx.fillStyle = particleGrad;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(1, 2.2 * scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const grad = ctx.createLinearGradient(cx - BASE_RADIUS, cy, cx + BASE_RADIUS, cy);
      grad.addColorStop(0, "rgba(56, 189, 248, 0.45)");
      grad.addColorStop(0.35, "rgba(139, 92, 246, 0.4)");
      grad.addColorStop(0.65, "rgba(244, 63, 94, 0.45)");
      grad.addColorStop(1, "rgba(249, 115, 22, 0.4)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// Global active timer ticker for worker in shift
setInterval(() => {
  if (S.role === "w" && D[S.org] && D[S.org].open && D[S.org].open[S.wk]) {
    const timerEl = document.querySelector(".elapsed-timer");
    if (timerEl) {
      const diff = Math.max(0, Date.now() - D[S.org].open[S.wk].s);
      const hrs = Math.floor(diff / 36e5).toString().padStart(2, "0");
      const mins = Math.floor((diff % 36e5) / 6e4).toString().padStart(2, "0");
      const secs = Math.floor((diff % 6e4) / 1e3).toString().padStart(2, "0");
      timerEl.textContent = `${hrs}h ${mins}m ${secs}s`;
    }
  }
}, 1000);

// Initialize application state for all 4 sectors
seed("con");
seed("col");
seed("hos");
seed("fac");
render();
initOrbCanvas();

Object.assign(window, {
  S, D, ORG, render, speakPayslip
});
