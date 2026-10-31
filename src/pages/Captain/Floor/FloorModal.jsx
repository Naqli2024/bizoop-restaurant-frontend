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
  onClose,
  onCreateTable,
  onCreateTakeaway,
  onConfirmReservation,
  captain,
  setCaptain
}) => {
  if (!modalType) return null;

  function handleConfirm() {
    if (modalType === "table") {
      onCreateTable();
    } else if (modalType === "reservation") {
      onConfirmReservation();
    } else {
      onCreateTakeaway();
    }
  }

  return (
    <div
      className="floor-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="floor-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="floor-modal-header">
          <h3>
            {modalType === "table"
              ? `Open table ${selectedTable?.id}`
              : modalType === "reservation"
                ? `Reserved — ${selectedTable?.id}`
                : modalType === "take"
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

        {modalType === "table" && (
          <>
            <label>Guests (pax)</label>

            <input
              type="number"
              min="1"
              max={(selectedTable?.seats || 2) + 4}
              value={guests}
              onChange={(event) =>
                setGuests(event.target.value)
              }
            />
            <label>Captain Name</label>

            <select
              value={captain}
              onChange={(event) => setCaptain(event.target.value)}
            >
              <option value="Ravi K.">Ravi K.</option>
              <option value="Priya S.">Priya S.</option>
              <option value="Arun M.">Arun M.</option>
            </select>
            <p>
              {selectedTable?.sec} · {selectedTable?.seats} seats
            </p>
          </>
        )}

        {modalType === "reservation" && (
          <>
            <p>
              Reserved for{" "}
              <strong> {selectedTable?.reservation?.n}{" "} </strong>
              {selectedTable?.reservation?.t} ·{" "}
              {selectedTable?.reservation?.p} guests
            </p>
          </>
        )}

        {(modalType === "take" || modalType === "del") && (
          <>
            <label>Customer name</label>

            <input
              value={customerName}
              onChange={(event) =>
                setCustomerName(event.target.value)
              }
              placeholder="Optional"
            />

            <label>Mobile</label>

            <input
              value={mobile}
              onChange={(event) =>
                setMobile(event.target.value.replace(/\D/g, ""))
              }
              maxLength={10}
              inputMode="numeric"
              placeholder="10-digit number"
            />

            {modalType === "del" && (
              <>
                <label>Channel</label>

                <select
                  value={channel}
                  onChange={(event) =>
                    setChannel(event.target.value)
                  }
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
          >
            {modalType === "reservation" ? "Keep Reserved" : "Cancel"}
          </button>

          <button
            type="button"
            className="btn btn-p"
            onClick={handleConfirm}
          >
            {modalType === "table"
              ? "Open & take order"
              : modalType === "reservation"
                ? "Seat guests"
                : "Create & add items"}
          </button>
        </div>
      </div>
    </div>
  );
};

export { FloorModal };