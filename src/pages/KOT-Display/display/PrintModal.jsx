import { Check, Printer, X, Zap } from "lucide-react";

export default function PrintModal({ kot, isPriority = false, onClose }) {
    if (!kot) return null;

    const dateLabel = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    }); // e.g. "23 Oct"

    return (
        <div
            className="kd-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="kd-modal kd-print-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="kd-print-title"
            >
                <div className="kd-pm-header">
                    <span id="kd-print-title" className="kd-pm-title">
                        <Printer size={16} /> Reprint
                    </span>
                    <button
                        type="button"
                        className="kd-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="kd-pm-body">
                    <div className="kd-receipt" id="kd-receipt">
                        <div className="kd-receipt-center kd-receipt-brand">
                            Spice Route
                        </div>
                        <div className="kd-receipt-center kd-receipt-small">
                            ** KITCHEN ORDER TICKET **
                        </div>
                        <div className="kd-receipt-center kd-receipt-small">
                            *** REPRINT ***
                        </div>

                        <hr className="kd-dash" />

                        <div className="kd-receipt-kot">{kot.number}</div>
                        <div>
                            Table/Order: <strong>{kot.table}</strong>
                        </div>
                        <div>Captain: {kot.captain}</div>
                        <div>
                            Time: {kot.time} · {dateLabel}
                        </div>
                        <div>Station: {kot.station}</div>
                        {isPriority && (
                            <div className="kd-receipt-priority">
                                <Zap size={13} /> PRIORITY
                            </div>
                        )}

                        <hr className="kd-dash" />

                        <ul className="kd-receipt-items">
                            {kot.items.map((item, i) => (
                                <li key={i}>
                                    <strong>{item.qty}×</strong>
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </ul>

                        <hr className="kd-dash" />

                        <div className="kd-receipt-center">
                            {kot.station} Printer
                        </div>
                    </div>
                </div>

                <div className="kd-pm-footer">
                    <button
                        type="button"
                        className="kd-done-btn"
                        onClick={onClose}
                    >
                        <Check size={16} /> Done
                    </button>
                </div>
            </div>
        </div>
    );
}