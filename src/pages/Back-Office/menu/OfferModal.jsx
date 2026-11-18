import { useState } from "react";
import Modal from "./MenuModal";

const DAYS = [[0, "Sun"], [1, "Mon"], [2, "Tue"], [3, "Wed"], [4, "Thu"], [5, "Fri"], [6, "Sat"]];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const pad = (n) => String(n).padStart(2, "0");

// defined outside the component so inputs keep focus while typing
const Field = ({ label, children }) => <label className="rm-field">{label}{children}</label>;

/* Turns form values into the offer object the Controller tab shows. */
export function toOffer(f, items, id) {
  const now = new Date();
  const live = f.on && f.days.includes(now.getDay()) && now.getHours() >= f.from && now.getHours() < f.to;
  const dayList = DAY_ORDER.filter((d) => f.days.includes(d));
  return {
    id,
    name: f.name,
    price: f.price,
    from: f.from,
    to: f.to,
    on: f.on,
    dishIds: f.dishIds,
    dayNums: f.days,
    dishes: f.dishIds.map((d) => items.find((i) => i.id === d)?.name).filter(Boolean),
    hours: `${pad(f.from)}:00 to ${pad(f.to)}:00`,
    days: dayList.length === 7 ? "Every day" : dayList.map((d) => DAYS[d][1]).join(" "),
    state: !f.on ? "Off" : live ? "Live" : "Scheduled",
  };
}

export default function OfferModal({ offer, items, onSave, onDelete, onClose }) {
  const [f, setF] = useState({
    name: offer?.name ?? "",
    price: offer?.price ?? 0,
    from: offer?.from ?? 0,
    to: offer?.to ?? 24,
    dishIds: offer?.dishIds ?? [],
    days: offer?.dayNums ?? [0, 1, 2, 3, 4, 5, 6],
    on: offer?.on ?? true,
  });
  const [error, setError] = useState("");
  const set = (patch) => setF((p) => ({ ...p, ...patch }));

  // Multi-select can't repeat a dish, so keep the existing quantity for dishes that stay selected.
  const pickDishes = (e) => {
    const picked = Array.from(e.target.selectedOptions, (o) => +o.value);
    const counts = f.dishIds.reduce((m, id) => ((m[id] = (m[id] || 0) + 1), m), {});
    set({ dishIds: picked.flatMap((id) => Array(Math.max(1, counts[id] || 0)).fill(id)) });
  };
  const toggleDay = (d) => set({ days: f.days.includes(d) ? f.days.filter((x) => x !== d) : [...f.days, d] });

  const save = () => {
    const data = { ...f, name: f.name.trim(), price: Math.max(0, +f.price || 0), from: +f.from || 0, to: +f.to || 0 };
    if (!data.name) return setError("Give the offer a name.");
    if (data.from < 0 || data.to > 24 || data.from >= data.to) return setError("From hour must be before To hour (0 to 24).");
    if (!data.dishIds.length) return setError("Pick at least one dish.");
    if (!data.days.length) return setError("Pick at least one day.");
    onSave(toOffer(data, items, offer?.id));
    onClose();
  };

  const remove = () => {
    onDelete?.(offer.id);
    onClose();
  };

  return (
    <Modal
      title={offer ? "Edit offer" : "New offer"}
      onClose={onClose}
      footer={
        <>
          {offer && (
            <button className="rm-btn rm-btn--danger" onClick={remove}>🗑 Delete</button>
          )}
          <button className="rm-btn" onClick={onClose}>✕ Cancel</button>
          <button className="rm-btn rm-btn--primary" onClick={save}>✓ Save</button>
        </>
      }
    >
      <div className="rm-form-grid rm-form-grid--2">
        <Field label="Name">
          <input className="rm-input" value={f.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="Offer price">
          <input className="rm-input" type="number" min="0" value={f.price} onChange={(e) => set({ price: e.target.value })} />
        </Field>
        <Field label="From hour">
          <input className="rm-input" type="number" min="0" max="24" value={f.from} onChange={(e) => set({ from: e.target.value })} />
        </Field>
        <Field label="To hour">
          <input className="rm-input" type="number" min="0" max="24" value={f.to} onChange={(e) => set({ to: e.target.value })} />
        </Field>
      </div>

      <Field label="Dishes (hold Ctrl or Cmd to pick several; repeat a dish by adding the offer twice)">
        <select multiple size={7} className="rm-input rm-multi"
          value={[...new Set(f.dishIds)].map(String)} onChange={pickDishes}>
          {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </Field>

      <div className="rm-row rm-row--wrap">
        {DAYS.map(([d, label]) => (
          <label className="rm-check" key={d}>
            <input type="checkbox" checked={f.days.includes(d)} onChange={() => toggleDay(d)} /> {label}
          </label>
        ))}
        <label className="rm-check">
          <input type="checkbox" checked={f.on} onChange={(e) => set({ on: e.target.checked })} /> On
        </label>
      </div>

      {error && <div className="rm-form-error" role="alert">{error}</div>}
    </Modal>
  );
}
