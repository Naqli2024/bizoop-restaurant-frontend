import { useState } from "react";
import Modal from "./Modal";


const AUDIENCES = [
    { value: "Regulars", reachable: 9 },
    { value: "Lapsed 30+ days", reachable: 0 },
    { value: "VIP", reachable: 5 },
    { value: "New guests", reachable: 3 },
];

const COUPONS = ["—", "WELCOME10", "BDAY15", "BIRYANI50", "GOLD100"];

const DEFAULT_MESSAGE =
    "Hi {first_name}! This weekend, enjoy our signature biryani with a free dessert at Spice Route. Show this message at billing. Reply STOP to opt out.";

export default function CampaignModal({ onClose, onSend }) {
    const [name, setName] = useState("");
    const [audience, setAudience] = useState(AUDIENCES[0].value);
    const [coupon, setCoupon] = useState(COUPONS[0]);
    const [message, setMessage] = useState(DEFAULT_MESSAGE);

    const selected = AUDIENCES.find((a) => a.value === audience);
    const canSend =
        name.trim() && message.trim() && selected.reachable > 0;

    const handleSend = () => {
        if (!canSend) return;
        onSend({
            name: name.trim(),
            segment: selected.value,
            reachable: selected.reachable,
            coupon: coupon === "—" ? null : coupon,
            message: message.trim(),
        });
        onClose();
    };

    const footer = (
        <>
            <button type="button" className="cmp-btn cmp-btn--ghost" onClick={onClose}>
                <svg className="cmp-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                Cancel
            </button>
            <button
                type="button"
                className="cmp-btn cmp-btn--send"
                onClick={handleSend}
            >
                Send now
            </button>
        </>
    );

    return (
        <Modal title="💬 New WhatsApp campaign" onClose={onClose} footer={footer}>
            <div className="cmp-grid">
                <div className="cmp-field">
                    <label className="cmp-label" htmlFor="cmp-name">
                        Campaign name
                    </label>
                    <input
                        id="cmp-name"
                        className="cmp-input"
                        placeholder="e.g. Diwali family feast"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="cmp-field">
                    <label className="cmp-label" htmlFor="cmp-audience">
                        Audience (opted-in only)
                    </label>
                    <select
                        id="cmp-audience"
                        className="cmp-select"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                    >
                        {AUDIENCES.map((a) => (
                            <option key={a.value} value={a.value}>
                                {a.value} — {a.reachable} reachable
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="cmp-field">
                <label className="cmp-label" htmlFor="cmp-coupon">
                    Attach coupon
                </label>
                <select
                    id="cmp-coupon"
                    className="cmp-select"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                >
                    {COUPONS.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <div className="cmp-field">
                <label className="cmp-label" htmlFor="cmp-message">
                    Message
                </label>
                <textarea
                    id="cmp-message"
                    className="cmp-textarea"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                {selected.reachable === 0 && (
                    <p className="cmp-hint">
                        No opted-in customers in this audience. Choose another one to send.
                    </p>
                )}
            </div>
        </Modal>
    );
}
