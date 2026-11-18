import { useState } from "react";
import Modal from "./MenuModal";

const MEALS = [["B", "Breakfast"], ["L", "Lunch"], ["S", "Snacks"], ["D", "Dinner"]];
// defined outside the component so inputs keep focus while typing
const Field = ({ label, children }) => <label className="rm-field">{label}{children}</label>;
const numOrNull = (v) => (v === "" || v == null ? null : Math.max(0, +v));

export default function EditDishModal({ item, onSave, onClose }) {
  const [subTa = "", subHi = ""] = (item.sub || "").split(" · ");
  const [f, setF] = useState({
    img: item.img ?? null,
    desc: item.desc ?? "",
    dine: item.dine ?? "",
    take: item.take ?? "",
    del: item.del ?? "",
    prep: item.prep ?? 0,
    cuisine: item.cuisine ?? "",
    thr: item.thr ?? 2,
    ta: item.ta ?? subTa,
    hi: item.hi ?? subHi,
    meals: item.meals ?? [],
    chef: !!item.chef,
    fav: !!item.fav,
    available: item.available,
  });
  const set = (patch) => setF((p) => ({ ...p, ...patch }));
  const toggleMeal = (m) => set({ meals: f.meals.includes(m) ? f.meals.filter((x) => x !== m) : [...f.meals, m] });

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set({ img: r.result });
    r.readAsDataURL(file);
  };

  const save = () => {
    onSave(item.id, {
      img: f.img,
      desc: f.desc.trim(),
      dine: numOrNull(f.dine),
      take: numOrNull(f.take),
      del: numOrNull(f.del),
      prep: numOrNull(f.prep) ?? 0,
      cuisine: f.cuisine.trim(),
      thr: numOrNull(f.thr) ?? 0,
      ta: f.ta.trim(),
      hi: f.hi.trim(),
      sub: [f.ta.trim(), f.hi.trim()].filter(Boolean).join(" · "), // keeps the guest menu subtitle in sync
      meals: f.meals,
      chef: f.chef,
      fav: f.fav,
      available: f.available,
    });
    onClose();
  };

  return (
    <Modal
      title={`Edit · ${item.name}`}
      onClose={onClose}
      footer={
        <>
          <button className="rm-btn" onClick={onClose}>✕ Cancel</button>
          <button className="rm-btn rm-btn--primary" onClick={save}>✓ Save</button>
        </>
      }
    >
      <div className="rm-row" style={{ marginBottom: 12 }}>
        <div className="rm-photo" style={f.img ? { backgroundImage: `url(${f.img})` } : undefined}>
          {!f.img && item.icon}
        </div>
        <label className="rm-btn">⭱ Upload photo
          <input type="file" accept="image/*" hidden onChange={onPhoto} />
        </label>
      </div>

      <Field label="Description">
        <input className="rm-input" value={f.desc} onChange={(e) => set({ desc: e.target.value })} />
      </Field>

      <div className="rm-form-grid rm-form-grid--3">
        <Field label="Dine-in price">
          <input className="rm-input" type="number" min="0" value={f.dine} onChange={(e) => set({ dine: e.target.value })} />
        </Field>
        <Field label="Takeaway price">
          <input className="rm-input" type="number" min="0" value={f.take} onChange={(e) => set({ take: e.target.value })} />
        </Field>
        <Field label="Delivery price">
          <input className="rm-input" type="number" min="0" value={f.del} onChange={(e) => set({ del: e.target.value })} />
        </Field>
      </div>
      <div className="rm-muted rm-form-hint">Leave blank to use ₹{item.price}.</div>

      <div className="rm-form-grid rm-form-grid--3">
        <Field label="Prep time (min)">
          <input className="rm-input" type="number" min="0" value={f.prep} onChange={(e) => set({ prep: e.target.value })} />
        </Field>
        <Field label="Cuisine">
          <input className="rm-input" value={f.cuisine} onChange={(e) => set({ cuisine: e.target.value })} />
        </Field>
        <Field label="Mark unavailable at portions ≤">
          <input className="rm-input" type="number" min="0" value={f.thr} onChange={(e) => set({ thr: e.target.value })} />
        </Field>
      </div>

      <div className="rm-form-grid rm-form-grid--2">
        <Field label="Tamil name">
          <input className="rm-input" value={f.ta} onChange={(e) => set({ ta: e.target.value })} />
        </Field>
        <Field label="Hindi name">
          <input className="rm-input" value={f.hi} onChange={(e) => set({ hi: e.target.value })} />
        </Field>
      </div>

      <div className="rm-form-label">Served at</div>
      <div className="rm-row rm-row--wrap">
        {MEALS.map(([k, label]) => (
          <label className="rm-check" key={k}>
            <input type="checkbox" checked={f.meals.includes(k)} onChange={() => toggleMeal(k)} /> {label}
          </label>
        ))}
      </div>
      <div className="rm-muted">None ticked means all day. Portions left from stock: {item.left ?? "—"}.</div>

      <div className="rm-row rm-row--wrap" style={{ marginTop: 8 }}>
        <label className="rm-check"><input type="checkbox" checked={f.chef} onChange={(e) => set({ chef: e.target.checked })} /> Chef pick</label>
        <label className="rm-check"><input type="checkbox" checked={f.fav} onChange={(e) => set({ fav: e.target.checked })} /> Bestseller</label>
        <label className="rm-check"><input type="checkbox" checked={f.available} onChange={(e) => set({ available: e.target.checked })} /> Available</label>
      </div>
    </Modal>
  );
}
