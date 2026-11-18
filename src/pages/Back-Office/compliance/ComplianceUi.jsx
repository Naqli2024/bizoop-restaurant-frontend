import { Plus, RefreshCw, Check } from "lucide-react";

/* ---------- small pieces ---------- */
export const Chip = ({ tone = "grey", children }) => <span className={`cx-chip cx-chip--${tone}`}>{children}</span>;

const ICONS = { plus: Plus, refresh: RefreshCw, check: Check };

export const Btn = ({ variant = "plain", onClick, icon, children }) => {
  const Icon = ICONS[icon];
  return (
    <button type="button" className={`cx-btn cx-btn--${variant}`} onClick={onClick}>
      {Icon && <Icon className="cx-ico" size={14} strokeWidth={2.4} aria-hidden="true" />}
      {children}
    </button>
  );
};

export function RowAction({ status, id, handlers }) {
  const { capture, renew, verify } = handlers;
  switch (status.action) {
    case "capture": return <Btn variant="primary" onClick={() => capture(id)}>Capture</Btn>;
    case "renew": return <Btn variant="primary" icon="refresh" onClick={() => renew(id)}>Renew</Btn>;
    case "verify": return <Btn variant="success" icon="check" onClick={() => verify(id)}>Verify</Btn>;
    default: return <Btn onClick={() => handlers.open(id)}>Open</Btn>;
  }
}

