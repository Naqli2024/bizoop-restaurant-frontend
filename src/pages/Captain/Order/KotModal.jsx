
import OrderModal from "./OrderModal";
import Thermal from "./Thermal";

const KotModal = ({ modal, closeModal, restaurantName }) => {
  if (!modal) return null;

  return (
    <OrderModal
      title={`🖨 ${modal.kots.length} KOT${modal.kots.length > 1 ? "s" : ""} sent`}
      size="lg"
      onClose={closeModal}
      footer={
        <button type="button" className="btn modal-ok" onClick={closeModal}>
          Done
        </button>
      }
    >
      <p>Items were grouped by station for the kitchen ticket display.</p>

      <div className="kot-prev">
        {modal.kots.map((kot) => (
          <Thermal key={kot.no} k={kot} shop={restaurantName} />
        ))}
      </div>
    </OrderModal>
  );
};

export default KotModal;
