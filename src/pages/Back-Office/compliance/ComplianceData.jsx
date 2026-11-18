export const DOCS = [
  { id: "oil", name: "Used-oil disposal record", cat: "Waste", linked: "Store", captured: false },
  { id: "gen", name: "Generator / pollution consent", cat: "Equipment", linked: "Asset", captured: false, requires: "gen" },
  { id: "water", name: "Potable water test report", cat: "Food safety", no: "WTR/2026/0412", expiry: "2026-10-30", linked: "Store", captured: true },
  { id: "medical", name: "Food-handler medical certificate", cat: "Food safety", expiry: "2026-11-03", linked: "Employee", captured: true },
  { id: "scale", name: "Weighing scale verification", cat: "Equipment", no: "LM/VER/2026/204", expiry: "2026-11-17", linked: "Asset", captured: true, state: "renewing" },
  { id: "extg", name: "Fire extinguisher inspection", cat: "Fire & safety", no: "EXT-INSP-0926", expiry: "2026-11-23", linked: "Asset", captured: true },
  { id: "pest", name: "Pest-control service certificate", cat: "Pest control", no: "PC-CBE-7731", expiry: "2026-11-30", linked: "Vendor", captured: true },
  { id: "fire", name: "Fire NOC / safety certificate", cat: "Fire & safety", no: "FIRE/NOC/2025/118", expiry: "2026-11-30", linked: "Building", captured: true },
  { id: "fssai", name: "FSSAI licence", cat: "Food safety", no: "FSSAI 12425012000123", expiry: "2026-12-17", linked: "Restaurant", captured: true },
  { id: "shop", name: "Shops & Establishments registration", cat: "Labour", no: "SE/2025/3382", expiry: "2027-02-25", issued: "2026-02-25", authority: "Labour department", linked: "HR", captured: true },
  { id: "trade", name: "Trade licence", cat: "Licences", no: "TL/2026/5521", expiry: "2027-07-23", linked: "Restaurant", captured: true },
  { id: "lpg", name: "LPG safety inspection", cat: "Fire & safety", no: "LPG-INS-2026", expiry: "2027-07-28", linked: "Asset", captured: true, requires: "lpg" },
  { id: "fostac", name: "FoSTaC / food-handler training", cat: "Food safety", no: "FoSTaC-TN-48821", expiry: "2027-09-01", linked: "Employee", captured: true },
  { id: "sign", name: "Signboard / advertisement permission", cat: "Licences", no: "ADV/2026/044", expiry: "2027-09-06", linked: "Restaurant", captured: true, state: "unverified", requires: "sign" },
  { id: "lease", name: "Lease / rental agreement", cat: "Premises", no: "Registered lease deed", expiry: "2028-09-30", linked: "Restaurant", captured: true },
  { id: "gst", name: "GST registration certificate", cat: "Tax & GST", no: "GST registration", linked: "Finance", captured: true },
  { id: "pf", name: "PF / ESI registration", cat: "Labour", no: "PF / ESI code letter", linked: "HR", captured: true },
  // only appear when the matching answer is switched on
  { id: "alc", name: "Excise / liquor licence", cat: "Licences", linked: "Restaurant", captured: false, requires: "alc" },
  { id: "lift", name: "Lift safety certificate", cat: "Fire & safety", linked: "Building", captured: false, requires: "lift" },
  { id: "pool", name: "Swimming pool safety certificate", cat: "Premises", linked: "Building", captured: false, requires: "pool" },
  { id: "music", name: "Music / entertainment licence", cat: "Licences", linked: "Restaurant", captured: false, requires: "music" },
];

export const CATEGORIES = ["Food safety", "Fire & safety", "Licences", "Tax & GST", "Labour", "Pest control", "Equipment", "Premises", "Waste"];

export const QUESTIONS = [
  ["alc", "Do you serve alcohol?"],
  ["lpg", "Do you use commercial LPG?"],
  ["lift", "Is there a lift?"],
  ["gen", "Do you run a generator?"],
  ["sign", "Do you have outdoor signage?"],
  ["pool", "Is there a swimming pool?"],
  ["music", "Is there live music or entertainment?"],
];

export const FILINGS = [
  { id: "f1", name: "Staff health & hygiene certificates", cat: "Food safety", due: "2026-11-03", kind: "renew", every: 12 },
  { id: "f2", name: "TDS payment (salary / rent)", cat: "Tax", due: "2026-11-07", kind: "file", every: 1 },
  { id: "f3", name: "GSTR-1 (outward supplies)", cat: "GST", due: "2026-11-11", kind: "file", every: 1 },
  { id: "f4", name: "Contract Labour licence renewal", cat: "Labour", due: "2026-11-14", kind: "renew", every: 12 },
  { id: "f5", name: "PF / ESI contribution", cat: "Labour", due: "2026-11-15", kind: "file", every: 1 },
  { id: "f6", name: "GSTR-3B (summary & tax payment)", cat: "GST", due: "2026-11-20", kind: "file", every: 1 },
  { id: "f7", name: "Professional tax", cat: "Labour", due: "2026-11-30", kind: "file", every: 1 },
  { id: "f8", name: "Fire safety NOC", cat: "Safety", due: "2026-11-30", kind: "renew", every: 12 },
  { id: "f9", name: "FSSAI licence renewal", cat: "Food safety", due: "2026-12-13", kind: "renew", every: 12 },
  { id: "f10", name: "Shop & Establishment licence", cat: "Shop licence", due: "2027-02-25", kind: "renew", every: 12 },
  { id: "f11", name: "Trade / municipal licence", cat: "Shop licence", due: "2027-07-23", kind: "renew", every: 12 },
];

