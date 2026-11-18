import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import "../../../assets/styles/back-office/expenses.css"
import ExpenseBookingModal from "./ExpenseBookingModal";

const DEFAULT_EXPENSES = [
    {
        id: "EX-001",
        date: "2026-11-03",
        category: "Rent",
        narration: "Monthly rent — Anna Nagar",
        mode: "Bank transfer",
        amount: 85000,
    },
    {
        id: "EX-002",
        date: "2026-11-03",
        category: "Gas / LPG",
        narration: "Commercial cylinders ×6",
        mode: "Cash",
        amount: 10800,
    },
];

// accent colours cycle through the category cards
const ACCENTS = ["var(--orange)", "var(--blue)", "var(--green)", "var(--purple)"];

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const today = () => new Date().toISOString().slice(0, 10);

export default function ExpenseBooking() {
    const [expenses, setExpenses] = useState(DEFAULT_EXPENSES)
    const [modalOpen, setModalOpen] = useState(false);

    const closeModal = useCallback(() => setModalOpen(false), []);

    const handleBook = (data) => {
        const next = {
            id: "EX-" + String(expenses.length + 1).padStart(3, "0"),
            date: today(),
            ...data,
        };
        setExpenses((list) => [...list, next]);
    };

    const total = useMemo(
        () => expenses.reduce((sum, e) => sum + e.amount, 0),
        [expenses]
    );

    // group by category, keep insertion order
    const byCategory = useMemo(() => {
        const map = new Map();
        expenses.forEach((e) => map.set(e.category, (map.get(e.category) || 0) + e.amount));
        return [...map.entries()];
    }, [expenses]);

    return (
        <section className="xb-panel">
            <header className="xb-header">
                <h2 className="xb-title">
                    <span aria-hidden="true">💸</span> Expense booking
                    <span className="xb-badge">auto-creates payment voucher</span>
                </h2>

                <button type="button" className="xb-btn-primary" onClick={() => setModalOpen(true)}>
                    <Plus size={14} className="xb-btn-icon" />
                    Book expense
                </button>
            </header>

            <div className="xb-body">
                <div className="xb-stats">
                    <div className="xb-stat">
                        <div className="xb-stat-label">Total expenses</div>
                        <div className="xb-stat-value">{inr(total)}</div>
                    </div>

                    {byCategory.map(([category, amount], i) => (
                        <div className="xb-stat" key={category}>
                            <div className="xb-stat-label">{category}</div>
                            <div className="xb-stat-value" style={{ color: ACCENTS[i % ACCENTS.length] }}>
                                {inr(amount)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="xb-table-wrap">
                    <table className="xb-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Narration</th>
                                <th>Mode</th>
                                <th className="xb-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.date}</td>
                                    <td>{e.category}</td>
                                    <td>{e.narration}</td>
                                    <td>{e.mode}</td>
                                    <td className="xb-right xb-mono">{inr(e.amount)}</td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="xb-empty">
                                        No expenses booked yet. Use “Book expense” to add one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {modalOpen && 
            <ExpenseBookingModal open={modalOpen} onClose={closeModal} onSubmit={handleBook} />}
        </section>
    );
}
