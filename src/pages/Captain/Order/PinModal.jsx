
import OrderModal from "./OrderModal";

const PinModal = ({ modal, patchModal, closeModal, submitPin }) => {
  if (!modal) return null;

  return (
    <OrderModal
      title="Manager PIN"
      onClose={closeModal}
      footer={
        <>
          <button type="button" className="btn" onClick={closeModal}>
            Cancel
          </button>
          <button type="button" className="btn modal-ok" onClick={submitPin}>
            Approve
          </button>
        </>
      }
    >
      <p>{modal.text}</p>

      <input
        className="scan-inp"
        type="password"
        inputMode="numeric"
        maxLength={6}
        autoFocus
        placeholder="Enter PIN"
        aria-label="Manager PIN"
        value={modal.pin}
        onChange={(event) =>
          patchModal({ pin: event.target.value, err: "" })
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") submitPin();
        }}
      />

      {modal.err && <div className="modal-err">{modal.err}</div>}
    </OrderModal>
  );
};

export default PinModal;
