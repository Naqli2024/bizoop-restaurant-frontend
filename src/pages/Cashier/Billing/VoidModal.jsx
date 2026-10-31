import { useState } from "react";
const VoidModal = ({ onClose, onAuthorize, order }) => {
  const [pin, setPin] = useState("");

  const handleAuthorize = () => {
    if (pin === "1234") {
      onAuthorize(order);
      onClose();
    } else {
      alert("Invalid Manager PIN");
    }
  };

  return (
    <div className="void-mo" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="void-mbox void-mbox-sm" role="dialog" aria-modal="true">

        <div className="void-mhdr">
          <span>🔐 Manager authorisation</span>
          <button
            className="void-mclose"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="void-description">
          Void bill / cancel order {order?.no || "T2"}
        </div>

        <div className="void-fg">
          <label className="void-fl" htmlFor="auth-pin">
            Manager PIN
          </label>

          <input
            className="void-inp"
            id="auth-pin"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="• • • •"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, ""))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAuthorize();
            }}
          />
        </div>

        <div className="void-hint">
          Demo PIN: 1234 — every authorisation should be
          written to the audit log.
        </div>

        <div className="void-mfoot">
          <button className="btn" onClick={onClose}>
            ✕ Cancel
          </button>

          <button
            className="btn btn-p"
            onClick={handleAuthorize}
            disabled={pin.length !== 4}
          >
            Authorise
          </button>
        </div>

      </div>
    </div>
  );
};

export default VoidModal;