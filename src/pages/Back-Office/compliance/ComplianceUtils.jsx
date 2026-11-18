/* ---------- helpers ---------- */
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const utc = (iso) => { const [y, m, d] = iso.split("-").map(Number); return Date.UTC(y, m - 1, d); };
export const todayIso = () => { const n = new Date(); return `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`; };
export const daysFrom = (today, iso) => Math.round((utc(iso) - utc(today)) / 864e5);
export const fmtLong = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`; };
export const fmtShort = (iso) => { const [, m, d] = iso.split("-").map(Number); return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]}`; };
export const addMonths = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  const lastDay = new Date(Date.UTC(y, m - 1 + n + 1, 0)).getUTCDate(); // clamp e.g. 31 Jan -> 28 Feb
  const t = new Date(Date.UTC(y, m - 1 + n, Math.min(d, lastDay)));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
};
export const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function docStatus(doc, today, verified) {
  if (!doc.captured) return { tone: "bad", label: "Not captured", action: "capture", attn: true };
  if (doc.state === "na") return { tone: "grey", label: "Not applicable", action: "open" };
  if (doc.state === "renewing") return { tone: "info", label: "Renewal in progress", action: "open" };
  if (doc.state === "unverified" && !verified.has(doc.id))
    return { tone: "review", label: "Awaiting verification", action: "verify", attn: true };
  if (!doc.expiry) return { tone: "good", label: "Valid · no expiry", action: "open" };
  const d = daysFrom(today, doc.expiry);
  if (d < 0) return { tone: "bad", label: `Expired ${plural(-d, "day")} ago`, action: "renew", attn: true };
  if (d <= 45) return { tone: "warn", label: `Expires in ${plural(d, "day")}`, action: "renew", attn: true };
  return { tone: "good", label: "Valid", action: "open" };
}

export const baseHistory = (doc) =>
  doc.history || (doc.captured && doc.issued ? [{ date: doc.issued, text: "Captured" }, { date: doc.issued, text: "Verified" }] : []);

// Score starts at 100; each open item costs points (initial sample data = 77).
export const PENALTY = { bad: 4, warn: 1.5, review: 1 }; // expired/missing, expiring soon, awaiting verification
export const healthOf = (rows) =>
  Math.max(0, Math.round(100 - rows.reduce((sum, r) => sum + (PENALTY[r.st.tone] || 0), 0)));
export const healthLabel = (n) => (n >= 90 ? "Good" : n >= 75 ? "Fair" : "Needs work");

export function filingStatus(d) {
  if (d < 0) return { tone: "bad", label: "Overdue" };
  if (d <= 3) return { tone: "bad", label: "Urgent" };
  if (d <= 14) return { tone: "warn", label: "Due soon" };
  return { tone: "good", label: "On track" };
}

