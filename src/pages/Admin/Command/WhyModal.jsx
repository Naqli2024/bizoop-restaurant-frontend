import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function WhyModal({ data, onClose, onCta }) {
  const closeRef = useRef(null);

  // Escape to close, lock page scroll while open, focus the close button
  useEffect(() => {
    if (!data) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [data, onClose]);

  if (!data) return null;

  return (
    <div
      className="why-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="why-box" role="dialog" aria-modal="true" aria-labelledby="why-title">
        <div className="why-header">
          <span id="why-title">WHY — {data.title}</span>
          <button ref={closeRef} className="why-x" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="why-stats">
          {data.stats.map((s) => (
            <div className="why-stat" key={s.label}>
              <div className="why-stat-label">{s.label}</div>
              <div className="why-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="why-section">Breakdown</div>
        {data.breakdown.map((b) => (
          <div className="why-line" key={b.label}>
            <span>{b.label}</span>
            <span className={`why-num ${b.tone}`}>{b.value}</span>
          </div>
        ))}

        <div className="why-cause">
          <b>ROOT CAUSE</b>
          <br />
          {data.rootCause}
        </div>

        <div className="why-footer">
          {(data.ctas || []).map((c) => (
            <button
              key={c.label}
              className="why-btn why-btn-primary"
              onClick={() => onCta(c.path)}
            >
              {c.label}
            </button>
          ))}
          <button className="why-btn" onClick={onClose}>
            <X size={12} aria-hidden="true" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
