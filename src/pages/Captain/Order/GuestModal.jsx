
import OrderModal from "./OrderModal";
import { GST_RATE } from "./OrderData";
import { inr } from "./OrderHelpers";

const MergeModal = ({ modal, label, openOrders, closeModal, doMerge }) => {
  if (!modal) return null;

  return (
    <OrderModal
      title="⛓ Merge tables"
      onClose={closeModal}
      footer={
        <button type="button" className="btn" onClick={closeModal}>
          Close
        </button>
      }
    >
      <p>Merge another table's order into {label}.</p>

      <div className="row wrap">
        {openOrders.length ? (
          openOrders.map((order) => {
            const subtotal = order.items.reduce(
              (sum, item) => sum + item.qty * item.price,
              0
            );

            return (
              <button
                type="button"
                key={order.table}
                className="chip"
                onClick={() => doMerge(order)}
              >
                {order.table} · {inr(subtotal * (1 + GST_RATE))}
              </button>
            );
          })
        ) : (
          <span className="muted">No other open tables</span>
        )}
      </div>
    </OrderModal>
  );
};

export default MergeModal;
