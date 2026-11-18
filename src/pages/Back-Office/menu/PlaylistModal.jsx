import { useRef, useState } from "react";
import Modal from "./MenuModal";

export const SLIDE_TYPES = [
  ["welcome", "Welcome"], ["best", "Bestsellers"], ["menu", "Current menu"], ["cat", "Category"],
  ["offer", "Offers"], ["special", "Chef specials"], ["text", "Message"],
];

export const playlistSeconds = (list) => list.reduce((s, x) => s + x.sec, 0);

export default function PlaylistModal({ screen, onSave, onClose }) {
  const nextKey = useRef(0);
  const withKey = (s) => ({ ...s, key: nextKey.current++ });          // stable keys while reordering
  const [rows, setRows] = useState(() => (screen.playlist ?? []).map(withKey));
  const [error, setError] = useState("");

  const patch = (key, p) => setRows((l) => l.map((r) => (r.key === key ? { ...r, ...p } : r)));
  const move = (idx, d) => setRows((l) => {
    const j = idx + d; if (j < 0 || j >= l.length) return l;
    const n = [...l]; [n[idx], n[j]] = [n[j], n[idx]]; return n;
  });
  const remove = (key) => setRows((l) => l.filter((r) => r.key !== key));
  const add = () => setRows((l) => [...l, withKey({ type: "best", sec: 8 })]);

  const save = (applyToGroup) => {
    if (!rows.length) return setError("Add at least one slide.");
    // minimum 3 seconds, blank falls back to 8, like the original
    const list = rows.map(({ type, sec }) => ({ type, sec: Math.max(3, +sec || 8) }));
    onSave(screen.id, list, applyToGroup);
    onClose();
  };

  return (
    <Modal
      title={`Playlist · ${screen.name}`}
      onClose={onClose}
      footer={
        <>
          <button className="rm-btn" onClick={onClose}>✕ Cancel</button>
          <button className="rm-btn" onClick={() => save(false)}>✓ Save</button>
          {screen.group && (
            <button className="rm-btn rm-btn--primary" onClick={() => save(true)}>
              ✓ Save and apply to {screen.group}
            </button>
          )}
        </>
      }
    >
      {rows.map((r, idx) => (
        <div className="rm-pl-row" key={r.key}>
          <select className="rm-input" value={r.type} onChange={(e) => patch(r.key, { type: e.target.value })}>
            {SLIDE_TYPES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <input className="rm-input rm-pl-sec" type="number" min="3" aria-label="Seconds"
            value={r.sec} onChange={(e) => patch(r.key, { sec: e.target.value })} />
          <button className="rm-btn" aria-label="Up" disabled={idx === 0} onClick={() => move(idx, -1)}>↑</button>
          <button className="rm-btn" aria-label="Down" disabled={idx === rows.length - 1} onClick={() => move(idx, 1)}>↓</button>
          <button className="rm-btn" aria-label="Remove" onClick={() => remove(r.key)}>✕</button>
        </div>
      ))}
      <button className="rm-btn" onClick={add}>+ Add slide</button>
      {error && <div className="rm-form-error" role="alert">{error}</div>}
    </Modal>
  );
}
