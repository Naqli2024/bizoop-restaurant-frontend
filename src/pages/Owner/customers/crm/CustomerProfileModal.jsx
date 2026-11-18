import { Cross, MessageSquare, X } from "lucide-react";
import { useEffect, useRef } from "react";


const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

const PILL_CLASS = {
  VIP: "cpm-pill--vip",
  Regular: "cpm-pill--regular",
  New: "cpm-pill--new",
  Lapsed: "cpm-pill--lapsed",
};

function InfoRow({ label, children, mono = false }) {
  return (
    <div className="cpm-info-row">
      <span className="cpm-info-label">{label}</span>
      <span className={"cpm-info-value" + (mono ? " cpm-mono" : "")}>{children}</span>
    </div>
  );
}

/**
 * customer: {
 *   name, segments[], mobile, whatsapp, birthday, anniversary, branch, since,
 *   visits, spend, points, lastVisit,
 *   favourites[], feedback[{ stars, text }], bills[{ no, amount }], messagesToday
 * }
 */
export default function CustomerProfileModal({ customer, onClose }) {
  const dialogRef = useRef(null);

  // Close on Escape, lock page scroll, focus the dialog
  useEffect(() => {
    if (!customer) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [customer, onClose]);

  if (!customer) return null;

  const c = customer;
  const avgBill = c.visits ? c.spend / c.visits : 0;
  const firstName = c.name.split(" ")[0];

  return (
    <div
      className="cpm-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="cpm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cpm-title"
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="cpm-header">
          <h3 className="cpm-title" id="cpm-title">
            {c.name}
            {c.segments?.map((s) => (
              <span key={s} className={`cpm-pill ${PILL_CLASS[s] || ""}`}>{s}</span>
            ))}
          </h3>
          <button type="button" className="cpm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="cpm-body">
          <div className="cpm-col">
            <InfoRow label="Mobile / WhatsApp" mono>
              +91 {c.mobile}{" "}
              {c.whatsapp && <span className="cpm-pill cpm-pill--optin">opted in</span>}
            </InfoRow>
            {c.birthday && <InfoRow label="Birthday">{c.birthday}</InfoRow>}
            {c.anniversary && <InfoRow label="Anniversary">{c.anniversary}</InfoRow>}
            <InfoRow label="Preferred branch">{c.branch}</InfoRow>
            {c.since && <InfoRow label="Customer since">{c.since}</InfoRow>}
            <InfoRow label="Visits · avg bill">{c.visits} · {inr(avgBill)}</InfoRow>
            <InfoRow label="Total spend">{inr(c.spend)}</InfoRow>
            <InfoRow label="Loyalty points">{c.points}</InfoRow>
            <InfoRow label="Last visit">{c.lastVisit}</InfoRow>
          </div>

          <div className="cpm-col">
            <h4 className="cpm-section-label">Favourite items</h4>
            <div className="cpm-chips">
              {c.favourites?.map((f) => (
                <span key={f} className="cpm-chip">{f}</span>
              ))}
            </div>

            {c.feedback?.length > 0 && (
              <>
                <h4 className="cpm-section-label">Feedback &amp; complaints</h4>
                {c.feedback.map((f, i) => (
                  <div key={i} className="cpm-feedback">
                    <span className="cpm-stars" aria-label={`${f.stars} out of 5 stars`}>
                      {"★".repeat(f.stars)}
                    </span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </>
            )}

            {c.bills?.length > 0 && (
              <>
                <h4 className="cpm-section-label cpm-section-label--spaced">Recent bills today</h4>
                {c.bills.map((b) => (
                  <div key={b.no} className="cpm-info-row">
                    <span className="cpm-mono">{b.no}</span>
                    <span>{inr(b.amount)}</span>
                  </div>
                ))}
              </>
            )}

            {c.messagesToday > 0 && (
              <p className="cpm-note">{c.messagesToday} WhatsApp message(s) today</p>
            )}
          </div>
        </div>

        <footer className="cpm-footer">
          <button type="button" className="cpm-btn" onClick={onClose}>
             <X size={12} className="cpm-icon"/>
            Close
          </button>
          <button
            type="button"
            className="cpm-btn cpm-btn--primary"
            disabled={!c.whatsapp}
            title={c.whatsapp ? undefined : "Customer has not opted in to WhatsApp"}
            onClick={() => {
              onClose();
            }}
          >
            <MessageSquare size={12} className="cpm-icon"/>
            Send offer
          </button>
        </footer>
      </div>
    </div>
  );
}
