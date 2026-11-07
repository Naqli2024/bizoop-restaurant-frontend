import { useMemo, useState } from "react";
import "../../../assets/styles/customer360.css";
import ManagerAuthModal from "../../KOT-Display/display/ManagerAuthModal";
import ReputationInsights from "./ReputationInsights";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CHANNELS = {
  wa: { label: "WhatsApp", icon: "💬", color: "#25D366" },
  ig: { label: "Instagram", icon: "📸", color: "#E1306C" },
  gg: { label: "Google", icon: "⭐", color: "#4285F4" },
  sms: { label: "SMS", icon: "✉", color: "#8B5CF6" },
  em: { label: "Email", icon: "📧", color: "#F59E0B" },
  web: { label: "Website chat", icon: "🌐", color: "#06B6D4" },
  call: { label: "Call", icon: "☎", color: "#64748B" },
  swg: { label: "Swiggy", icon: "🛵", color: "#FC8019" },
};

const SEV = { red: "🔴", yellow: "🟡", green: "🟢" };

const INITIAL = [
  {
    id: 1, name: "Mohammed Irfan", ago: "42m", ch: "wa", intent: "Complaint", vip: true, sev: "red", unanswered: true, mine: true, team: "mgmt",
    text: "Chicken biryani took 35 minutes today. Table 12. We were 6 people and kids were waiting hungry.", status: "open", messages: []
  },
  {
    id: 2, name: "Meera Subramanian", ago: "12m", ch: "ig", intent: "Enquiry", vip: true, sev: "green", unanswered: true, team: "foh",
    text: "Can you send me the details? 12 people, next Saturday.", status: "open", messages: []
  },
  {
    id: 3, name: "Arjun Venkat", ago: "1d", ch: "gg", intent: "Review", sev: "red", unanswered: true,
    text: "★★★ Waited 25 min for parotta on a Sunday. Taste was good but service needs work.", status: "open", messages: []
  },
  {
    id: 4, name: "Karthikeyan S", ago: "2h", ch: "sms", intent: "Refund", atRisk: true, sev: "red", unanswered: true, mine: true, team: "mgmt",
    text: "I was charged twice for my order yesterday. Please refund.", status: "open", messages: []
  },
  {
    id: 5, name: "Lakshmi Narayanan", ago: "5h", ch: "em", intent: "Reservation", vip: true, sev: "yellow", unanswered: true, team: "foh",
    text: "Can I reserve a table for 8 on Saturday evening around 8 PM?", status: "open", messages: []
  },
  {
    id: 6, name: "Suresh Rajan", ago: "8m", ch: "wa", intent: "Enquiry", sev: "green", unanswered: true, team: "foh",
    text: "Are you open tomorrow?", status: "open", messages: []
  },
  {
    id: 7, name: "Divya Prakash", ago: "4h", ch: "web", intent: "Enquiry", sev: "yellow", unanswered: true,
    text: "Do you do catering for 60 people? Veg biryani and starters.", status: "open", messages: []
  },
  {
    id: 8, name: "Anitha Rao", ago: "2h", ch: "swg", intent: "Complaint", sev: "red", unanswered: true,
    text: "Dosa arrived cold and soggy. Rated 2 stars.", status: "open", messages: []
  },
  {
    id: 9, name: "Prakash Kumar", ago: "10h", ch: "call", intent: "Complaint", sev: "red", mine: true, team: "mgmt",
    text: "↩ Service Case #4821 created automatically. Owner assigned.", status: "open", messages: []
  },
];

const PROFILES = {
  1: { phone: "9840770012", area: "T Nagar", ltv: 38120, visits: 22, avg: 1733, last: "3d ago", credit: 1530, prefers: "Chicken Biryani, Chicken Tikka", review: "4★", health: 83, risk: "medium", note: "1 open complaint(s). Usually visits every ~11 days; return probability 68%.", next: "Resolve the complaint before any promotion." },
  2: { phone: "9884412765", area: "Adyar", ltv: 21400, visits: 14, avg: 1530, last: "9d ago", credit: 400, prefers: "Mutton Biryani, Paneer Tikka", review: "5★", health: 90, risk: "low", note: "Planning a group booking. Usually visits every ~18 days; return probability 82%.", next: "Send the group menu and confirm the date." },
  3: { phone: "9790023456", area: "Velachery", ltv: 6240, visits: 5, avg: 1248, last: "1d ago", credit: 0, prefers: "Parotta, Chicken Salna", review: "3★", health: 58, risk: "high", note: "Left a 3★ review about wait time. Return probability 41%.", next: "Reply publicly and invite them back." },
  4: { phone: "9962218890", area: "Mylapore", ltv: 9800, visits: 8, avg: 1225, last: "1d ago", credit: 150, prefers: "Veg Meals, Filter Coffee", review: "4★", health: 62, risk: "high", note: "Possible duplicate charge. Return probability 47%.", next: "Verify the payment and refund before anything else." },
  5: { phone: "9444100321", area: "Nungambakkam", ltv: 27950, visits: 17, avg: 1644, last: "6d ago", credit: 800, prefers: "Chicken 65, Veg Biryani", review: "5★", health: 88, risk: "low", note: "Regular who books for families. Return probability 79%.", next: "Confirm the Saturday 8 PM table." },
  6: { phone: "9003377415", area: "Anna Nagar", ltv: 3100, visits: 3, avg: 1033, last: "12d ago", credit: 0, prefers: "Dosa, Idli", review: "—", health: 70, risk: "medium", note: "Quick enquiry. Return probability 55%.", next: "Reply with the opening hours." },
  7: { phone: "9677845120", area: "Porur", ltv: 0, visits: 0, avg: 0, last: "—", credit: 0, prefers: "Veg Biryani", review: "—", health: 65, risk: "medium", note: "New lead. Catering enquiry for 60 people.", next: "Send the catering menu and a quote." },
  8: { phone: "9551230987", area: "Tambaram", ltv: 4560, visits: 6, avg: 760, last: "2h ago", credit: 0, prefers: "Masala Dosa, Filter Coffee", review: "2★", health: 49, risk: "high", note: "2★ Swiggy rating after a cold order. Return probability 36%.", next: "Apologise and offer a replacement credit." },
  9: { phone: "9025561144", area: "Guindy", ltv: 12300, visits: 10, avg: 1230, last: "10h ago", credit: 250, prefers: "Fish Fry, Chicken Biryani", review: "3★", health: 60, risk: "medium", note: "Service case #4821 is open with an owner assigned.", next: "Call back and close the case." },
};

const HISTORY = {
  1: [{ icon: "🍽", text: "Visit · DEL-08 · ₹1,449", ago: "3d" }, { icon: "⭐", text: "Review 4★: Parking is a problem, food is great.", ago: "2d" }],
  2: [{ icon: "🍽", text: "Visit · T-05 · ₹2,180", ago: "9d" }, { icon: "⭐", text: "Review 5★: Loved the mutton biryani.", ago: "9d" }],
  3: [{ icon: "🍽", text: "Visit · T-09 · ₹1,320", ago: "1d" }, { icon: "🍽", text: "Visit · T-02 · ₹980", ago: "3w" }],
  4: [{ icon: "🧾", text: "Order · SW-3318 · ₹1,260 · paid online", ago: "1d" }, { icon: "🧾", text: "Order · SW-3318 · ₹1,260 · payment captured again", ago: "1d" }],
  5: [{ icon: "🍽", text: "Visit · T-11 · ₹3,050", ago: "6d" }, { icon: "📅", text: "Reservation · 6 people · Sat 7:30 PM", ago: "2w" }],
  6: [{ icon: "🍽", text: "Visit · T-03 · ₹890", ago: "12d" }],
  7: [{ icon: "🌐", text: "Visited the catering page on the website", ago: "4h" }],
  8: [{ icon: "🛵", text: "Swiggy order · SW-9921 · ₹640", ago: "2h" }, { icon: "🛵", text: "Swiggy order · SW-8870 · ₹780", ago: "3w" }],
  9: [{ icon: "☎", text: "Call logged · 4 min · Service case #4821", ago: "10h" }, { icon: "🍽", text: "Visit · T-06 · ₹1,540", ago: "5d" }],
};

const FILTERS = {
  all: (c) => c.status !== "resolved",
  mine: (c) => c.mine,
  urgent: (c) => c.sev === "red",
  unans: (c) => c.unanswered,
  comp: (c) => ["Complaint", "Refund"].includes(c.intent),
  rev: (c) => c.intent === "Review",
  res: (c) => c.intent === "Reservation",
  vip: (c) => c.vip,
  done: (c) => c.status === "resolved",
};

const SMART_VIEWS = [
  ["mine", "Assigned to me"], ["all", "All open"], ["urgent", "🔴 Urgent"], ["unans", "Unanswered"],
  ["comp", "Complaints & refunds"], ["rev", "Reviews"], ["res", "Reservations"],
  ["vip", "VIP / high-value"], ["done", "Resolved"],
];
const TEAMS = [["mgmt", "Management"], ["kitchen", "Kitchen"], ["foh", "Front of house"]];

const ANALYSIS = {
  1: {
    intent: "Complaint", urgency: "critical",
    rows: [["Order placed", "8:12 PM", ""], ["Kitchen started", "8:18 PM", "🟠 6 min queue"], ["Ready", "8:45 PM", ""],
    ["Preparation", "27 min vs 14 min standard", "🔴 +13 min"], ["Station", "Grill — 11 KOTs open at once", "🔴 overloaded"],
    ["Table 12 delivery", "7.1 min (restaurant avg 6.4)", "🟢"]],
    verdict: "Complaint appears valid. Kitchen preparation was 13 minutes above standard in the same period; Grill station was overloaded.",
    action: { label: "Offer ₹500 credit", credit: 500, icon: "🎁", log: "₹500 loyalty credit approved by owner PIN" }
  },
  2: {
    intent: "Enquiry", urgency: "normal",
    rows: [["Party size", "12 people", ""], ["Requested", "Next Saturday", ""], ["Private dining", "14 seats free", "🟢 available"],
    ["Saturday evening", "80% booked", "🟠 filling up"], ["Usual order", "Mutton Biryani, Paneer Tikka", ""]],
    verdict: "Booking is feasible. The private dining room is free; send the group menu and hold the slot before the evening fills up.",
  },
  3: {
    intent: "Review", urgency: "high",
    rows: [["Review", "★★★ on Google", "🟠 3 stars"], ["Visit", "T-09 · Sunday · ₹1,320", ""], ["Parotta wait", "25 min vs 12 min standard", "🔴 +13 min"],
    ["Station", "Tawa — 7 KOTs open at once", "🟠 busy"], ["Taste feedback", "Positive", "🟢"]],
    verdict: "The wait complaint is fair and the taste was praised. Reply publicly within 24 hours and invite them back.",
  },
  4: {
    intent: "Refund", urgency: "critical",
    rows: [["Order", "SW-3318 · ₹1,260", ""], ["Payment 1", "Captured online", "🟢"], ["Payment 2", "Captured again, same order", "🔴 duplicate"],
    ["Gateway reference", "Same reference ID", "🔴 match"], ["Customer", "At-risk · 8 visits", "🟠"]],
    verdict: "Duplicate charge confirmed. Refund ₹1,260 to the original payment method and tell the customer the timeline.",
  },
  5: {
    intent: "Reservation", urgency: "normal",
    rows: [["Party size", "8 people", ""], ["Requested slot", "Saturday, 8 PM", ""], ["Tables", "T-11 + T-12 can be joined", "🟢 available"],
    ["8 PM slot", "75% booked", "🟠 filling up"], ["Usual party", "6 people, family table", ""]],
    verdict: "Can be accommodated by joining T-11 and T-12. Confirm now to hold the slot.",
  },
  6: {
    intent: "Enquiry", urgency: "low",
    rows: [["Question", "Opening day", ""], ["Tomorrow", "Open 11 AM – 11 PM", "🟢 open"], ["Holiday closure", "None scheduled", "🟢"]],
    verdict: "Simple enquiry. Reply with the opening hours and the menu link.",
  },
  7: {
    intent: "Enquiry", urgency: "normal",
    rows: [["Guests", "60 people", ""], ["Menu asked", "Veg biryani and starters", ""], ["Estimated value", "₹16,800 – ₹20,400", "🟢 high value"],
    ["Notice needed", "48 hours", "🟠"], ["Kitchen capacity", "Covered with 2 days notice", "🟢"]],
    verdict: "High-value lead. Send the catering menu and a quote today; ask for the event date.",
  },
  8: {
    intent: "Complaint", urgency: "high",
    rows: [["Order", "SW-9921 · ₹640", ""], ["Kitchen ready", "9:02 PM", "🟢"], ["Rider pickup", "9:19 PM", "🔴 17 min wait"],
    ["Delivery time", "52 min vs 35 promised", "🔴 +17 min"], ["Rating", "2★ on Swiggy", "🔴"]],
    verdict: "Delay was at pickup. The dosa sat for 17 minutes before the rider arrived. Apologise and offer a replacement credit.",
    action: { label: "Offer ₹150 credit", credit: 150, icon: "🎁", log: "₹150 replacement credit approved" }
  },
  9: {
    intent: "Complaint", urgency: "high",
    rows: [["Service case", "#4821 · created automatically", ""], ["Owner", "Anitha M. (Manager)", "🟢 assigned"], ["Call", "4 min logged", ""],
    ["Last visit", "T-06 · ₹1,540 · 5d ago", ""], ["Callback due", "Within 2 hours", "🟠 due soon"]],
    verdict: "Case is open with an owner. Call back and close it today.",
  },
};

const DRAFTS = {
  1: "Hi Mohammed, we are really sorry about the wait on your visit today — 35 minutes is not the experience we want for you and your family. We checked: our grill station was overloaded. As a thank-you for your patience, we have added ₹500 credit to your loyalty account for your next visit. — Anitha, Manager",
  2: "Hi Meera, thank you for thinking of us! For 12 people next Saturday we can set up our private dining room. I have sent the group menu with set-meal options. Tell us the time and we will hold the table for you. — Priya, Front desk",
  3: "Hi Arjun, thank you for the honest review and for the kind words about the taste. A 25-minute wait for parotta on a Sunday is not our standard, and we are adding a second tawa on busy days. We would love to welcome you back. — Anitha, Manager",
  4: "Hi Karthikeyan, we are sorry about the double charge. We confirmed that order SW-3318 was charged twice, and we have started a refund of ₹1,260 to your original payment method. It usually reaches your account in 5–7 working days. — Anitha, Manager",
  5: "Hi Lakshmi, yes, we can seat 8 people on Saturday at 8 PM. We will join two tables so your group sits together. Reply YES and we will confirm the booking. — Priya, Front desk",
  6: "Hi Suresh, yes, we are open tomorrow from 11 AM to 11 PM. See you soon! — Priya, Front desk",
  7: "Hi Divya, yes, we cater for 60 people. Veg biryani with starters is about ₹280–₹340 per head depending on the menu. I have sent our catering menu. Please share the event date and we will send a final quote. — Rajesh, Owner",
  8: "Hi Anitha, we are sorry your dosa arrived cold and soggy. Our kitchen had it ready on time, but it waited for the rider. We have added ₹150 credit to your account and will pack it separately next time. — Anitha, Manager",
  9: "Hi Prakash, we have logged your complaint as service case #4821 and our manager Anitha owns it. She will call you back within 2 hours to sort this out. — Anitha, Manager",
};

const inr = (n) => "₹" + n.toLocaleString("en-IN");

export default function Customer360() {
  const [items, setItems] = useState(INITIAL);
  const [view, setView] = useState("inbox");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [asc, setAsc] = useState(false);
  const [selId, setSelId] = useState(1);
  const [mode, setMode] = useState("reply");
  const [text, setText] = useState("");
  const [tab, setTab] = useState("prof");
  const [sentDrafts, setSentDrafts] = useState([]); // customer ids whose AI draft is used
  const [events, setEvents] = useState([]); // live timeline events: { cid, icon, text }
  const [bonus, setBonus] = useState({}); // extra loyalty credit per customer
  const [authOpen, setAuthOpen] = useState(false);
  const [auditLog, setAuditLog] = useState([]); // { cid, action, at }
  const navigate = useNavigate()

  const count = (key) => items.filter(FILTERS[key]).length;
  const countChannel = (k) => items.filter((c) => c.ch === k).length;
  const countTeam = (k) => items.filter((c) => c.team === k).length;

  const visible = useMemo(() => {
    let fn;
    if (filter.startsWith("ch:")) fn = (c) => c.ch === filter.slice(3);
    else if (filter.startsWith("tm:")) fn = (c) => c.team === filter.slice(3);
    else fn = FILTERS[filter];
    const q = query.trim().toLowerCase();
    const list = items.filter((c) => fn(c) && (!q || (c.name + c.text).toLowerCase().includes(q)));
    return asc ? [...list].reverse() : list;
  }, [items, filter, query, asc]);

  const sel = items.find((c) => c.id === selId) || items[0];
  const ch = CHANNELS[sel.ch];
  const profile = PROFILES[sel.id];
  const bos = ANALYSIS[sel.id];
  const draft = DRAFTS[sel.id];
  const draftOpen = !sentDrafts.includes(sel.id);
  const closeDraft = () => setSentDrafts((x) => [...x, sel.id]);
  const credit = profile.credit + (bonus[sel.id] || 0);
  const patch = (id, change) => setItems((xs) => xs.map((c) => (c.id === id ? { ...c, ...change } : c)));
  const addEvent = (cid, icon, body) => setEvents((xs) => [{ cid, icon, text: body }, ...xs]);

  const sendReply = (body, kind = "reply") => {
    if (!body.trim()) return;
    patch(sel.id, {
      messages: [...sel.messages, { body, kind }],
      unanswered: kind === "reply" ? false : sel.unanswered,
    });
    addEvent(sel.id, kind === "note" ? "📝" : ch.icon, (kind === "note" ? "Note: " : ch.label + ": ") + body);
  };

  // Button opens the PIN modal; the credit is only applied once the PIN is accepted.
  const runAction = () => bos.action && setAuthOpen(true);

  const confirmAction = () => {
    const act = bos.action;
    if (act.credit) setBonus((b) => ({ ...b, [sel.id]: (b[sel.id] || 0) + act.credit }));
    addEvent(sel.id, act.icon, act.log);
    setAuditLog((l) => [{ cid: sel.id, action: act.log, at: new Date().toISOString() }, ...l]);
    setAuthOpen(false);
  };

  const timeline = [
    ...events.filter((e) => e.cid === sel.id).map((e) => ({ ...e, when: "now" })),
    { icon: ch.icon, text: ch.label + ": " + sel.text, when: sel.ago },
    ...HISTORY[sel.id].map((h) => ({ icon: h.icon, text: h.text, when: h.ago })),
  ];

  const sideLink = (key, label, n) => (
    <button key={key} className={"cx-side-link" + (filter === key ? " cx-side-link--on" : "")} onClick={() => setFilter(key)}>
      <span>{label}</span><i>{n}</i>
    </button>
  );

  const issueCounts = {
    critical: items.filter((c) => c.sev === "red" && c.intent === "Complaint").length,
    refund: items.filter((c) => c.intent === "Refund").length,
    negative: items.filter((c) => c.intent === "Review").length,
    unanswered: count("unans"),
  };

  return (
    <div className="cx-page">
      <header className="cx-top">
        <div className="cx-heading">
          🧑‍🤝‍🧑 Customer 360 <span className="cx-tag-line">one customer · every channel</span>
        </div>
        <div className="cx-switch">
          <button className={"cx-pill" + (view === "inbox" ? " cx-pill--on" : "")} onClick={() => setView("inbox")}>Inbox</button>
          <button className={"cx-pill" + (view === "rep" ? " cx-pill--on" : "")} onClick={() => setView("rep")}>Reputation &amp; insights</button>
        </div>
      </header>

      <div className="cx-banner">
        <b>{items.filter(FILTERS.all).length + 2} customer issues need attention</b>
        <span>🔴 {issueCounts.critical} critical complaint</span> ·
        <span>🔴 {issueCounts.refund} refund request</span> ·
        <span>🟠 {issueCounts.negative} negative review</span> ·
        <span>🟠 {issueCounts.unanswered} unanswered</span>
      </div>

      {view === "rep" ? (
        <ReputationInsights />
      ) : (
        <div className="cx-grid">
          <aside className="cx-col cx-side">
            <div className="cx-side-title">MY INBOX</div>
            {SMART_VIEWS.map(([k, l]) => sideLink(k, l, count(k)))}
            <div className="cx-side-title">CHANNELS</div>
            {Object.entries(CHANNELS).map(([k, c]) =>
              sideLink("ch:" + k, <span><span className="cx-dot" style={{ color: c.color }}>●</span>{c.label}</span>, countChannel(k)))}
            <div className="cx-side-title">TEAM</div>
            {TEAMS.map(([k, l]) => sideLink("tm:" + k, l, countTeam(k)))}
          </aside>

          <section className="cx-col cx-listcol">
            <div className="cx-search-row">
              <input className="cx-input" placeholder="Search keyword" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button className="cx-square-btn" title="Sort" onClick={() => setAsc((v) => !v)}>⇅</button>
            </div>
            <div className="cx-threads">
              {visible.length === 0 && <div className="cx-empty">No conversations match.</div>}
              {visible.map((c) => {
                const cc = CHANNELS[c.ch];
                return (
                  <div key={c.id} className={"cx-thread" + (c.id === sel.id ? " cx-thread--on" : "")} onClick={() => setSelId(c.id)}>
                    <div className="cx-thread-head"><b>{c.name}</b><span className="cx-thread-time">{c.ago}</span></div>
                    <div className="cx-thread-snippet">{c.text}</div>
                    <div className="cx-chips">
                      <span className="cx-chip" style={{ background: cc.color + "22", color: cc.color }}>{cc.icon} {cc.label}</span>
                      <span className="cx-chip">{c.intent}</span>
                      {c.vip && <span className="cx-chip cx-chip--vip">VIP</span>}
                      {c.atRisk && <span className="cx-chip cx-chip--warn">At-risk</span>}
                      {SEV[c.sev]}
                      {c.unanswered && <span className="cx-chip cx-chip--warn">unanswered</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="cx-col cx-convo">
            <div className="cx-convo-bar">
              <b>{sel.name} {sel.vip && <span className="cx-chip cx-chip--vip">VIP</span>} <span className="cx-meta">#{sel.id}</span></b>
              <div className="cx-switch">
                <select className="cx-input cx-input--auto" defaultValue="Anitha M. (Manager)">
                  <option>Rajesh Iyer (Owner)</option><option>Anitha M. (Manager)</option>
                  <option>Chef Murugan</option><option>Priya (Front desk)</option>
                </select>
                <select className="cx-input cx-input--auto" value={sel.status} onChange={(e) => patch(sel.id, { status: e.target.value })}>
                  <option>open</option><option>pending</option><option>resolved</option>
                </select>
              </div>
            </div>

            <div className="cx-convo-body">
              <div className="cx-insight">
                <b>✨ BOS analysis</b>
                <div className="cx-meta">
                  Intent <b>{bos.intent}</b> · Sentiment {SEV[sel.sev]} · Urgency <b>{bos.urgency}</b> · Customer <b>{sel.vip ? "VIP" : profile.visits ? "Regular" : "New"}</b> ({inr(profile.ltv)} lifetime)
                </div>
                <table><tbody>
                  {bos.rows.map(([a, b, c]) => <tr key={a}><td>{a}</td><td>{b}</td><td>{c}</td></tr>)}
                </tbody></table>
                <div className="cx-verdict">{bos.verdict}</div>
                {bos.action && (
                  <div className="cx-actions">
                    <button className="cx-btn cx-btn--main" onClick={runAction}>✎ {bos.action.label}</button>
                  </div>
                )}
              </div>

              <div className="cx-bubble-wrap">
                <div className="cx-bubble">{sel.text}</div>
                <div className="cx-meta">{ch.icon} {ch.label} · {sel.ago}</div>
              </div>

              {sel.messages.map((m, i) => (
                <div key={i} className="cx-bubble-wrap cx-bubble-wrap--out">
                  <div className="cx-bubble cx-bubble--out" style={m.kind === "note" ? { background: "#78350f" } : undefined}>{m.body}</div>
                  <div className="cx-meta">{m.kind === "note" ? "Internal note" : "Sent"}</div>
                </div>
              ))}

              {draftOpen && (
                <div className="cx-draft">
                  <div className="cx-draft-title">AI draft</div>
                  <div>{draft}</div>
                  <div className="cx-actions">
                    <button className="cx-btn cx-btn--main" onClick={() => { sendReply(draft); closeDraft(); }}>Send</button>
                    <button className="cx-btn" onClick={() => { setText(draft); closeDraft(); }}>✎ Edit</button>
                  </div>
                </div>
              )}
            </div>

            <div className="cx-composer">
              <div className="cx-composer-tools">
                <button className={"cx-pill" + (mode === "reply" ? " cx-pill--on" : "")} onClick={() => setMode("reply")}>Reply</button>
                <button className={"cx-pill" + (mode === "note" ? " cx-pill--on" : "")} onClick={() => setMode("note")}>Internal note</button>
                <button className="cx-pill" onClick={() => setText((t) => t + "@")}>@ Mention</button>
                <span className="cx-grow" />
                <button className="cx-pill" onClick={() => setText(draft)}>✨ AI writing assistant</button>
              </div>
              <textarea className="cx-input" rows={2} placeholder={mode === "note" ? "Write an internal note…" : "Write a reply…"} value={text} onChange={(e) => setText(e.target.value)} />
              <div className="cx-composer-foot">
                <span className="cx-meta">From{" "}
                  <select className="cx-input cx-input--auto"><option>{ch.label}</option></select>
                </span>
                <button className="cx-btn cx-btn--main" onClick={() => { sendReply(text, mode); setText(""); }}>Send</button>
              </div>
            </div>
          </section>

          <aside className="cx-col cx-profile">
            <div className="cx-profile-top">
              <div className="cx-avatar">{sel.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
              <h3>{sel.name}</h3>
              <div className="cx-meta">{profile.phone} · {profile.area}</div>
            </div>
            <div className="cx-profile-tabs">
              <button className={"cx-pill" + (tab === "prof" ? " cx-pill--on" : "")} onClick={() => setTab("prof")}>Profile</button>
              <button className={"cx-pill" + (tab === "tl" ? " cx-pill--on" : "")} onClick={() => setTab("tl")}>Timeline</button>
            </div>
            {tab === "prof" ? (
              <>
                <div className="cx-stat"><span>Lifetime value</span><b>{inr(profile.ltv)}</b></div>
                <div className="cx-stat"><span>Visits</span><i>{profile.visits}</i></div>
                <div className="cx-stat"><span>Avg bill</span><i>{profile.avg ? inr(profile.avg) : "—"}</i></div>
                <div className="cx-stat"><span>Last visit</span><i>{profile.last}</i></div>
                <div className="cx-stat"><span>Loyalty credit</span><i>{inr(credit)}</i></div>
                <div className="cx-stat"><span>Prefers</span><span>{profile.prefers}</span></div>
                <div className="cx-stat"><span>Last review</span><span>{profile.review}</span></div>
                <div className="cx-health">
                  <b>Customer health {profile.health}/100</b>
                  <div>Churn risk <b className={"cx-risk--" + profile.risk}>{profile.risk.toUpperCase()}</b></div>
                  <div className="cx-meta">{profile.note}</div>
                  <div className="cx-meta"><b>Next:</b> {profile.next}</div>
                </div>
              </>
            ) : (
              <ul className="cx-timeline">
                {timeline.map((e, i) => (
                  <li key={i} className="cx-tl-row">
                    <span className="cx-tl-text">{e.icon} {e.text}</span>
                    <span className="cx-tl-when">{e.when}</span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}
      <div className="customer-actions">
        <button onClick={() => navigate('/admin/customers')} className="staff-back-btn">
          <ArrowLeft size={14} />  Customers
        </button>
      </div>
      <ManagerAuthModal
        open={authOpen}
        message={bos.action ? `${bos.action.label.replace("Offer ", "Credit ")} to ${sel.name} (service recovery)` : ""}
        onAuthorise={confirmAction}
        onCancel={() => setAuthOpen(false)}
      />
    </div>
  );
}
