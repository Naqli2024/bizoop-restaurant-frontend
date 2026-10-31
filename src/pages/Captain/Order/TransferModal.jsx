
import OrderModal from "./OrderModal";

const TransferModal = ({
  modal,
  label,
  freeTables,
  closeModal,
  doTransfer,
}) => {
  if (!modal) return null;

  return (
    <OrderModal
      title="⇄ Transfer table"
      onClose={closeModal}
      footer={
        <button type="button" className="btn" onClick={closeModal}>
          Close
        </button>
      }
    >
      <p>Move {label} and its order to another table.</p>

      <div className="row wrap">
        {freeTables.length ? (
          freeTables.map((table) => (
            <button
              type="button"
              key={table}
              className="chip"
              onClick={() => doTransfer(table)}
            >
              {table}
            </button>
          ))
        ) : (
          <span className="muted">No free tables</span>
        )}
      </div>
    </OrderModal>
  );
};

export default TransferModal;
