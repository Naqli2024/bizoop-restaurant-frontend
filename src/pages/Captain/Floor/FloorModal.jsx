import { useEffect, useState } from "react";

const FloorModal = ({
  modalType,
  selectedTable,
  guests,
  setGuests,
  customerName,
  setCustomerName,
  mobile,
  setMobile,
  channel,
  setChannel,
  submitting = false,
  onClose,
  onCreateTable,
  onCreateTakeaway,
}) => {
  const [captain, setCaptain] = useState("");
  const [tableCustomerName, setTableCustomerName] = useState("");

  // Clear the table-order fields whenever the modal opens or closes
  useEffect(() => {
    setCaptain("");
    setTableCustomerName("");
  }, [modalType, selectedTable?.id]);

  if (!modalType) return null;

  const isTable = modalType === "table";
  const isTakeaway = modalType === "take";
  const isDelivery = modalType === "del";

  const mobileInvalid = mobile.length > 0 && mobile.length !== 10;

  function handleConfirm() {
    if (isTable) {
      onCreateTable({
        captain: captain.trim(),
        customerName: tableCustomerName.trim(),
      });
    } else {
      onCreateTakeaway();
    }
  }

  return (
    <div className="floor-modal-backdrop" onClick={onClose}>
      <div
        className="floor-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="floor-modal-header">
          <h3>
            {isTable
              ? `Open table ${selectedTable?.name || ""}`
              : isTakeaway
              ? "New takeaway order"
              : "New delivery order"}
          </h3>

          <button
            type="button"
            className="floor-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {isTable && (
          <>
            <div className="floor-grid2">
              <div>
                <label>Guests (pax)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedTable?.availableSeats || 1}
                  value={guests}
                  onChange={(event) => setGuests(event.target.value)}
                />
              </div>

              <div>
                <label>Captain</label>
                <input
                  value={captain}
                  onChange={(event) => setCaptain(event.target.value)}
                  placeholder="Captain name"
                />
              </div>
               <div style={{ marginTop: 10 }}>
              <label>Customer name</label>
              <input
                value={tableCustomerName}
                onChange={(event) => setTableCustomerName(event.target.value)}
                placeholder="Optional"
              />
            </div>
            </div>
            <p>
              {selectedTable?.floorName} · {selectedTable?.availableSeats} of{" "}
              {selectedTable?.seats} seats available
            </p>
          </>
        )}

        {(isTakeaway || isDelivery) && (
          <>
            <div className="floor-grid2">
              <div>
                <label>Customer name</label>
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div>
                <label>Mobile (WhatsApp)</label>
                <input
                  value={mobile}
                  onChange={(event) =>
                    setMobile(event.target.value.replace(/\D/g, ""))
                  }
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            {isDelivery && (
              <>
                <label>Channel</label>

                <select
                  value={channel}
                  onChange={(event) => setChannel(event.target.value)}
                >
                  <option>Swiggy</option>
                  <option>Zomato</option>
                  <option>Direct (own app)</option>
                  <option>Phone order</option>
                </select>
              </>
            )}
          </>
        )}

        <div className="floor-modal-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-p"
            disabled={submitting || (!isTable && mobileInvalid)}
            onClick={handleConfirm}
          >
            {submitting
              ? "Opening…"
              : isTable
              ? "Open & take order"
              : "Create & add items"}
          </button>
        </div>
      </div>
    </div>
  );
};

export { FloorModal };
