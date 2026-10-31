
import React, { useEffect, useState } from "react";
import "../../../assets/styles/billing.css";
import SplitPaymentModal from "./SplitPaymentModal";
import VoidModal from "./VoidModal";

const inr = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const POINTS_TO_REDEEM = 168;

const STATUS = {
  "Bill requested": "var(--red)",
  Dining: "var(--purple)",
  "In kitchen": "var(--a2)",
  "Food ready": "var(--green)",
  Ordering: "var(--blue)",
};

const INITIAL = [
  {
    id: "O1",
    no: "T2",
    status: "Bill requested",
    type: "Dine-in",
    captain: "Ravi K.",
    min: 42,
    zone: "AC Hall",
    ref: "AN-0065",
    pax: 3,
    kot: "0118, 0119, 0120, 0121",
    items: [
      ["Chicken Biryani", 2, 220],
      ["Paneer Tikka", 1, 240],
      ["Mango Lassi", 2, 90],
      ["Gulab Jamun (2)", 2, 90],
    ],
  },
  {
    id: "O6",
    no: "F3",
    status: "Dining",
    type: "Dine-in",
    captain: "Priya S.",
    min: 48,
    zone: "Family",
    ref: "AN-0070",
    pax: 4,
    kot: "0130",
    items: [
      ["Veg Thali", 2, 180],
      ["Butter Naan", 4, 40],
      ["Masala Soda", 2, 60],
      ["Rasmalai", 1, 90],
    ],
  },
  {
    id: "O5",
    no: "F2",
    status: "In kitchen",
    type: "Dine-in",
    captain: "Ravi K.",
    min: 30,
    zone: "Family",
    ref: "AN-0068",
    pax: 6,
    kot: "0127",
    items: [
      ["Mutton Biryani", 4, 320, true],
      ["Chicken 65", 2, 220, true],
      ["Raita", 3, 40, false],
      ["Fresh Lime", 3, 60, true],
      ["Brownie", 2, 120, true],
      ["Water Bottle", 2, 20, true],
    ],
  },
  {
    id: "O9",
    no: "DEL-01",
    status: "Food ready",
    type: "Delivery",
    source: "Swiggy",
    captain: "Priya S.",
    min: 25,
    ref: "SW-8841",
    items: [
      ["Chicken Biryani", 2, 220],
      ["Raita", 2, 40],
    ],
  },
  {
    id: "O2",
    no: "T4",
    status: "Food ready",
    type: "Dine-in",
    captain: "Priya S.",
    min: 21,
    zone: "AC Hall",
    ref: "AN-0066",
    pax: 2,
    kot: "0122",
    items: [
      ["Fish Fry", 1, 320],
      ["Fried Rice", 2, 180],
      ["Lime Soda", 2, 60],
      ["Ice Cream", 2, 80],
    ],
  },
  {
    id: "O8",
    no: "TA-01",
    status: "Food ready",
    type: "Takeaway",
    captain: "Ravi K.",
    min: 15,
    guest: "Suresh Rajan",
    mobile: "9876543210",
    ref: "AN-0069",
    loyalty: {
      visits: 18,
      lifetime: 31480,
      points: 1240,
    },
    items: [
      ["Family Pack Biryani", 1, 640],
      ["Chicken 65", 1, 200],
    ],
  },
  {
    id: "O3",
    no: "T5",
    status: "In kitchen",
    type: "Dine-in",
    captain: "Karthik M.",
    min: 13,
    zone: "AC Hall",
    ref: "AN-0067",
    pax: 2,
    kot: "0124",
    items: [
      ["Prawn Masala", 1, 520],
      ["Appam", 4, 70],
    ],
  },
  {
    id: "O7",
    no: "R1",
    status: "In kitchen",
    type: "Dine-in",
    captain: "Divya R.",
    min: 8,
    zone: "Rooftop",
    ref: "AN-0071",
    pax: 3,
    kot: "0133",
    items: [
      ["Tandoori Platter", 1, 540],
      ["Naan", 3, 40],
      ["Cold Coffee", 3, 70],
    ],
  },
  {
    id: "O4",
    no: "T1",
    status: "Ordering",
    type: "Dine-in",
    captain: "Divya R.",
    min: 4,
    zone: "AC Hall",
    ref: "AN-0072",
    pax: 2,
    kot: "-",
    items: [
      ["Veg Biryani", 1, 180],
      ["Cold Coffee", 2, 78],
    ],
  },
];

const FILTERS = [
  "All",
  "Bill requested",
  "Dine-in",
  "Takeaway",
  "Delivery",
  "Held",
];

// Normalize the takeaway order when initializing state.
// This also provides a fallback if O8 has no loyalty property.
function initializeOrders() {
  return INITIAL.map((order) =>
    order.id === "O8"
      ? {
        ...order,
        loyalty: {
          visits: 18,
          lifetime: 31480,
          points: 1240,
          ...order.loyalty,
        },
      }
      : order
  );
}

// Calculate the bill, including optional loyalty redemption.
function calc(o, dtype, dval, svc, redeemAmount = 0) {
  const sub = o.items.reduce(
    (sum, [, quantity, price]) => sum + quantity * price,
    0
  );

  const rawDiscount =
    dtype === "pct" ? (sub * Number(dval || 0)) / 100 : Number(dval || 0);

  const disc = Math.min(Math.max(rawDiscount, 0), sub);

  const afterDiscount = sub - disc;

  // Loyalty redemption cannot exceed the remaining bill.
  const loyaltyRedeem = Math.min(
    Math.max(Number(redeemAmount || 0), 0),
    afterDiscount
  );

  const taxable = afterDiscount - loyaltyRedeem;

  const service = (taxable * Number(svc || 0)) / 100;
  const cgst = taxable * 0.025;
  const sgst = taxable * 0.025;

  const exact = taxable + service + cgst + sgst;
  const total = Math.max(0, Math.round(exact));

  return {
    sub,
    disc,
    loyaltyRedeem,
    service,
    cgst,
    sgst,
    round: total - exact,
    total,
  };
}

const Icon = ({ d }) => (
  <svg className="bi" viewBox="0 0 24 24" aria-hidden="true">
    {d}
  </svg>
);

function match(o, f) {
  if (f === "All") return !o.held;
  if (f === "Held") return Boolean(o.held);
  if (f === "Bill requested") {
    return !o.held && o.status === f;
  }

  return !o.held && o.type === f;
}

function OrderList({
  orders,
  sel,
  setSel,
  filter,
  setFilter,
  q,
  setQ,
  onNew,
}) {
  const count = (f) => orders.filter((o) => match(o, f)).length;

  const search = q.trim().toLowerCase();

  const list = orders.filter(
    (o) =>
      match(o, filter) &&
      (!search ||
        [o.no, o.ref, o.captain, o.guest]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search))
  );

  return (
    <div className="pos-left">
      <div className="scan-bar">
        <input
          className="scan-inp"
          placeholder="🔍 Find table, order no. or captain…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Find order"
        />

        <button
          className="bill-cat-btn btn-sm btn-p"
          onClick={() => onNew("Takeaway")}
        >
          <Icon
            d={
              <>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
              </>
            }
          />
          Counter Takeaway
        </button>

        <button
          className="bill-cat-btn btn-sm"
          onClick={() => onNew("Self-service")}
        >
          <Icon
            d={
              <>
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M12 18h.01" />
              </>
            }
          />
          Self-service
        </button>

        <button
          className="bill-cat-btn btn-sm"
          onClick={() => onNew("Delivery")}
        >
          <Icon
            d={
              <>
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="18.5" cy="17.5" r="3.5" />
                <path d="M15 6h-3l-3 6 4 1 2 4.5M12 6l-1-3H8" />
              </>
            }
          />
          Delivery
        </button>
      </div>

      <div className="cat-row">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={"cpill" + (filter === f ? " act" : "")}
            onClick={() => setFilter(f)}
          >
            {f}{" "}
            <span className="mono" style={{ opacity: 0.6 }}>
              {count(f)}
            </span>
          </button>
        ))}
      </div>

      <div className="ocards">
        {list.length === 0 && (
          <div className="empty">
            No orders match. Clear the search or pick another filter.
          </div>
        )}

        {list.map((o) => {
          const t = calc(o, "pct", 0, 0).total;

          return (
            <div
              key={o.id}
              role="button"
              tabIndex={0}
              className={
                "oc" +
                (sel === o.id ? " sel" : "") +
                (o.status === "Bill requested" ? " hot" : "")
              }
              onClick={() => setSel(o.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSel(o.id);
                }
              }}
            >
              <div className="oc-h">
                <span className="oc-n">{o.no}</span>
                <span
                  className="st"
                  style={{
                    color: o.held
                      ? "var(--muted)"
                      : STATUS[o.status] || "var(--muted)",
                  }}
                >
                  {o.held ? "Held" : o.status}
                </span>
              </div>

              <div className="oc-m">
                {o.source || o.type} · {o.captain}
                <br />
                {o.items.length} items · {o.min} min
                {o.guest && (
                  <>
                    <br />👤 {o.guest}
                  </>
                )}
              </div>

              <div className="oc-t">{inr(t)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BillPanel({ order, onPaid, onHold, onVoid, toast, onReopen }) {
  const [mobile, setMobile] = useState(order?.mobile || "");
  const [name, setName] = useState(order?.guest || "");
  const [wa, setWa] = useState(true);
  const [promo, setPromo] = useState(false);
  const [dtype, setDtype] = useState("pct");
  const [dval, setDval] = useState(0);
  const [svc, setSvc] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [pay, setPay] = useState("cash");
  const [tend, setTend] = useState("");
  const [redeemPoints, setRedeemPoints] = useState(false);

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitAmounts, setSplitAmounts] = useState(null);


  if (!order) {
    return (
      <div className="pos-right">
        <div className="bill-empty">
          <div className="bill-empty-icon">🧾</div>
          <h3>No order selected</h3>
          <p>
            Select an order from the left panel to view items, calculate the
            bill, and proceed to payment.
          </p>
        </div>
      </div>
    );
  }

  const loyalty =
    order.type === "Takeaway"
      ? order.loyalty || {
        visits: 0,
        lifetime: 0,
        points: 0,
      }
      : null;

  const canRedeem =
    order.type === "Takeaway" &&
    loyalty.points >= POINTS_TO_REDEEM;

  const redeemAmount = redeemPoints && canRedeem ? POINTS_TO_REDEEM : 0;

  const t = calc(order, dtype, dval, svc, redeemAmount);

  const needsPin =
    dtype === "pct"
      ? Number(dval) > 10
      : t.sub > 0 && Number(dval) / t.sub > 0.1;

  const mobileBad = mobile.length > 0 && mobile.length !== 10;
  const change = tend !== "" ? Number(tend) - t.total : null;
  const cashShort = pay === "cash" && tend !== "" && change < 0;
  const unsentItems = order.items.filter(
    (item) => item[3] === false
  ).length;

  const blocked = needsPin || mobileBad || cashShort || order.status === "Ordering" || unsentItems > 0 || (pay === "split" && !splitAmounts);


  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();

    if (c === "WELCOME5") {
      setDtype("pct");
      setDval(5);
      toast("Coupon applied: 5% off");
    } else {
      toast(c ? "Coupon not valid" : "Enter a coupon code");
    }
  };

  const charge = () => {
    if (needsPin) {
      toast("Discount above 10% needs manager PIN");
      return;
    }

    if (mobileBad) {
      toast("Enter a valid 10-digit mobile number");
      return;
    }

    if (cashShort) {
      toast("Cash received is less than the bill total");
      return;
    }

    onPaid(order.id, {
      paymentMethod: pay,
      total: t.total,
      loyaltyRedeemed: t.loyaltyRedeem,
      pointsRedeemed: redeemAmount,
      guestName: name || order.guest || "Guest",
      mobile,
      whatsappReceipt: wa && mobile.length === 10,
      promotionalOptIn: promo,
      splitAmounts: pay === "split" ? splitAmounts : null,
    });

    toast(
      `${order.no} paid · ${inr(t.total)}` +
      (redeemAmount > 0 ? ` · ${redeemAmount} points redeemed` : "") +
      (wa && mobile.length === 10 ? " · receipt sent on WhatsApp" : "")
    );
  };



  return (
    <div className="pos-right">
      <div className="cart-top">
        <div
          className="cart-av"
          style={{
            background: "var(--accent-dim)",
            color: "var(--accent)",
          }}
        >
          {order.no}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cart-cname">
            {order.no}
            {order.zone ? " · " + order.zone : ""}
          </div>

          <div className="cart-cmeta mono">
            {order.ref} · {order.captain}
            {order.pax ? ` · ${order.pax} pax` : ""}
            {order.kot ? ` · KOT ${order.kot}` : ""}
          </div>
        </div>
      </div>

      <div className="cart-body">
        {order.status === "In kitchen" && unsentItems > 0 && (
          <div className="alert r" style={{ margin: "8px" }}>
            <span>⚠</span>
            <span>
              {unsentItems} item(s) not sent to kitchen.
              Send KOT or remove before charging.
            </span>
          </div>
        )}
        {order.status === "Ordering" && (
          <div className="alert r" style={{ margin: "8px" }}>
            <span>⚠</span>
            <span>
              2 item(s) not sent to kitchen. Send KOT or remove before charging.
            </span>
          </div>
        )}
        {order.held && (
          <div className="alert r" style={{ margin: "8px" }}>
            <span>⏸</span>
            <span style={{ flex: 1 }}>Bill on hold.</span>

            <button
              className="bill-cat-btn btn-sm btn-p"
              onClick={() => onReopen(order.id)}
            >
              <svg
                className="bi"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
              </svg>
              Reopen
            </button>
          </div>
        )}
        <div className="cart-sec">Guest &amp; WhatsApp receipt</div>

        <div className="fld">
          <label htmlFor="bp-mobile">Mobile</label>
          <input
            className="inp"
            id="bp-mobile"
            maxLength={10}
            inputMode="numeric"
            placeholder="10-digit WhatsApp no."
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
          />
        </div>

        {mobileBad && <div className="err">Enter all 10 digits.</div>}

        <div className="fld">
          <label htmlFor="bp-name">Name</label>
          <input
            className="inp"
            id="bp-name"
            placeholder="Optional"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Takeaway customer loyalty */}
        {order.type === "Takeaway" && (
          <div className="cust-hit">
            <div className="cust-hit-header">
              <b>{order.guest || name || "Guest"}</b> •
              <span>{loyalty.visits} visits</span> •
              <span>{inr(loyalty.lifetime)} lifetime</span> •
              <b>{loyalty.points} pts</b>
            </div>

            <label className="chk cust-hit-check">
              <input
                type="checkbox"
                checked={redeemPoints}
                disabled={!canRedeem}
                onChange={(e) => setRedeemPoints(e.target.checked)}
              />
              Redeem {POINTS_TO_REDEEM} pts (−{inr(POINTS_TO_REDEEM)})
            </label>

            {!canRedeem && (
              <span className="cust-hit-warning">Not enough points to redeem.</span>
            )}
          </div>
        )}

        <label className="chk">
          <input
            type="checkbox"
            checked={wa}
            onChange={(e) => setWa(e.target.checked)}
          />
          Send receipt on WhatsApp
        </label>

        <label className="chk">
          <input
            type="checkbox"
            checked={promo}
            onChange={(e) => setPromo(e.target.checked)}
          />
          Guest agrees to offers on WhatsApp (opt-in)
        </label>

        <div className="cart-sec">Items ({order.items.length})</div>

        {order.items.map(([n, q, p]) => (
          <div className="ci" key={n}>
            <div className="ci-info">
              <div className="ci-name">{n}</div>
              <div className="ci-meta">{inr(p)} each</div>
            </div>

            <div className="ci-right">
              <span className="qn">×{q}</span>
              <div className="ci-total">{inr(q * p)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bill-sum">
        <div className="disc-box">
          <div className="disc-row">
            <span
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontWeight: 700,
                minWidth: 54,
              }}
            >
              Discount
            </span>

            <div className="disc-toggle">
              <button
                className={"dt-btn" + (dtype === "pct" ? " act" : "")}
                onClick={() => setDtype("pct")}
              >
                %
              </button>

              <button
                className={"dt-btn" + (dtype === "flat" ? " act" : "")}
                onClick={() => setDtype("flat")}
              >
                ₹
              </button>
            </div>

            <input
              type="number"
              className="inp"
              min="0"
              value={dval}
              aria-label="Discount value"
              style={{ width: 62 }}
              onChange={(e) => setDval(e.target.value)}
            />

            <select
              className="sel"
              style={{ marginLeft: "auto" }}
              value={svc}
              aria-label="Service charge"
              onChange={(e) => setSvc(Number(e.target.value))}
            >
              <option value={0}>Svc 0%</option>
              <option value={5}>Svc 5%</option>
              <option value={10}>Svc 10%</option>
            </select>
          </div>

          <div className="disc-row">
            <input
              className="inp"
              placeholder="Coupon code"
              style={{ textTransform: "uppercase" }}
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />

            <button className="bill-app-btn" onClick={applyCoupon}>
              Apply
            </button>
          </div>

          {needsPin ? (
            <div className="err">
              Discount above 10% needs manager PIN.
            </div>
          ) : (
            <div className="hint">
              Discount above 10% needs manager PIN. Service charge is voluntary
              — only add it if the guest agrees.
            </div>
          )}
        </div>

        <div className="sr">
          <span>Subtotal</span>
          <span>{inr(t.sub)}</span>
        </div>

        {t.disc > 0 && (
          <div className="sr disc-r">
            <span>Discount</span>
            <span>−{inr(t.disc)}</span>
          </div>
        )}

        {t.loyaltyRedeem > 0 && (
          <div className="sr disc-r">
            <span>Loyalty redemption</span>
            <span>−{inr(t.loyaltyRedeem)}</span>
          </div>
        )}

        {t.service > 0 && (
          <div className="sr">
            <span>Service charge</span>
            <span>{inr(t.service)}</span>
          </div>
        )}

        <div className="sr">
          <span>CGST 2.5%</span>
          <span>{inr(t.cgst)}</span>
        </div>

        <div className="sr">
          <span>SGST 2.5%</span>
          <span>{inr(t.sgst)}</span>
        </div>

        {Math.abs(t.round) > 0.004 && (
          <div className="sr">
            <span>Round off</span>
            <span>
              {t.round >= 0 ? "+" : "−"}
              {inr(Math.abs(t.round))}
            </span>
          </div>
        )}

        <div className="sr grand">
          <span>TOTAL</span>
          <span>{inr(t.total)}</span>
        </div>

        <div className="pay-grid">
          {[
            ["cash", "💵", "Cash"],
            ["upi", "📱", "UPI"],
            ["card", "💳", "Card"],
            ["split", "✂", "Split"],
          ].map(([k, icon, label]) => (
            <div
              key={k}
              role="button"
              tabIndex={0}
              className={"pb2" + (pay === k ? " sel" : "")}
              onClick={() => setPay(k)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPay(k);
                }
              }}
            >
              <span className="pb2-i">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        {pay === "cash" && (
          <div className="disc-row" style={{ marginBottom: 6 }}>
            <input
              className="inp"
              type="number"
              min="0"
              placeholder="Cash received"
              value={tend}
              onChange={(e) => setTend(e.target.value)}
            />

            <span
              className="mono"
              style={{
                fontSize: 12,
                whiteSpace: "nowrap",
                color: cashShort ? "var(--red)" : "var(--green)",
              }}
            >
              {change === null
                ? ""
                : change >= 0
                  ? `Change ${inr(change)}`
                  : `Short ${inr(-change)}`}
            </span>
          </div>
        )}
        {pay === "upi" && (
          <div id="bp-payx">
            <div className="bill-upi">
              Show UPI QR on the customer display. Confirm once the payment alert arrives.
            </div>
          </div>
        )}

        {pay === "card" && (
          <div className="card-message">
            Swipe or tap on the card machine for {inr(t.total)}.
          </div>
        )}

        {pay === "split" && (
          <div className="split-row">
            <button
              className="bill-cat-btn btn-sm split-btn"
              onClick={() => setShowSplitModal(true)}
            >
              ✂ Set split amounts…
            </button>
          </div>
        )}
        {splitAmounts && (
          <div className="hint">
            Cash: {inr(splitAmounts.cash)} ·
            UPI: {inr(splitAmounts.upi)} ·
            Card: {inr(splitAmounts.card)}
          </div>
        )}
        <button
          className="charge-btn"
          disabled={blocked}
          onClick={charge}
        >
          Charge {inr(t.total)}
        </button>

        <div className="cart-qa">
          <button
            className="cqa"
            onClick={() => toast("Provisional bill sent to printer")}
          >
            🖨 Provisional
          </button>

          <button
            className="cqa"
            onClick={() =>
              order.held
                ? onReopen(order.id)
                : onHold(order.id)
            }
          >
            <svg
              className="bi"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
              aria-hidden="true"
            >
              {order.held ? (
                <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
              ) : (
                <path d="M6 4h12v16H6z" />
              )}
            </svg>

            {order.held ? "Reopen" : "Hold"}
          </button>

          <button className="cqa" onClick={() => onVoid(order)}>
            ✕ Void
          </button>
        </div>
      </div>
      {showSplitModal &&
        <SplitPaymentModal
          total={t.total}
          onClose={() => setShowSplitModal(false)}
          onSave={(amounts) => {
            setSplitAmounts(amounts);

          }}
        />}
    </div>
  );
}

function Billing() {
  const [orders, setOrders] = useState(initializeOrders);
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleVoid = (order) => {
    setSelectedOrder(order);
    setShowVoidModal(true);
  };

  const handleVoidAuthorize = (order) => {
    setOrders((current) =>
      current.filter((o) => o.id !== order.id)
    );

    setSel((current) =>
      current === order.id ? null : current
    );

    setShowVoidModal(false);
    setSelectedOrder(null);


  };

  const toast = (message) => {
    setMsg(message);
    clearTimeout(window.__billingToast);
    window.__billingToast = setTimeout(() => setMsg(""), 2600);
  };

  const order = orders.find((o) => o.id === sel) || null;

  const drop = (id) => {
    setOrders((current) => current.filter((o) => o.id !== id));
    setSel(null);
  };

  const onNew = (type) => {
    toast(`${type} order: hook this to your new-order screen`);
  };

  const onPaid = (id, payment) => {
    // Demo only: record the payment and remove the paid order.
    // Persist the payment and loyalty balance through your API in production.
    console.log("Payment completed:", { id, ...payment });
    drop(id);
  };

  const onHold = (id) => {
    setOrders((current) =>
      current.map((o) =>
        o.id === id ? { ...o, held: true } : o
      )
    );

    setSel(null);
    toast("Order held");
  };

  const onReopen = (id) => {
    setOrders((current) =>
      current.map((o) =>
        o.id === id ? { ...o, held: false } : o
      )
    );

    toast("Order reopened");
  };



  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          min: order.min + 1,
        }))
      );
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pnl act" id="p-bill">
      <div className="pos-wrap">
        <OrderList
          orders={orders}
          sel={sel}
          setSel={setSel}
          filter={filter}
          setFilter={setFilter}
          q={q}
          setQ={setQ}
          onNew={onNew}
        />

        <BillPanel
          key={sel}
          order={order}
          toast={toast}
          onPaid={onPaid}
          onHold={onHold}
          onVoid={handleVoid}
          onReopen={onReopen}
        />
      </div>

      {showVoidModal && selectedOrder && (
        <VoidModal
          order={selectedOrder}
          onClose={() => {
            setShowVoidModal(false);
            setSelectedOrder(null);
          }}
          onAuthorize={handleVoidAuthorize}
        />
      )}

      {msg && (
        <div className="toast" role="status">
          {msg}
        </div>
      )}
    </div>
  );
}

export default Billing;
