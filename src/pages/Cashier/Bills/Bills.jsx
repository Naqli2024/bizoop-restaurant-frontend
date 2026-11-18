import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandCoinsIcon } from "lucide-react";

import {
  getBillsByCashier,
  collectPayment,
} from "../../../redux/Bills/BillSlice";
import PaymentModal from "./PaymentModal";
import "../../../assets/styles/bills.css";
import { toast } from "react-toastify";

const FILTERS = ["All", "Paid", "Generated", "Void", "Refunded"];

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const Icon = ({ children, size = 15 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const BillsIcon = () => (
  <Icon size={18}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
    <path d="M9 8h6M9 12h6" />
  </Icon>
);

const PrintIcon = () => (
  <Icon>
    <path d="M7 9V3h10v6" />
    <rect x="4" y="9" width="16" height="8" rx="2" />
    <path d="M7 14h10v7H7z" />
  </Icon>
);

const ChatIcon = () => (
  <Icon>
    <path d="M4 5h16v11H9l-5 4V5Z" />
  </Icon>
);

const RefundIcon = () => (
  <Icon size={13}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </Icon>
);

const VoidIcon = () => (
  <Icon size={13}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Icon>
);

const SearchIcon = () => (
  <Icon size={15}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

/* ------------------------------------------------------------------ */
/* Bills page                                                          */
/* ------------------------------------------------------------------ */
export default function Bills() {
  const dispatch = useDispatch();

  const {
    overall = {},
    cashierPerformance = [],
    loading,
  } = useSelector((state) => state.bills);

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [payBill, setPayBill] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch cashier bills
  useEffect(() => {
    dispatch(getBillsByCashier());
  }, [dispatch]);

  // Get bill history from cashier performance
  const bills = useMemo(() => {
    return cashierPerformance.flatMap((cashier) =>
      (cashier.billHistory || []).map((bill) => ({
        ...bill,
        cashierName: cashier.cashierName,
        id: bill.billNumber,
        time: bill.generatedAt
          ? new Date(bill.generatedAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Asia/Kolkata",
            })
          : "—",
        table: bill.orderType || "—",
        order: bill.orderType || "—",
        captain: bill.captain || "—",
        guest: bill.customerName || "—",
        phone: bill.customerPhone || null,
        mode:
          bill.paymentMethod ||
          (bill.paymentDetails?.length
            ? bill.paymentDetails.map((p) => p.paymentMethod).join(" + ")
            : "—"),
        total: bill.totalAmount || 0,
        status: (bill.billStatus || "").toLowerCase(),
      }))
    );
  }, [cashierPerformance]);

  // Search and filter
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return bills.filter((b) => {
      if (filter !== "All" && b.status !== filter.toLowerCase()) {
        return false;
      }

      if (!q) return true;

      return [
        b.id,
        b.billNumber,
        b.table,
        b.orderId,
        b.phone,
        b.guest,
        b.captain,
        b.cashierName,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [bills, filter, query]);

  // Submit payment to PATCH /bills/:id/collect-payment
  const handleCollectPayment = async (payload) => {
  if (!payBill) return;

  try {
    setSubmitting(true);

    const response = await dispatch(
      collectPayment({ Id: payBill.billId, payload })
    ).unwrap();

    toast.success(response?.message || "Payment collected");
    setPayBill(null);
    dispatch(getBillsByCashier()); // refresh list and stats
  } catch (error) {
    toast.error(error?.message || error || "Payment failed");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="bl">
      <header className="bl-header">
        <div className="bl-title-group">
          <h1 className="bl-title">
            <BillsIcon />
            <span>Bills</span>
          </h1>

          <span className="bl-count">
            {overall.totalBills || bills.length} bills
          </span>
        </div>

        <div className="bl-tools">
          <label className="bl-search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bill / table / mobile"
              aria-label="Search bill, table or mobile"
            />
          </label>

          <div className="bl-filters" role="tablist" aria-label="Filter bills">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={"bl-chip" + (filter === f ? " is-active" : "")}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="bl-main">
        <section className="bl-stats" aria-label="Summary">
          <article className="bl-stat">
            <h2 className="bl-stat-label">Overall sales</h2>
            <p className="bl-stat-value">{inr(overall.overallSales)}</p>
          </article>

          <article className="bl-stat">
            <h2 className="bl-stat-label">Settled bills</h2>
            <p className="bl-stat-value">{overall.paidBills || 0}</p>
          </article>

          <article className="bl-stat">
            <h2 className="bl-stat-label">Voids</h2>
            <p className="bl-stat-value bl-orange">
              {overall.cancelledBills || 0}
            </p>
          </article>

          <article className="bl-stat">
            <h2 className="bl-stat-label">Unpaid bills</h2>
            <p className="bl-stat-value bl-orange">
              {overall.unpaidBills || 0}
            </p>
          </article>
        </section>

        <section className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>Bill</th>
                <th>Time</th>
                <th>Table / Order</th>
                <th>Captain</th>
                <th>Guest</th>
                <th>Mode</th>
                <th className="bl-num">Total</th>
                <th>WhatsApp</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visible.length === 0 && (
                <tr className="bl-empty">
                  <td colSpan={10}>
                    {loading
                      ? "Loading bills..."
                      : "No bills match. Try a different search or filter."}
                  </td>
                </tr>
              )}

              {visible.map((b) => {
                const closed = b.status !== "paid";
                const canCollect = !["paid", "void", "refunded"].includes(
                  b.status
                );

                return (
                  <tr
                    key={b.billId}
                    className={closed ? "is-closed" : undefined}
                  >
                    <td data-label="Bill" className="bl-mono bl-bill">
                      {b.billNumber}
                    </td>

                    <td data-label="Time" className="bl-mono bl-time">
                      {b.time}
                    </td>

                    <td data-label="Table / Order">
                      <span className="bl-strong">{b.table}</span>
                      <span className="bl-sub">{b.orderId}</span>
                    </td>

                    <td data-label="Captain">{b.captain}</td>

                    <td data-label="Guest">
                      <span className="bl-strong">{b.guest}</span>
                      {b.phone && <span className="bl-sub">{b.phone}</span>}
                    </td>

                    <td data-label="Mode">{b.mode}</td>

                    <td data-label="Total" className="bl-num bl-mono bl-total">
                      {inr(b.total)}
                    </td>

                    <td data-label="WhatsApp">
                      {b.phone ? (
                        <span className="bl-pill bl-pill-delivered">
                          delivered
                        </span>
                      ) : (
                        <span className="bl-pill bl-pill-none">No number</span>
                      )}
                    </td>

                    <td data-label="Status">
                      <span className={"bl-pill bl-status-" + b.status}>
                        {b.status}
                      </span>
                    </td>

                    <td data-label="Actions" className="bl-actions-cell">
                      <div className="bl-actions">
                        <button
                          type="button"
                          className="bl-icon-btn"
                          aria-label={`Payment ${b.billNumber}`}
                          title="Collect payment"
                           disabled={!canCollect}
                          onClick={() => setPayBill(b)}
                        >
                          <HandCoinsIcon size={16} />
                        </button>

                        <button
                          type="button"
                          className="bl-icon-btn"
                          aria-label={`Print bill ${b.billNumber}`}
                          title="Print"
                        >
                          <PrintIcon />
                        </button>

                        <button
                          type="button"
                          className="bl-icon-btn"
                          aria-label={`Send bill ${b.billNumber} on WhatsApp`}
                          title="Send on WhatsApp"
                        >
                          <ChatIcon />
                        </button>

                        <button
                          type="button"
                          className="bl-text-btn"
                          disabled={closed}
                          aria-label={`Refund bill ${b.billNumber}`}
                        >
                          <RefundIcon />
                          Refund
                        </button>

                        <button
                          type="button"
                          className="bl-icon-btn bl-icon-btn-sm"
                          disabled={closed}
                          aria-label={`Void bill ${b.billNumber}`}
                          title="Void"
                        >
                          <VoidIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>

      {payBill && (
        <PaymentModal
          bill={payBill}
          submitting={submitting}
          onClose={() => !submitting && setPayBill(null)}
          onSubmit={handleCollectPayment}
        />
      )}
    </div>
  );
}