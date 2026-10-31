import { useEffect, useMemo, useState } from "react";
import "../../../assets/styles/whatsapp.css";

const INITIAL_MESSAGES = [
  { id: 1, time: "21:17", guest: "Guest", mobile: "9306266370", message: "Receipt", ref: "AN-0033", status: "delivered" },
  { id: 2, time: "20:59", guest: "Prakash Kumar", mobile: "9789123450", message: "Receipt", ref: "AN-0036", status: "delivered" },
  { id: 3, time: "20:55", guest: "Guest", mobile: "9387992310", message: "Receipt", ref: "AN-0037", status: "read" },
  { id: 4, time: "20:50", guest: "Guest", mobile: "9525675220", message: "Receipt", ref: "AN-0010", status: "delivered" },
  { id: 5, time: "20:37", guest: "Mohammed Irfan", mobile: "9840770012", message: "Receipt", ref: "AN-0034", status: "delivered" },
  { id: 6, time: "20:33", guest: "Guest", mobile: "9487739917", message: "Receipt", ref: "AN-0002", status: "delivered" },
  { id: 7, time: "20:28", guest: "Karthikeyan S", mobile: "9791288340", message: "Receipt", ref: "AN-0005", status: "read" },
  { id: 8, time: "20:08", guest: "Meera Subramanian", mobile: "9962011478", message: "Receipt", ref: "AN-0020", status: "read" },
  { id: 9, time: "19:54", guest: "Guest", mobile: "9146857341", message: "Receipt", ref: "AN-0045", status: "delivered" },
  { id: 10, time: "13:10", guest: "Meera Subramanian", mobile: "9962011478", message: "Thank-you", ref: null, status: "read" },
  { id: 11, time: "12:00", guest: "Lakshmi Narayanan", mobile: "9840155021", message: "Birthday offer", ref: "BDAY15", status: "read" },
];

const AUTOMATIONS = [
  { key: "receipt", title: "Send receipt after payment", desc: "PDF invoice goes out the moment the bill is settled" },
  { key: "thanks", title: "Thank-you message", desc: "Sent 30 minutes after the bill" },
  { key: "feedback", title: "Feedback link in receipt", desc: "One-tap rating; low scores alert the manager" },
];

const STATUS_LABEL = { sent: "sent", delivered: "delivered", read: "read" };

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem("rr-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) {
    /* storage unavailable */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

const Icon = ({ children, size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 3C6.5 3 2.5 6.6 2.5 11c0 2.1.9 4 2.4 5.4L4 21l4.4-1.9c1.1.3 2.4.5 3.6.5 5.5 0 9.5-3.6 9.5-8.1S17.500 3 12 3Z" />
  </svg>
);
const SunIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);
const MoonIcon = () => (
  <Icon>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Icon>
);
const Ticks = ({ double }) => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {double ? (
      <>
        <path d="m2 13 4.5 4.5L15 8" />
        <path d="m10 14 3.5 3.5L22 8" />
      </>
    ) : (
      <path d="m5 13 5 5L19 8" />
    )}
  </svg>
);

export default function WhatsApp() {

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [toggles, setToggles] = useState({ receipt: true, thanks: true, feedback: true });



  const stats = useMemo(() => {
    const receipts = messages.filter((m) => m.message === "Receipt");
    const total = receipts.length;
    const delivered = receipts.filter((m) => m.status === "delivered" || m.status === "read").length;
    const read = receipts.filter((m) => m.status === "read").length;
    const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
    return { total, delivered: pct(delivered), read: pct(read) };
  }, [messages]);

  const resend = (id) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "sent" } : m)));
    window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id && m.status === "sent" ? { ...m, status: "delivered" } : m))
      );
    }, 1200);
  };

  const flip = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div className="wa">
      <header className="wa-header">
        <div className="wa-title-group">
          <h1 className="wa-title">
            <ChatIcon />
            <span>WhatsApp receipts</span>
          </h1>
          <span className="wa-tag">Business API</span>
        </div>
 
      </header>

      <main className="wa-main">
        <section className="wa-stats" aria-label="Summary">
          <article className="wa-stat">
            <h2 className="wa-stat-label">Receipts sent today</h2>
            <p className="wa-stat-value">{stats.total}</p>
          </article>
          <article className="wa-stat">
            <h2 className="wa-stat-label">Delivered</h2>
            <p className="wa-stat-value">{stats.delivered}%</p>
          </article>
          <article className="wa-stat">
            <h2 className="wa-stat-label">Read</h2>
            <p className="wa-stat-value">{stats.read}%</p>
          </article>
          <article className="wa-stat">
            <h2 className="wa-stat-label">Bills with no number</h2>
            <p className="wa-stat-value wa-orange">26</p>
            <p className="wa-stat-note">43% — ask guests at billing</p>
          </article>
        </section>

        <div className="wa-layout">
          <section className="wa-table-wrap" aria-label="Message log">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Guest</th>
                  <th>Mobile</th>
                  <th>Message</th>
                  <th>Ref</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td data-label="Time" className="wa-mono wa-time">{m.time}</td>
                    <td data-label="Guest" className="wa-guest">{m.guest}</td>
                    <td data-label="Mobile" className="wa-mono wa-mobile">+91 {m.mobile}</td>
                    <td data-label="Message">{m.message}</td>
                    <td data-label="Ref" className="wa-mono wa-ref">{m.ref ?? "–"}</td>
                    <td data-label="Status">
                      <span className={"wa-pill wa-status-" + m.status}>
                        <Ticks double={m.status !== "sent"} />
                        {STATUS_LABEL[m.status]}
                      </span>
                    </td>
                    <td className="wa-action-cell">
                      {m.message === "Receipt" && (
                        <button
                          type="button"
                          className="wa-resend"
                          onClick={() => resend(m.id)}
                          disabled={m.status === "sent"}
                          aria-label={`Re-send receipt for ${m.ref}`}
                        >
                          Re-send
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="wa-side" aria-label="Settings">
            <h2 className="wa-side-title">Automation</h2>
            <ul className="wa-list">
              {AUTOMATIONS.map((a) => (
                <li key={a.key} className="wa-list-item">
                  <div className="wa-list-text">
                    <p className="wa-list-title">{a.title}</p>
                    <p className="wa-list-desc">{a.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={toggles[a.key]}
                    aria-label={a.title}
                    className={"wa-switch" + (toggles[a.key] ? " is-on" : "")}
                    onClick={() => flip(a.key)}
                  >
                    <span className="wa-switch-knob" />
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="wa-side-title wa-side-title-2">Consent</h2>
            <div className="wa-consent-row">
              <span className="wa-muted">Promotional opt-in</span>
              <strong>12 of 14 guests</strong>
            </div>
            <p className="wa-consent-note">
              Receipts are transactional. Offers and campaigns only go to guests who ticked the opt-in at billing, and
              every promo message carries a STOP reply.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}