import { useEffect, useMemo, useRef, useState } from "react";
import "../../../assets/styles/selforder.css";

const CATEGORIES = ["All", "Starters", "Main Course", "Biryani", "Breads", "Tiffin", "Beverages", "Desserts"];

const MENU = [
  { id: 1, name: "Chicken 65", price: 220, cat: "Starters" },
  { id: 2, name: "Gobi Manchurian", price: 170, cat: "Starters" },
  { id: 3, name: "Paneer Tikka", price: 240, cat: "Starters" },
  { id: 4, name: "Chicken Tikka", price: 260, cat: "Starters" },
  { id: 5, name: "Tandoori Chicken (Half)", price: 300, cat: "Starters" },
  { id: 6, name: "Paneer Butter Masala", price: 280, cat: "Main Course" },
  { id: 7, name: "Butter Chicken", price: 320, cat: "Main Course" },
  { id: 8, name: "Chicken Chettinad", price: 300, cat: "Main Course" },
  { id: 9, name: "Dal Tadka", price: 190, cat: "Main Course" },
  { id: 10, name: "Veg Kurma", price: 180, cat: "Main Course" },
  { id: 11, name: "Chicken Biryani", price: 220, cat: "Biryani" },
  { id: 12, name: "Mutton Biryani", price: 320, cat: "Biryani" },
  { id: 13, name: "Veg Biryani", price: 180, cat: "Biryani" },
  { id: 14, name: "Egg Biryani", price: 190, cat: "Biryani" },
  { id: 15, name: "Butter Naan", price: 60, cat: "Breads" },
  { id: 16, name: "Garlic Naan", price: 70, cat: "Breads" },
  { id: 17, name: "Tandoori Roti", price: 35, cat: "Breads" },
  { id: 18, name: "Kerala Parotta", price: 30, cat: "Breads" },
  { id: 19, name: "Kothu Parotta", price: 190, cat: "Breads" },
  { id: 20, name: "Masala Dosa", price: 110, cat: "Tiffin" },
  { id: 21, name: "Idli (2 pcs)", price: 60, cat: "Tiffin" },
  { id: 22, name: "Ghee Pongal", price: 90, cat: "Tiffin" },
  { id: 23, name: "Filter Coffee", price: 50, cat: "Beverages" },
  { id: 24, name: "Masala Chai", price: 40, cat: "Beverages" },
  { id: 25, name: "Fresh Lime Soda", price: 70, cat: "Beverages" },
  { id: 26, name: "Mint Mojito", price: 120, cat: "Beverages" },
  { id: 27, name: "Mango Lassi", price: 90, cat: "Beverages" },
  { id: 28, name: "Cold Coffee", price: 110, cat: "Beverages" },
  { id: 29, name: "Gulab Jamun (2)", price: 90, cat: "Desserts" },
  { id: 30, name: "Elaneer Payasam", price: 100, cat: "Desserts" },
  { id: 31, name: "Ice Cream Sundae", price: 140, cat: "Desserts" },
  { id: 32, name: "Brownie with Ice Cream", price: 160, cat: "Desserts" },
];

// Sample free tables for the dropdown; replace with your live table data.
const FREE_TABLES = ["T1", "T4", "T5", "F1", "F4", "R2", "R3"];

const inr = (n) => "₹" + n.toLocaleString("en-IN");



const Svg = ({ children, size = 16, sw = 2 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <rect x="6" y="2" width="12" height="20" rx="2.500" fill="#7a5cf0" />
    <rect x="8" y="5" width="8" height="10" rx="1" fill="#d9d0ff" />
  </svg>
);
const SunIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);
const MoonIcon = () => (
  <Svg>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Svg>
);
const TriangleIcon = () => (
  <Svg size={11} sw={2.2}>
    <path d="M7 5v14l12-7L7 5Z" />
  </Svg>
);

export default function SelfOrder({ onPlaceOrder }) {
  const [table, setTable] = useState("");
  const [guests, setGuests] = useState(2);
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({}); // { [itemId]: qty }
  const [orders, setOrders] = useState([]);
  const kotCounter = useRef(0);
  const cartRef = useRef(null);


  const visibleItems = useMemo(
    () => (category === "All" ? MENU : MENU.filter((m) => m.cat === category)),
    [category]
  );

  const lines = useMemo(
    () =>
      MENU.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id], lineTotal: cart[m.id] * m.price })),
    [cart]
  );
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  const change = (id, delta) =>
    setCart((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const canPlace = lines.length > 0 && table !== "";

  const placeOrder = () => {
    kotCounter.current += 1;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const order = {
      kot: "KOT-" + String(kotCounter.current).padStart(3, "0"),
      table,
      guests,
      count: itemCount,
      total: subtotal,
      time,
      lines,
    };
    setOrders((prev) => [order, ...prev]);
    setCart({});
    if (onPlaceOrder) onPlaceOrder(order);
  };

  return (
    <div className="so" >
      <header className="so-header">
        <div className="so-title-group">
          <h1 className="so-title">
            <PhoneIcon />
            <span>Self-service order</span>
          </h1>
          <span className="so-tag">dine-in · guest orders from table QR / kiosk</span>
        </div>
    
      </header>

      <main className="so-main">
        <div className="so-left">
          <section className="so-panel so-controls" aria-label="Order options">
            <div className="so-fields">
              <label className="so-field">
                <span className="so-field-label">Table</span>
                <select value={table} onChange={(e) => setTable(e.target.value)} className="so-select">
                  <option value="">Select free table</option>
                  {FREE_TABLES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="so-field">
                <span className="so-field-label">Guests</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  inputMode="numeric"
                  className="so-input"
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                />
              </label>
            </div>

            <div className="so-chips" role="tablist" aria-label="Menu categories">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={category === c}
                  className={"so-chip" + (category === c ? " is-active" : "")}
                  onClick={() => setCategory(c)}
                >
                  {c === "Starters" && <TriangleIcon />}
                  {c}
                </button>
              ))}
            </div>
          </section>

          <section className="so-menu" aria-label="Menu">
            {visibleItems.map((m) => (
              <button
                key={m.id}
                type="button"
                className={"so-item" + (cart[m.id] ? " is-in-cart" : "")}
                onClick={() => change(m.id, 1)}
                aria-label={`Add ${m.name}, ${inr(m.price)}`}
              >
                <span className="so-item-name">{m.name}</span>
                <span className="so-item-price">{inr(m.price)}</span>
                {cart[m.id] > 0 && <span className="so-item-badge">{cart[m.id]}</span>}
              </button>
            ))}
          </section>
        </div>

        <aside className="so-right">
          <section className="so-panel" ref={cartRef} aria-label="Guest cart">
            <h2 className="so-panel-title">Guest cart</h2>

            {lines.length === 0 ? (
              <p className="so-muted so-empty">Cart is empty</p>
            ) : (
              <ul className="so-cart">
                {lines.map((l) => (
                  <li key={l.id} className="so-cart-line">
                    <div className="so-cart-name">
                      <span className="so-strong">{l.name}</span>
                      <span className="so-sub">{inr(l.price)} each</span>
                    </div>
                    <div className="so-stepper" role="group" aria-label={`Quantity of ${l.name}`}>
                      <button type="button" onClick={() => change(l.id, -1)} aria-label={`Remove one ${l.name}`}>−</button>
                      <span className="so-mono">{l.qty}</span>
                      <button type="button" onClick={() => change(l.id, 1)} aria-label={`Add one ${l.name}`}>+</button>
                    </div>
                    <span className="so-mono so-line-total">{inr(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="so-subtotal">
              <span>Subtotal (ex-tax)</span>
              <span className="so-mono">{inr(subtotal)}</span>
            </div>

            <button type="button" className="so-place" disabled={!canPlace} onClick={placeOrder}>
              Place order → send KOT
            </button>
            {lines.length > 0 && table === "" && <p className="so-hint">Select a table to place the order.</p>}
          </section>

          <section className="so-panel" aria-label="Live orders">
            <h2 className="so-panel-title">Self-service orders live</h2>
            {orders.length === 0 ? (
              <p className="so-muted so-empty">None yet</p>
            ) : (
              <ul className="so-live">
                {orders.map((o) => (
                  <li key={o.kot} className="so-live-item">
                    <div className="so-live-top">
                      <span className="so-mono so-strong">{o.kot}</span>
                      <span className="so-live-badge">Sent to kitchen</span>
                    </div>
                    <p className="so-live-meta">
                      Table {o.table} · {o.guests} guest{o.guests > 1 ? "s" : ""} · {o.count} item{o.count > 1 ? "s" : ""}
                    </p>
                    <p className="so-live-meta so-live-foot">
                      <span className="so-mono">{o.time}</span>
                      <span className="so-mono so-strong">{inr(o.total)}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </main>

      {itemCount > 0 && (
        <div className="so-bar">
          <span>
            {itemCount} item{itemCount > 1 ? "s" : ""} · <strong className="so-mono">{inr(subtotal)}</strong>
          </span>
          <button
            type="button"
            className="so-bar-btn"
            onClick={() => cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            View cart
          </button>
        </div>
      )}
    </div>
  );
}