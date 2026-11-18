import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";


const CATEGORIES = [
    "Rent",
    "Electricity & Water",
    "Gas / LPG",
    "Repairs & Maintenance",
    "Marketing",
    "Licences & Fees",
    "Aggregator Commission",
    "Packaging",
    "Misc",
];

const PAY_MODES = ["Cash", "UPI", "Bank transfer", "Card"];

const EMPTY_FORM = {
    category: CATEGORIES[0],
    narration: "",
    amount: "",
    mode: PAY_MODES[0],
};

export default function ExpenseModal({ open, onClose, onSubmit }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState("");
    const firstFieldRef = useRef(null);

    // Reset form + focus first field each time the modal opens
    useEffect(() => {
        if (open) {
            setForm(EMPTY_FORM);
            setError("");
            setTimeout(() => firstFieldRef.current?.focus(), 0);
        }
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = Number(form.amount);

        if (!form.narration.trim()) return setError("Enter a narration.");
        if (!amount || amount <= 0) return setError("Enter an amount greater than 0.");

        onSubmit({
            category: form.category,
            narration: form.narration.trim(),
            amount,
            mode: form.mode,
        });
        onClose();
    };

    return (
        <div
            className="exm-overlay"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
            <form
                className="exm-box"
                role="dialog"
                aria-modal="true"
                aria-labelledby="exm-title"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="exm-head">
                    <h3 className="exm-head__title" id="exm-title">Book expense</h3>
                    <button
                        type="button"
                        className="exm-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="exm-body">
                    <label className="exm-field">
                        <span className="exm-field__label">Category</span>
                        <select
                            ref={firstFieldRef}
                            className="exm-control"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    <label className="exm-field">
                        <span className="exm-field__label">Narration</span>
                        <input
                            className="exm-control"
                            name="narration"
                            value={form.narration}
                            onChange={handleChange}
                            placeholder="e.g. Monthly rent — Anna Nagar"
                        />
                    </label>

                    <label className="exm-field">
                        <span className="exm-field__label">Amount (₹)</span>
                        <input
                            className="exm-control"
                            name="amount"
                            type="number"
                            min="0"
                            inputMode="decimal"
                            value={form.amount}
                            onChange={handleChange}
                        />
                    </label>

                    <label className="exm-field">
                        <span className="exm-field__label">Paid via</span>
                        <select
                            className="exm-control"
                            name="mode"
                            value={form.mode}
                            onChange={handleChange}
                        >
                            {PAY_MODES.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </label>

                    {error && <p className="exm-error" role="alert">{error}</p>}
                </div>

                <div className="exm-foot">
                    <button type="button" className="exm-btn" onClick={onClose}>
                        <X size={14} />
                        Cancel
                    </button>
                    <button type="submit" className="exm-btn exm-btn--primary">
                        Book &amp; issue voucher
                    </button>
                </div>
            </form>
        </div>
    );
}
