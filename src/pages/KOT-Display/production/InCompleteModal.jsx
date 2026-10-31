
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

const IncompleteModal = ({
  batch,
  criticalSteps,
  onClose,
  onOpenChecklist,
  onCompleteAnyway,
}) => {
  const [reason, setReason] = useState("");

  if (!batch) return null;

   const handleCompleteAnyway = () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      return;
    }

    onCompleteAnyway(batch, trimmedReason);
  };


  return (
    <div
      className="production-waste-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="production-waste-modal production-modal-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="production-incomplete-title"
      >
        <div className="production-waste-modal-header">
          <span id="production-incomplete-title">
            SOP checklist incomplete
          </span>

          <button
            type="button"
            className="production-waste-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="production-alert production-alert-danger">
          <AlertTriangle size={18} />

          <span>
            {criticalSteps.length} critical step(s) are not
            ticked for {batch.id}.
          </span>
        </div>

        {criticalSteps.map((step, index) => (
          <div className="production-checklist-item" key={index}>
            <div>
              {batch.product} SOP: {step}
            </div>
          </div>
        ))}

        <label className="production-reason-label">
          Reason, if a manager is overriding

          <input
            type="text"
            className="production-reason-input"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter override reason"
          />
        </label>

        <div className="production-modal-footer">
          <button
            type="button"
            className="production-btn "
            onClick={onOpenChecklist}
          >
            Open checklist
          </button>

          <button
            type="button"
            className="production-btn production-btn-danger"
            onClick={handleCompleteAnyway}
            disabled={!reason.trim()}
          >
            Complete anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncompleteModal;