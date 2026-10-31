import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../assets/styles/order.css";

/* ====================== STATIC DATA ====================== */

const STN = {
  main: { label: "🍳 Main Kitchen", name: "Main Kitchen", color: "#F59E0B" },
  tandoor: { label: "🔥 Tandoor", name: "Tandoor", color: "#F97316" },
  bar: { label: "🍹 Bar", name: "Bar", color: "#3B82F6" },
  dessert: { label: "🍨 Dessert", name: "Dessert", color: "#EC4899" },
};

// [id, name, price, category, veg, icon, station, fav, off, left]
const MENU = [
  [1, "Chicken 65", 220, "Starters", 0, "🍗", "main", 1],
  [2, "Gobi Manchurian", 170, "Starters", 1, "🥦", "main"],
  [3, "Fish Fry", 280, "Starters", 0, "🐟", "main", 0, 1],
  [4, "Paneer Tikka", 240, "Starters", 1, "🧀", "tandoor", 1],
  [5, "Chicken Tikka", 260, "Starters", 0, "🍢", "tandoor"],
  [6, "Tandoori Chicken (Half)", 300, "Starters", 0, "🍗", "tandoor", 1],
  [7, "Paneer Butter Masala", 280, "Main Course", 1, "🧀", "main", 1],
  [8, "Butter Chicken", 320, "Main Course", 0, "🍛", "main", 1],
  [9, "Chicken Chettinad", 300, "Main Course", 0, "🌶️", "main"],
  [10, "Dal Tadka", 190, "Main Course", 1, "🥣", "main"],
  [11, "Veg Kurma", 180, "Main Course", 1, "🥘", "main"],
  [12, "Chicken Biryani", 220, "Biryani", 0, "🍚", "main", 1],
  [13, "Mutton Biryani", 320, "Biryani", 0, "🥩", "main", 1, 0, 6],
  [14, "Veg Biryani", 180, "Biryani", 1, "🍚", "main"],
  [15, "Egg Biryani", 190, "Biryani", 0, "🥚", "main"],
  [16, "Butter Naan", 60, "Breads", 1, "🫓", "tandoor", 1],
  [17, "Garlic Naan", 70, "Breads", 1, "🫓", "tandoor"],
  [18, "Tandoori Roti", 35, "Breads", 1, "🫓", "tandoor"],
  [19, "Kerala Parotta", 30, "Breads", 1, "🥞", "main", 1],
  [20, "Kothu Parotta", 190, "Breads", 0, "🍳", "main", 1],
  [21, "Masala Dosa", 110, "Tiffin", 1, "🥞", "main"],
  [22, "Idli (2 pcs)", 60, "Tiffin", 1, "⚪", "main"],
  [23, "Ghee Pongal", 90, "Tiffin", 1, "🍲", "main"],
  [24, "Filter Coffee", 50, "Beverages", 1, "☕", "bar", 1],
  [25, "Masala Chai", 40, "Beverages", 1, "🍵", "bar"],
  [26, "Fresh Lime Soda", 70, "Beverages", 1, "🍋", "bar", 1],
  [27, "Mint Mojito", 120, "Beverages", 1, "🍹", "bar"],
  [28, "Mango Lassi", 90, "Beverages", 1, "🥭", "bar"],
  [29, "Cold Coffee", 110, "Beverages", 1, "🧋", "bar"],
  [30, "Gulab Jamun (2)", 90, "Desserts", 1, "🍡", "dessert", 1],
  [31, "Elaneer Payasam", 100, "Desserts", 1, "🥥", "dessert"],
  [32, "Ice Cream Sundae", 140, "Desserts", 1, "🍨", "dessert"],
  [33, "Brownie with Ice Cream", 160, "Desserts", 1, "🍫", "dessert", 1],
].map(([id, name, price, cat, veg, icon, stn, fav, off, left]) => ({
  id, name, price, cat, icon, stn, left,
  veg: Boolean(veg), fav: Boolean(fav), off: Boolean(off),
}));

const CATS = ["All", "Starters", "Main Course", "Biryani", "Breads", "Tiffin", "Beverages", "Desserts"];

const SPICY = ["Starters", "Main Course", "Biryani"];
const SPICE_LEVELS = ["Mild", "Medium", "Spicy", "Extra Spicy"];
const ADD = {
  Starters: [["Extra sauce", 20], ["Extra cheese", 30]],
  Biryani: [["Extra raita", 20], ["Boiled egg", 25]],
  "Main Course": [["Extra gravy", 30]],
};

/* ====================== HELPERS ====================== */

const money = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rupee = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const p4 = (n) => String(n).padStart(4, "0");
const hm = (t) => new Date(t).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const dfmt = (t) => new Date(t).toLocaleDateString("en-IN");

// "Spice: Medium · Extra gravy · less oil"
const itemNote = (i) =>
  [i.spice && `Spice: ${i.spice}`, ...(i.addons || []).map((a) => a.name), i.note].filter(Boolean).join(" · ");

const Pencil = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
);
const Cross = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
);

function Modal({ title, children, onClose, footer }) {
  return (
    <div className="order-modal-backdrop" onClick={onClose}>
      <div className="order-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-header">
          <h3>{title}</h3>
          <button type="button" className="order-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="order-modal-body">{children}</div>
        {footer && <div className="order-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// Thermal kitchen ticket preview
function Thermal({ k, name }) {
  return (
    <div className="thermal">
      <div className="c big">{name}</div>
      <div className="c b">** KITCHEN ORDER TICKET **</div>
      {k.kind !== "new" && <div className="c big">{k.kind === "cancel" ? "✕ CANCELLED ITEM" : "✎ MODIFIED ITEM"}</div>}
      <hr />
      <div className="li"><span></span><span className="big">KOT-{p4(k.no)}</span></div>
      <div>Table/Order: <b>{k.label}</b></div>
      <div>Captain: {k.captain}</div>
      <div>Time: {hm(k.at)} · {dfmt(k.at)}</div>
      <div>Station: {STN[k.st]?.name}</div>
      {k.prio && <div className="b">⚡ PRIORITY</div>}
      <hr />
      {k.items.map((i, n) => (
        <div className="li" key={n}>
          <span>{i.qty}×</span>
          <span>{i.name}{i.note && <><br /><i>› {i.note}</i></>}</span>
        </div>
      ))}
    </div>
  );
}

/* ====================== COMPONENT ====================== */

export default function Order({
  table = { code: "T5", area: "AC Hall", order: "O9", pax: 2, server: "Karthik M.", status: "Food ready" },
  restaurantName = "Restaurant",
  freeTables = [],            // [{ id: "T3", seats: 4 }]  → Transfer / Split destinations
  openTables = [],            // [{ id: "T2", total: 450, pax: 2 }] → Merge sources
  onBackToFloor,
  onSendKOT,                  // (kot) => void   — called once per station ticket
  onRequestBill,              // (table) => void
  onTransfer,                 // (from, to) => void
  onMerge,                    // (tableId) => void
  onSplit,                    // (items, toTable) => void
  onCancelOrder,              // (table) => void
  authorize = (reason, run) => run(), // plug your manager-PIN dialog in here
}) {
  const navigate = useNavigate();
  const uidRef = useRef(0);
  const newUid = () => `u${++uidRef.current}`;
  const location = useLocation();
  const selectedOrder = location.state?.order;

  const currentTable = {
    code: selectedOrder?.table || selectedOrder?.label || table.code,
    area: selectedOrder?.area || table.area,
    order: location.state?.orderId || selectedOrder?.id || table.order,
    pax: selectedOrder?.pax ?? table.pax,
    server: selectedOrder?.captain || selectedOrder?.server || table.server,
    status: selectedOrder?.status || table.status,
  };
  /* menu */
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [fav, setFav] = useState(false);

  /* order */
  const [items, setItems] = useState([]);                // not sent yet (can be held)
  const [sent, setSent] = useState([
    { uid: "s1", id: 8, name: "Butter Chicken", qty: 1, price: 320, kot: "KOT-0136", state: "ready", stn: "main", note: "", spice: "", addons: [] },
    { uid: "s2", id: 17, name: "Garlic Naan", qty: 3, price: 70, kot: "KOT-0137", state: "ready", stn: "tandoor", note: "", spice: "", addons: [] },
  ]);
  const [kotNo, setKotNo] = useState(138);
  const [prio, setPrio] = useState(false);
  const [billReq, setBillReq] = useState(false);
  const [curTable, setCurTable] = useState(currentTable.code);
  const [pax, setPax] = useState(currentTable.pax);
  const [guest, setGuest] = useState({ name: "", mobile: "" });
  const [msg, setMsg] = useState("");

  /* modals */
  const [modal, setModal] = useState(null);
  const [opt, setOpt] = useState({ qty: 1, spice: "", addons: [], note: "", hold: false });
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [modNote, setModNote] = useState("");
  const [splitSel, setSplitSel] = useState({});
  const [splitTo, setSplitTo] = useState("");
  const [gForm, setGForm] = useState({ name: "", mobile: "" });

  function goToFloor() {
    if (onBackToFloor) onBackToFloor();
    else navigate("/captain/floor");
  }

  /* ====================== DERIVED ====================== */

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MENU.filter(
      (m) =>
        (cat === "All" || m.cat === cat) &&
        (!fav || m.fav) &&
        (!s || m.name.toLowerCase().includes(s) || String(m.id) === s)
    );
  }, [q, cat, fav]);

  const liveSent = sent.filter((s) => s.state !== "void");
  const fire = items.filter((i) => !i.hold);
  const sub =
    items.reduce((t, i) => t + i.price * i.qty, 0) +
    liveSent.reduce((t, i) => t + i.price * i.qty, 0);
  const gst = sub * 0.05;
  const hasAny = items.length + liveSent.length > 0;
  const canBill = liveSent.length > 0 && !billReq;

  const qtyOf = (id) =>
    items.filter((i) => i.id === id).reduce((t, i) => t + i.qty, 0) +
    liveSent.filter((i) => i.id === id).reduce((t, i) => t + i.qty, 0);

  const modItem = modal?.type === "item" ? modal.item : null;
  const modAdds = modItem ? ADD[modItem.cat] || [] : [];
  const modUnit = modItem
    ? modItem.price + modAdds.reduce((t, [n, p]) => t + (opt.addons.includes(n) ? p : 0), 0)
    : 0;

  /* ====================== ADD ITEMS ====================== */

  function addLine(m, qty, o) {
    if (m.left != null && qtyOf(m.id) + qty > m.left) {
      setMsg(`Only ${m.left} ${m.name} available.`);
      return false;
    }
    const adds = ADD[m.cat] || [];
    const addons = o.addons.map((n) => ({ name: n, price: (adds.find((a) => a[0] === n) || [0, 0])[1] }));
    const price = m.price + addons.reduce((t, a) => t + a.price, 0);
    const key = [m.id, o.spice, addons.map((a) => a.name).join("+"), o.note, o.hold].join("|");

    setItems((prev) =>
      prev.some((l) => l.key === key)
        ? prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        : [...prev, { uid: newUid(), key, id: m.id, name: m.name, price, qty, spice: o.spice, addons, note: o.note, hold: o.hold, stn: m.stn, cat: m.cat }]
    );
    setMsg("");
    return true;
  }

  function itemClick(m) {
    if (m.off || m.left === 0) {
      setMsg(`${m.name} is unavailable right now.`);
      return;
    }
    const hasOpts = SPICY.includes(m.cat) || (ADD[m.cat] || []).length > 0;
    const base = { qty: 1, spice: SPICY.includes(m.cat) ? "Medium" : "", addons: [], note: "", hold: false };
    if (!hasOpts) {
      addLine(m, 1, base);
      return;
    }
    setOpt(base);
    setModal({ type: "item", item: m });
  }

  function addFromModal() {
    if (addLine(modItem, opt.qty, opt)) setModal(null);
  }

  const toggleAddon = (n) =>
    setOpt((o) => ({ ...o, addons: o.addons.includes(n) ? o.addons.filter((a) => a !== n) : [...o.addons, n] }));

  /* ====================== EDIT UNSENT ITEMS ====================== */

  function qtyChg(l, d) {
    if (d > 0) {
      const m = MENU.find((x) => x.id === l.id);
      if (m?.left != null && qtyOf(l.id) + 1 > m.left) {
        setMsg(`Only ${m.left} ${m.name} available.`);
        return;
      }
    }
    setItems((prev) => prev.map((i) => (i.uid === l.uid ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0));
    setMsg("");
  }
  const rmItem = (uid) => setItems((prev) => prev.filter((i) => i.uid !== uid));
  function holdTog(l) {
    setItems((prev) => prev.map((i) => (i.uid === l.uid ? { ...i, hold: !i.hold } : i)));
    setMsg(l.hold ? `${l.name} released — will fire with next KOT.` : `${l.name} held.`);
  }

  /* ====================== KOT ====================== */

  const makeKOT = (no, kind, st, its, extra = {}) => ({
    no, kind, st, prio: kind !== "new" ? true : prio,
    label: curTable, captain: table.server, at: Date.now(), items: its, ...extra,
  });

  function sendKOT() {
    if (!fire.length) return;
    const groups = {};
    fire.forEach((i) => (groups[i.stn] = [...(groups[i.stn] || []), i]));

    const ks = [];
    const lines = [];
    Object.entries(groups).forEach(([st, its], idx) => {
      const no = kotNo + idx;
      ks.push(makeKOT(no, "new", st, its.map((i) => ({ qty: i.qty, name: i.name, note: itemNote(i) }))));
      its.forEach((i) => lines.push({ ...i, uid: newUid(), kot: `KOT-${p4(no)}`, state: "prep" }));
    });

    setSent((prev) => [...prev, ...lines]);
    setItems((prev) => prev.filter((i) => i.hold));
    setKotNo((n) => n + ks.length);
    setBillReq(false);
    ks.forEach((k) => onSendKOT?.(k));
    setMsg(`${ks.length} KOT${ks.length > 1 ? "s" : ""} sent${prio ? " (priority)" : ""}.`);
    setModal({ type: "kot", ks });
  }

  /* ====================== SENT ITEMS ====================== */

  function startEdit(s) {
    setEditingId(s.uid);
    setEditQty(String(s.qty));
  }
  function saveSentQty(uid) {
    const n = Number(editQty);
    if (!Number.isInteger(n) || n < 1) return setMsg("Enter a valid quantity greater than zero.");
    setSent((prev) => prev.map((s) => (s.uid === uid ? { ...s, qty: n } : s)));
    setEditingId(null);
    setMsg("Kitchen item quantity updated.");
  }

  function cxSent(s) {
    authorize(`Cancel ${s.name} ×${s.qty} after ${s.kot} (${curTable})`, () => {
      setSent((prev) => prev.map((x) => (x.uid === s.uid ? { ...x, state: "void" } : x)));
      onSendKOT?.(makeKOT(kotNo, "cancel", s.stn, [{ qty: s.qty, name: s.name, note: "CANCELLED — stop preparing" }]));
      setKotNo((n) => n + 1);
      setMsg(`Cancellation KOT sent to ${STN[s.stn]?.name}.`);
    });
  }

  function openMod(s) {
    setModNote(s.note || "");
    setModal({ type: "mod", item: s });
  }
  function doModSent() {
    const s = modal.item;
    const nt = modNote.trim();
    setModal(null);
    authorize(`Modify ${s.name} after ${s.kot} (${curTable}): ${nt || "—"}`, () => {
      setSent((prev) => prev.map((x) => (x.uid === s.uid ? { ...x, note: nt } : x)));
      onSendKOT?.(makeKOT(kotNo, "mod", s.stn, [{ qty: s.qty, name: s.name, note: `CHANGE: ${nt || "none"}` }]));
      setKotNo((n) => n + 1);
      setMsg("Modification KOT sent.");
    });
  }

  /* ====================== BILL / PRIORITY ====================== */

  function requestBill() {
    if (!canBill) return;
    setBillReq(true);
    onRequestBill?.({ ...table, code: curTable });
    setMsg(
      items.length
        ? "Cashier notified. Unsent items still need a KOT or removal before billing."
        : `Cashier notified — bill requested for ${curTable}.`
    );
  }
  function prioTog() {
    setPrio((p) => !p);
    setMsg(!prio ? "Marked priority — flagged on KOT display." : "Priority removed.");
  }

  /* ====================== CANCEL ORDER ====================== */

  function confirmCancel() {
    setModal(null);
    const run = () => {
      liveSent.forEach((s, i) =>
        onSendKOT?.(makeKOT(kotNo + i, "cancel", s.stn, [{ qty: s.qty, name: s.name, note: "ORDER CANCELLED" }]))
      );
      setKotNo((n) => n + liveSent.length);
      setItems([]);
      setSent([]);
      onCancelOrder?.({ ...table, code: curTable });
      goToFloor();
    };
    if (liveSent.length) authorize(`Cancel entire order ${curTable} (items already sent to kitchen)`, run);
    else run();
  }

  /* ====================== TRANSFER / MERGE / SPLIT / GUEST ====================== */

  function doXfer(to) {
    onTransfer?.(curTable, to);
    setMsg(`Moved ${curTable} → ${to}`);
    setCurTable(to);
    setModal(null);
  }
  function doMerge(t) {
    onMerge?.(t.id);
    setPax((p) => p + (t.pax || 0));
    setMsg(`Merged ${t.id} into ${curTable}.`);
    setModal(null);
  }
  function openSplit() {
    setSplitSel({});
    setSplitTo("");
    setModal({ type: "split" });
  }
  function doSplit() {
    const moving = [...items, ...liveSent].filter((i) => splitSel[i.uid]);
    if (!moving.length || !splitTo) return setMsg("Pick items and a destination table.");
    setItems((p) => p.filter((i) => !splitSel[i.uid]));
    setSent((p) => p.filter((i) => !splitSel[i.uid]));
    onSplit?.(moving, splitTo);
    setMsg(`Split ${moving.length} item(s) to ${splitTo}.`);
    setModal(null);
  }
  function openGuest() {
    setGForm(guest);
    setModal({ type: "guest" });
  }
  function saveGuest() {
    if (gForm.mobile && !/^\d{10}$/.test(gForm.mobile)) return setMsg("Enter a valid 10-digit mobile number.");
    setGuest({ name: gForm.name.trim(), mobile: gForm.mobile });
    setMsg("Guest saved.");
    setModal(null);
  }

  const keyAdd = (e, m) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      itemClick(m);
    }
  };

  /* ====================== RENDER ====================== */

  return (
    <div className="pnl act" id="p-order">
      <div className="pos-wrap">
        {/* ================= LEFT: MENU ================= */}
        <div className="pos-left">
          <div className="scan-bar">
            <input className="scan-inp" id="o-search" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="🔍 Search dish or type item code…" aria-label="Search dishes" />
            <button type="button" className={`btn${fav ? " selected" : ""}`} onClick={() => setFav((f) => !f)}>⭐ Favs</button>
            <button type="button" className="btn" onClick={goToFloor}>⬅ Tables</button>
          </div>

          <div className="cat-row" id="o-cats">
            {CATS.map((c) => (
              <button type="button" key={c} className={`cpill${cat === c && !fav ? " act" : ""}`}
                onClick={() => { setCat(c); setFav(false); }}>{c}</button>
            ))}
          </div>

          <div className="prod-grid" id="o-grid">
            {list.map((m) => {
              const off = m.off || m.left === 0;
              const count = items.filter((i) => i.id === m.id).reduce((t, i) => t + i.qty, 0);
              return (
                <div key={m.id} className={`pc${off ? " off" : ""}`} role="button" tabIndex={off ? -1 : 0}
                  aria-disabled={off} aria-label={`${m.name} ₹${m.price}`}
                  onClick={() => itemClick(m)} onKeyDown={(e) => keyAdd(e, m)}>
                  {count > 0 && <span className="pc-count">{count}</span>}
                  <div className="pc-top">
                    <span className={`veg${m.veg ? "" : " nv"}`} title={m.veg ? "Veg" : "Non-veg"} />
                    {m.fav && <span className="pc-fav">⭐</span>}
                  </div>
                  <span className="pc-icon">{m.icon}</span>
                  <div className="pc-name">{m.name}</div>
                  <div className="pc-price">₹{m.price}</div>
                  <div className="stn" style={{ color: STN[m.stn].color }}>{STN[m.stn].label}</div>
                  {off ? <span className="off-t">UNAVAILABLE</span> : m.left != null && <span className="left">{m.left} left</span>}
                </div>
              );
            })}
            {list.length === 0 && <div className="no-results">No dishes match your search</div>}
          </div>
        </div>

        {/* ================= RIGHT: CART ================= */}
        <div className="pos-right" id="o-cart">
          <div className="cart-top">
            <div className="cart-av">{curTable.slice(0, 2)}</div>
            <div className="cart-info">
              <div className="cart-cname">Table {curTable} · {currentTable.area}</div>
              <div className="cart-cmeta">
                {currentTable.order} · {pax} pax · {curTable.server} · <span className="st">{currentTable.status}</span>
                {prio && " · ⚡ Priority"}
              </div>
            </div>
            <button type="button" className="floor-link" onClick={goToFloor}>Floor ›</button>
          </div>

          <div className="cart-body">
            {!hasAny && sent.length === 0 && (
              <div className="cart-empty">
                <div className="ic">🍽</div>
                <div>No items yet</div>
                <div className="sub">Tap a dish to add it to this order</div>
              </div>
            )}

            {items.length > 0 && (
              <>
                <div className="sec">New items · not sent ({items.length})</div>
                {items.map((l) => (
                  <div className="cart-item" key={l.uid}>
                    <div>
                      <div className="ci-name">
                        {l.name}
                        <span className={`badge${l.hold ? " pre" : " grey"}`}>{l.hold ? "HELD" : "NOT SENT"}</span>
                      </div>
                      <div className="ci-sub">₹{l.price} each{itemNote(l) && ` · ${itemNote(l)}`}</div>
                    </div>
                    <div className="ci-right">
                      <div className="ci-r step">
                        <button type="button" onClick={() => qtyChg(l, -1)} aria-label={`Remove one ${l.name}`}>−</button>
                        <span className="ci-qty">{l.qty}</span>
                        <button type="button" onClick={() => qtyChg(l, 1)} aria-label={`Add one ${l.name}`}>+</button>
                      </div>
                      <div className="ci-r">
                        <span className="ci-price">{rupee(l.price * l.qty)}</span>
                        <button type="button" className="ico" title={l.hold ? "Release hold" : "Hold item"}
                          onClick={() => holdTog(l)} aria-label={l.hold ? `Release ${l.name}` : `Hold ${l.name}`}>
                          {l.hold ? "▶" : "⏸"}
                        </button>
                        <button type="button" className="ico" title="Remove" onClick={() => rmItem(l.uid)} aria-label={`Delete ${l.name}`}><Cross /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {sent.length > 0 && (
              <>
                <div className="sec">Sent to kitchen ({sent.length})</div>
                {sent.map((s) => {
                  const void_ = s.state === "void";
                  return (
                    <div className={`cart-item${void_ ? " void" : ""}`} key={s.uid}>
                      <div>
                        <div className="ci-name">
                          {s.name}
                          <span className={`badge${s.state === "ready" ? "" : void_ ? " void" : " pre"}`}>
                            {void_ ? "CANCELLED" : s.state === "ready" ? "READY" : "PREPARING"}
                          </span>
                        </div>
                        <div className="ci-sub">{itemNote(s) ? `${itemNote(s)} ` : ""}· {s.kot}</div>

                        {editingId === s.uid && (
                          <div className="sent-edit">
                            <input type="number" min="1" value={editQty} onChange={(e) => setEditQty(e.target.value)} aria-label={`Quantity for ${s.name}`} />
                            <button type="button" onClick={() => saveSentQty(s.uid)}>Save</button>
                            <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                          </div>
                        )}
                      </div>

                      <div className="ci-right">
                        <div className="ci-r">
                          <span className="ci-qty">{s.qty}</span>
                          {!void_ && (
                            <button type="button" className="ico" title="Modify instruction (needs PIN)" onClick={() => openMod(s)} aria-label={`Modify ${s.name}`}><Pencil /></button>
                          )}
                        </div>
                        <div className="ci-r">
                          <span className="ci-price">{rupee(s.price * s.qty)}</span>
                          {!void_ && (
                            <button type="button" className="ico" title="Cancel item (needs PIN)" onClick={() => cxSent(s)} aria-label={`Cancel ${s.name}`}><Cross /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* ================= BILL ================= */}
          <div className="bill-sum">
            <div className="sr"><span>Subtotal</span><span>{money(sub)}</span></div>
            <div className="sr"><span>GST (5%)</span><span>{money(gst)}</span></div>
            <div className="sr grand"><span>Running total</span><span>{rupee(Math.round(sub + gst))}</span></div>

            <button type="button" className="charge-btn" disabled={!fire.length} onClick={sendKOT}>
              🖨 Send KOT{fire.length ? ` (${fire.length} item${fire.length > 1 ? "s" : ""})` : ""}
            </button>
            <button type="button" className="btn" disabled={!canBill} onClick={requestBill}>
              {billReq ? "✔ Bill requested — cashier notified" : "🧾 Request bill"}
            </button>

            {msg && <div className="msg" role="status">{msg}</div>}
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="act-grid">
            <button type="button" className="cqa" onClick={() => setModal({ type: "xfer" })}>⇄ Transfer</button>
            <button type="button" className="cqa" onClick={() => setModal({ type: "merge" })}>⛓ Merge</button>
            <button type="button" className="cqa" onClick={openSplit}>✂ Split</button>
            <button type="button" className={`cqa${prio ? " prio" : ""}`} onClick={prioTog}>
              <svg className="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></svg>
              Priority
            </button>
          </div>
          <div className="cart-qa">
            <button type="button" className="cqa" onClick={() => setModal({ type: "cancel" })}>
              <svg className="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
              Cancel order
            </button>
            <button type="button" className="cqa" onClick={openGuest}>👤 Guest</button>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {modal?.type === "item" && (
        <Modal
          title={`${modItem.icon} ${modItem.name}`}
          onClose={() => setModal(null)}
          footer={
            <div className="item-modal-footer">
              <button
                type="button"
                className="btn"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-p"
                onClick={addFromModal}
              >
                Add {opt.qty} · {rupee(modUnit * opt.qty)}
              </button>
            </div>
          }
        >
          <div className="item-modal-content">
            {/* Item information */}
            <div className="item-modal-info">
              <span className="tag t-grey">
                {STN[modItem.stn].label.split(" ")[0]} Routes to{" "}
                {STN[modItem.stn].name}
              </span>

              <strong className="mono item-modal-price">
                {rupee(modItem.price)}
              </strong>
            </div>

            {/* Quantity */}
            <section className="item-modal-section">
              <div className="fl">Quantity</div>

              <div className="qty-ctrl item-modal-quantity">
                <button
                  type="button"
                  className="qb"
                  onClick={() =>
                    setOpt((o) => ({
                      ...o,
                      qty: Math.max(1, o.qty - 1),
                    }))
                  }
                >
                  −
                </button>

                <span className="qn">{opt.qty}</span>

                <button
                  type="button"
                  className="qb"
                  onClick={() =>
                    setOpt((o) => ({
                      ...o,
                      qty: o.qty + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
            </section>

            {/* Spice level */}
            {SPICY.includes(modItem.cat) && (
              <section className="item-modal-section">
                <div className="fl">Spice level</div>

                <div className="item-modal-options">
                  {SPICE_LEVELS.map((s) => (
                    <button
                      type="button"
                      key={s}
                      className={`chip${opt.spice === s ? " sel" : ""}`}
                      onClick={() =>
                        setOpt((o) => ({ ...o, spice: s }))
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Add-ons */}
            {modAdds.length > 0 && (
              <section className="item-modal-section">
                <div className="fl">Add-ons &amp; modifiers</div>

                <div className="item-modal-options">
                  {modAdds.map(([n, p]) => (
                    <button
                      type="button"
                      key={n}
                      className={`chip${opt.addons.includes(n) ? " sel" : ""}`}
                      onClick={() => toggleAddon(n)}
                    >
                      {n}
                      {p ? ` +${rupee(p)}` : ""}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Cooking instructions */}
            <section className="item-modal-section">
              <label className="fl" htmlFor="mod-note">
                Cooking note / special instruction
              </label>

              <textarea
                id="mod-note"
                className="inp item-modal-note"
                rows={3}
                value={opt.note}
                onChange={(e) =>
                  setOpt((o) => ({ ...o, note: e.target.value }))
                }
                placeholder="e.g. less oil, no onion, serve with starters"
              />
            </section>

            {/* Hold option */}
            <label className="chk item-modal-hold">
              <input
                type="checkbox"
                checked={opt.hold}
                onChange={(e) =>
                  setOpt((o) => ({ ...o, hold: e.target.checked }))
                }
              />

              <span>
                <strong>Hold order</strong>
                <small>Don't send to kitchen yet (course timing)</small>
              </span>
            </label>
          </div>
        </Modal>
      )}


      {modal?.type === "kot" && (
        <Modal title={`🖨 ${modal.ks.length} KOT${modal.ks.length > 1 ? "s" : ""} sent`} onClose={() => setModal(null)}
          footer={<button type="button" className="btn btn-p" onClick={() => setModal(null)}>Done</button>}>
          <p className="ci-sub">Items were split by station and routed to each kitchen printer and the KOT display.</p>
          <div className="kot-prev">
            {modal.ks.map((k) => <Thermal key={k.no} k={k} name={restaurantName} />)}
          </div>
        </Modal>
      )}

      {modal?.type === "mod" && (
        <Modal title={`✎ Modify ${modal.item.name}`} onClose={() => setModal(null)}
          footer={<>
            <button type="button" className="btn" onClick={() => setModal(null)}>Cancel</button>
            <button type="button" className="btn btn-p" onClick={doModSent}>Send modification</button>
          </>}>
          <label className="fl" htmlFor="mod2">New instruction for kitchen</label>
          <textarea id="mod2" className="inp" rows={3} value={modNote} onChange={(e) => setModNote(e.target.value)} />
          <p className="ci-sub" style={{ marginTop: 8 }}>
            A modification KOT prints at {STN[modal.item.stn]?.name} with the revised note. Needs manager PIN.
          </p>
        </Modal>
      )}

      {modal?.type === "xfer" && (
        <Modal title="⇄ Transfer table" onClose={() => setModal(null)}
          footer={<button type="button" className="btn" onClick={() => setModal(null)}>Close</button>}>
          <p className="ci-sub">Move {curTable} and its KOT history to another table.</p>
          <div className="row wrap">
            {freeTables.length === 0 && <span className="muted">No free tables</span>}
            {freeTables.map((t) => (
              <button type="button" key={t.id} className="chip" onClick={() => doXfer(t.id)}>
                {t.id} {t.seats != null && <span className="c">{t.seats}</span>}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {modal?.type === "merge" && (
        <Modal title="⛓ Merge tables" onClose={() => setModal(null)}
          footer={<button type="button" className="btn" onClick={() => setModal(null)}>Close</button>}>
          <p className="ci-sub">Pull another table's order into {curTable}. Their table is freed.</p>
          <div className="row wrap">
            {openTables.length === 0 && <span className="muted">No other open tables</span>}
            {openTables.map((t) => (
              <button type="button" key={t.id} className="chip" onClick={() => doMerge(t)}>
                {t.id}{t.total != null && ` · ${rupee(t.total)}`}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {modal?.type === "split" && (
        <Modal title="✂ Split order" onClose={() => setModal(null)}
          footer={<>
            <button type="button" className="btn" onClick={() => setModal(null)}>Cancel</button>
            <button type="button" className="btn btn-p" onClick={doSplit}>Split</button>
          </>}>
          <p className="ci-sub">Select items to move to a new bill on another table (split by customer or group).</p>
          {[...items, ...liveSent].map((i) => (
            <label className="chk" key={i.uid}>
              <input type="checkbox" checked={!!splitSel[i.uid]}
                onChange={(e) => setSplitSel((s) => ({ ...s, [i.uid]: e.target.checked }))} />
              {i.qty}× {i.name}
              <span className="right mono">{rupee(i.price * i.qty)}</span>
            </label>
          ))}
          <div className="fl">Move to table</div>
          <div className="row wrap">
            {freeTables.length === 0 && <span className="muted">No free tables</span>}
            {freeTables.map((t) => (
              <button type="button" key={t.id} className={`chip${splitTo === t.id ? " sel" : ""}`} onClick={() => setSplitTo(t.id)}>{t.id}</button>
            ))}
          </div>
        </Modal>
      )}

      {modal?.type === "guest" && (
        <Modal title="👤 Guest details" onClose={() => setModal(null)}
          footer={<>
            <button type="button" className="btn" onClick={() => setModal(null)}>Cancel</button>
            <button type="button" className="btn btn-p" onClick={saveGuest}>Save</button>
          </>}>
          <label className="fl" htmlFor="gc-n">Name</label>
          <input id="gc-n" className="inp" value={gForm.name} onChange={(e) => setGForm((f) => ({ ...f, name: e.target.value }))} />
          <label className="fl" htmlFor="gc-m">Mobile</label>
          <input id="gc-m" className="inp" type="tel" inputMode="numeric" maxLength={10} value={gForm.mobile}
            onChange={(e) => setGForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, "") }))} />
        </Modal>
      )}

      {modal?.type === "cancel" && (
        <Modal title="🗑 Cancel order" onClose={() => setModal(null)}
          footer={<>
            <button type="button" className="btn" onClick={() => setModal(null)}>Keep order</button>
            <button type="button" className="btn btn-p" onClick={confirmCancel}>Confirm cancel</button>
          </>}>
          <p>Cancel order {curTable}?</p>
          <p className="ci-sub">
            {liveSent.length
              ? "Items already sent to the kitchen will get a cancellation KOT, and a manager PIN is required."
              : "All new items will be removed."}
          </p>
        </Modal>
      )}
    </div>
  );
}
