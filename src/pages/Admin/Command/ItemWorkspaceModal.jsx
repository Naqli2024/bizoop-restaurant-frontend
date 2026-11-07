import { useEffect, useRef } from "react";
import { X } from "lucide-react";


export default function ItemWorkspaceModal({ data, onClose }) {
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
      className="ws-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ws-box" role="dialog" aria-modal="true" aria-labelledby="ws-title">
        <div className="ws-header">
          <span id="ws-title">
            {data.icon} {data.title}
          </span>
          <button className="ws-x" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="ws-grid">
          {data.columns.map((col, i) => (
            <div className="ws-col" key={i}>
              {col.map((section) => (
                <div className="ws-card" key={section.heading}>
                  <div className="ws-card-title">{section.heading}</div>
                  {section.rows.map((r) => (
                    <div className="ws-line" key={r.label}>
                      <span>{r.label}</span>
                      <span className={`ws-val ${r.tone || ""}`}>{r.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {data.ai && (
          <div className="ws-ai">
            ✨ <b>AI</b> {data.ai}
          </div>
        )}

        <div className="ws-footer">
          <button ref={closeRef} className="ws-btn" onClick={onClose}>
            <X size={12} aria-hidden="true" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
