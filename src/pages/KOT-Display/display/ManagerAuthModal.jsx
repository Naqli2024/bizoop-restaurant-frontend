import { useState } from "react";

const MANAGER_PIN = "1234"; // demo only, validate on the server in production

export default function ManagerAuthModal({ kot, onClose, onAuthorise }) {
    const [pin, setPin] = useState("");
      

    if (!kot) return null;

    function handleAuthorise() {
        if (pin !== MANAGER_PIN) {
            setPin("");
            return;
        }
        onAuthorise(kot);
    }

    return (
        <div
            className="kd-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="kd-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="kd-auth-title"
            >
                <div className="kd-modal-header">
                    <span id="kd-auth-title">🔐 Manager authorisation</span>
                    <button
                        type="button"
                        className="kd-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="kd-modal-sub">
                    Reprint {kot.number} ({kot.table}, {kot.station})
                </div>

                <div className="kd-field">
                    <label className="kd-label" htmlFor="auth-pin">
                        Manager PIN
                    </label>
                    <input
                        id="auth-pin"
                        className="kd-input"
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="• • • •"
                        autoFocus
                        value={pin}
                        onChange={(e) => {
                            setPin(e.target.value.replace(/\D/g, ""));
                           
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAuthorise();
                            if (e.key === "Escape") onClose();
                        }}
                    />
                    
                </div>

                <div className="kd-modal-hint">
                    Demo PIN: 1234 — every authorisation is written to the audit log.
                </div>

                <div className="kd-modal-actions">
                    <button type="button" className="kd-btn" onClick={onClose}>
                        ✕ Cancel
                    </button>
                    <button
                        type="button"
                        className="kd-btn kd-btn-primary"
                        onClick={handleAuthorise}
                        disabled={pin.length < 4}
                    >
                        Authorise
                    </button>
                </div>
            </div>
        </div>
    );
}