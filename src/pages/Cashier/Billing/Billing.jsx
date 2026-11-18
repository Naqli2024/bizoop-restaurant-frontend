
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  getBillRequestCashier,
  billGenerated,
} from "../../../redux/Bills/BillSlice";

import "../../../assets/styles/billing.css";
import VoidModal from "./VoidModal";

const inr = (n) =>
  "₹" +
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const STATUS = {
  "Bill requested": "var(--red)",
  Dining: "var(--purple)",
  "In kitchen": "var(--a2)",
  "Food ready": "var(--green)",
  Ordering: "var(--blue)",
};

const FILTERS = [
  "All",
  "Bill requested",
   "Takeaway",
  "Delivery",
 ];

// Convert API bill request data
const formatBillOrder = (order) => ({
  id: order._id,
  no: order.tableId?.tableName || order.orderNumber || "Order",
  status: "Bill requested",
  type:
    order.orderType === "Dine-In"
      ? "Dine-in"
      : order.orderType,
  captain:
    order.captainId?.employeeId?.employeeName || "—",
  zone: order.floorId?.floorName || "",
  ref: order.orderNumber || order._id,
  pax: order.numberOfGuests || 0,
  kot: order.kotNumber || "-",
  guest: order.customerName || "Guest",
  mobile: order.customerMobile || "",
  time: order.orderedAt
    ? new Date(order.orderedAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "",
  items: (order.items || []).map((item) => ({
    id: item._id,
    name: item.itemName,
    qty: item.quantity,
    price: item.unitPrice,
    subTotal: item.itemSubTotal,
    gstRate: item.gstRate,
    gstAmount: item.gstAmount,
    total: item.totalPrice,
    instructions: item.specialInstructions,
  })),
  subTotal: order.subTotal,
  totalGst: order.totalGst,
  totalAmount: order.totalAmount,
  paymentStatus: order.paymentStatus,
});

function match(o, f) {
  if (f === "All") return !o.held;
  if (f === "Held") return Boolean(o.held);

  if (f === "Bill requested") {
    return !o.held && o.paymentStatus === "Bill Requested";
  }

  return !o.held && o.type === f;
}

const Icon = ({ d }) => (
  <svg className="bi" viewBox="0 0 24 24" aria-hidden="true">
    {d}
  </svg>
);

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

        {list.map((o) => (
          <div
            key={o.id}
            role="button"
            tabIndex={0}
            className={
              "oc" +
              (sel === o.id ? " sel" : "") +
              (o.paymentStatus === "Bill Requested" ? " hot" : "")
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
                    : STATUS["Bill requested"] || "var(--muted)",
                }}
              >
                {o.held ? "Held" : o.paymentStatus}
              </span>
            </div>

            <div className="oc-m">
              {o.source || o.type} · {o.captain}
              <br />
              {o.items.length} items · {o.time}

              {o.guest && (
                <>
                  <br />👤 {o.guest}
                </>
              )}
            </div>

            <div className="oc-t">{inr(o.totalAmount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillPanel({ order, onPaid, onHold, onVoid, toast, onReopen }) {
  const [mobile, setMobile] = useState(order?.mobile || "");
  const [name, setName] = useState(order?.guest || "");
  const [wa, setWa] = useState(true);
  const [promo, setPromo] = useState(false);
  

  if (!order) {
    return (
      <div className="pos-right">
        <div className="bill-empty">
          <div className="bill-empty-icon">🧾</div>
          <h3>No order selected</h3>
          <p>
            Select an order from the left panel to view items and generate
            the bill.
          </p>
        </div>
      </div>
    );
  }

  const mobileBad = mobile.length > 0 && mobile.length !== 10;
  // Use API total directly. No manual subtotal/GST calculation.
  const total = Number(order.totalAmount || 0);
  
  const charge = async () => {
    

    await onPaid(order.id, {
      total,
      guestName: name || order.guest || "Guest",
      mobile,
      whatsappReceipt: wa && mobile.length === 10,
      promotionalOptIn: promo,
      
    });
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
             {order.captain}
            {order.pax ? ` · ${order.pax} pax` : ""}
            </div>
        </div>
      </div>

      <div className="cart-body">
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

        <div className="cart-sec">
          Items ({order.items.length})
        </div>

        {order.items.map((item) => (
          <div className="ci" key={item.id}>
            <div className="ci-info">
              <div className="ci-name">{item.name}</div>

              <div className="ci-meta">
                {item.qty} × {inr(item.price)}
              </div>
                 </div>

            <div className="ci-right">
              <span className="qn">×{item.qty}</span>
              <div className="ci-total">{inr(item.total)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bill-sum">
        <div className="sr">
          <span>Subtotal</span>
          <span>{inr(order.subTotal)}</span>
        </div>

        <div className="sr">
          <span>Total GST</span>
          <span>{inr(order.totalGst)}</span>
        </div>

        <div className="sr grand">
          <span>TOTAL</span>
          <span>{inr(order.totalAmount)}</span>
        </div>
        
        <button
          className="charge-btn"
          onClick={charge}
        >
          Generate Bill {inr(total)}
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
            {order.held ? "Reopen" : "Hold"}
          </button>

          <button className="cqa" onClick={() => onVoid(order)}>
            ✕ Void
          </button>
        </div>
      </div>
    </div>
  );
}

function Billing() {
  const dispatch = useDispatch();

  const { bills, loading, error } = useSelector(
    (state) => state.bills
  );

  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  const [showVoidModal, setShowVoidModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(getBillRequestCashier());
  }, [dispatch]);

  const orders = (bills || []).map(formatBillOrder);
  const order = orders.find((o) => o.id === sel) || null;

  const handleVoid = (order) => {
    setSelectedOrder(order);
    setShowVoidModal(true);
  };

  const handleVoidAuthorize = () => {
    setShowVoidModal(false);
    setSelectedOrder(null);
    toast.info("Void API is not connected yet");
  };

  const onPaid = async (id) => {
    try {
      await dispatch(billGenerated(id)).unwrap();

      toast.success("Bill generated successfully");
      setSel(null);

      dispatch(getBillRequestCashier());
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Bill generation failed"
      );
    }
  };

  const onHold = () => {
    toast.info("Hold API is not connected yet");
  };

  const onReopen = () => {
    toast.info("Reopen API is not connected yet");
  };

  const onNew = (type) => {
    toast.info(`${type} order: connect your new-order screen`);
  };

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

        {loading && (
          <div className="bill-loading">
            Loading bill requests...
          </div>
        )}

        {!loading && error && (
          <div className="err">
            {typeof error === "string"
              ? error
              : "Failed to load bill requests"}
          </div>
        )}

        {!loading && !error && (
          <BillPanel
            key={sel}
            order={order}
            toast={(message) => toast.info(message)}
            onPaid={onPaid}
            onHold={onHold}
            onVoid={handleVoid}
            onReopen={onReopen}
          />
        )}
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
    </div>
  );
}

export default Billing;
