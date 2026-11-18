import { useMemo, useState } from "react";
import Modal from "./MenuModal";
import { GuestShell, MenuView, unitPrice } from "./GuestPreview";
import { FLOOR, inr } from "./MenuData";

export const STEPS = [["new", "Received"], ["kitchen", "In kitchen"], ["ready", "Ready"], ["served", "Served"]];
export const NEXT_STATUS = { new: "kitchen", kitchen: "ready", ready: "served" };
const HELP = [["waiter", "🙋", "Call waiter"], ["bill", "🧾", "Request bill"], ["water", "💧", "Water"], ["clean", "🧽", "Clean table"]];
const timeOf = (t) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function GuestViewModal({
  tableId, items, cats, design, offers, addons = {}, orders = [], calls = [],
  onPlaceOrder, onAdvance, onCall, onClose,
}) {
  const table = FLOOR.find((t) => t.id === tableId);
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("menu");
  const [cart, setCart] = useState([]);       // [{ key, itemId?, name, icon, detail, unit, qty }]
  const [sheet, setSheet] = useState(null);   // dish being customised

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cart.reduce((s, l) => s + l.qty * l.unit, 0);
  const qtyByItem = useMemo(
    () => cart.reduce((m, l) => (l.itemId ? ((m[l.itemId] = (m[l.itemId] || 0) + l.qty), m) : m), {}),
    [cart]
  );

  const addLine = (line) =>
    setCart((c) => {
      const hit = c.find((l) => l.key === line.key);
      return hit ? c.map((l) => (l.key === line.key ? { ...l, qty: l.qty + line.qty } : l)) : [...c, line];
    });
  const addOffer = (o) =>
    addLine({ key: `offer-${o.id}`, name: o.name, icon: "🎁", detail: o.dishes.join(" + "), unit: o.price, qty: 1 });
  const changeQty = (key, d) =>
    setCart((c) => c.map((l) => (l.key === key ? { ...l, qty: l.qty + d } : l)).filter((l) => l.qty > 0));

  const place = () => {
    if (!cart.length) return;
    onPlaceOrder({ table: tableId, lines: cart, total: cartTotal });
    setCart([]);
    setScreen("status");
  };

  return (
    <Modal title={`Guest view · Table ${tableId}`} size="sm" onClose={onClose}>
      <GuestShell
        table={table} layout={design.layout} lang={lang} setLang={setLang}
        screen={screen} setScreen={setScreen} cartCount={cartCount}
        overlay={sheet && (
          <ItemSheet item={sheet} mods={addons[sheet.cat] ?? []} onClose={() => setSheet(null)}
            onAdd={(line) => { addLine(line); setSheet(null); }} />
        )}
      >
        {screen === "menu" && (
          <>
            <MenuView items={items} cats={cats} design={design} offers={offers} lang={lang}
              qty={qtyByItem} onItem={setSheet} onOffer={addOffer} />
            {cartCount > 0 && (
              <button className="rm-cartbar" onClick={() => setScreen("cart")}>
                <span>🛒 {cartCount} item{cartCount > 1 ? "s" : ""}</span><b>{inr(cartTotal)} · View order</b>
              </button>
            )}
          </>
        )}

        {screen === "cart" && (
          <div className="rm-screen">
            <h4>Your order · Table {tableId}</h4>
            {!cart.length ? (
              <div className="rm-empty">
                <div className="rm-muted">Your order is empty.</div>
                <button className="rm-btn" onClick={() => setScreen("menu")}>Browse menu</button>
              </div>
            ) : (
              <>
                {cart.map((l) => (
                  <div className="rm-cline" key={l.key}>
                    <span className="rm-cline__icon">{l.icon}</span>
                    <span className="rm-cline__txt"><b>{l.name}</b>{l.detail && <span className="rm-muted">{l.detail}</span>}</span>
                    <span className="rm-stepper">
                      <button onClick={() => changeQty(l.key, -1)} aria-label="Less">−</button>
                      <b>{l.qty}</b>
                      <button onClick={() => changeQty(l.key, 1)} aria-label="More">+</button>
                    </span>
                    <b className="rm-cline__sum">{inr(l.qty * l.unit)}</b>
                  </div>
                ))}
                <div className="rm-total"><span>Total</span><b>{inr(cartTotal)}</b></div>
                <button className="rm-btn rm-btn--primary rm-block" onClick={place}>Place order</button>
              </>
            )}
          </div>
        )}

        {screen === "status" && (
          <div className="rm-screen">
            <h4>Order status</h4>
            {!orders.length && <div className="rm-muted">No orders yet. Place an order and it will appear here.</div>}
            {orders.map((o) => {
              const at = STEPS.findIndex(([k]) => k === o.status);
              return (
                <div className="rm-card rm-order" key={o.id}>
                  <div className="rm-row rm-row--between"><b>Order {o.id}</b><span className="rm-muted">{timeOf(o.at)}</span></div>
                  <div className="rm-muted">{o.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}</div>
                  <ol className="rm-steps">
                    {STEPS.map(([k, label], idx) => (
                      <li key={k} className={idx <= at ? "rm-steps__on" : ""}>{label}</li>
                    ))}
                  </ol>
                  <div className="rm-row rm-row--between">
                    <b>{inr(o.total)}</b>
                    {NEXT_STATUS[o.status] && (
                      <button className="rm-btn" onClick={() => onAdvance(o.id)} title="Demo only: the kitchen display normally updates this">
                        Demo: advance
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {screen === "help" && (
          <div className="rm-screen">
            <h4>How can we help?</h4>
            <div className="rm-help">
              {HELP.map(([k, icon, label]) => {
                const waiting = calls.some((c) => c.type === k && c.open);
                return (
                  <button key={k} className="rm-help__btn" disabled={waiting} onClick={() => onCall(tableId, k)}>
                    <span>{icon}</span>{label}{waiting && <small>Sent</small>}
                  </button>
                );
              })}
            </div>
            {calls.length > 0 && (
              <div className="rm-muted" style={{ marginTop: 12 }}>
                {calls.map((c) => `${HELP.find(([k]) => k === c.type)?.[2]} · ${timeOf(c.at)}${c.open ? " · waiting" : " · done"}`).join("  |  ")}
              </div>
            )}
          </div>
        )}
      </GuestShell>
    </Modal>
  );
}

/* bottom sheet for one dish: quantity, add-ons, note */
function ItemSheet({ item, mods, onAdd, onClose }) {
  const [qty, setQty] = useState(1);
  const [picked, setPicked] = useState([]);
  const [note, setNote] = useState("");
  const extra = mods.filter(([n]) => picked.includes(n)).reduce((s, [, p]) => s + p, 0);
  const unit = unitPrice(item) + extra;
  const toggle = (n) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  const add = () =>
    onAdd({
      key: `${item.id}|${[...picked].sort().join(",")}|${note.trim()}`,
      itemId: item.id, name: item.name, icon: item.icon, unit, qty,
      detail: [...picked, note.trim()].filter(Boolean).join(" · "),
    });

  return (
    <div className="rm-sheet" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rm-sheet__box">
        <div className="rm-row rm-row--between">
          <b>{item.icon} {item.name}</b>
          <button className="rm-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {item.desc && <div className="rm-muted">{item.desc}</div>}
        {mods.length > 0 && (
          <div className="rm-sheet__mods">
            {mods.map(([n, p]) => (
              <label className="rm-check" key={n}>
                <input type="checkbox" checked={picked.includes(n)} onChange={() => toggle(n)} /> {n}{p ? ` (+${inr(p)})` : ""}
              </label>
            ))}
          </div>
        )}
        <input className="rm-input" placeholder="Note for the kitchen (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="rm-row rm-row--between" style={{ marginTop: 10 }}>
          <span className="rm-stepper">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Less">−</button>
            <b>{qty}</b>
            <button onClick={() => setQty((q) => q + 1)} aria-label="More">+</button>
          </span>
          <button className="rm-btn rm-btn--primary" onClick={add}>Add · {inr(unit * qty)}</button>
        </div>
      </div>
    </div>
  );
}
