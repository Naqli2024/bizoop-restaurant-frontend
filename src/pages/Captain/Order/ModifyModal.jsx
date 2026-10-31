
import OrderModal from "./OrderModal";
import { STATIONS } from "./OrderData";

const ModifyModal = ({ modal, patchModal, closeModal, submitModify }) => {
  if (!modal) return null;

  return (
    <OrderModal
      title={`✎ Modify ${modal.item.name}`}
      onClose={closeModal}
      footer={
        <>
          <button type="button" className="btn" onClick={closeModal}>
            Cancel
          </button>
          <button type="button" className="btn modal-ok" onClick={submitModify}>
            Send modification
          </button>
        </>
      }
    >
      <label className="fl" htmlFor="modify-kitchen-note">
        New instruction for kitchen
      </label>

      <textarea
        id="modify-kitchen-note"
        className="inp"
        rows={3}
        value={modal.note}
        onChange={(event) => patchModal({ note: event.target.value })}
      />

      <p style={{ marginTop: 8 }}>
        A modification ticket will be prepared for{" "}
        {STATIONS[modal.item.station]?.label}. Manager approval is required.
      </p>
    </OrderModal>
  );
};

export default ModifyModal;
