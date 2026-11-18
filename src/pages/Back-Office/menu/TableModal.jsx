import Modal from "./MenuModal";

const Kv = ({ label, value }) => (
  <div className="rm-kv"><span>{label}</span><b>{value}</b></div>
);

export default function TableModal({ table, onAddItem, onCall, onBill, onClose }) {
  if (!table) return null;

  const orders = table.orders ?? [];
  const occupied = table.occupiedSeats > 0 || orders.length > 0;

  // close first, then act, like the original buttons
  const run = (fn) => () => { onClose(); fn?.(table.id); };

  return (
    <Modal
      title={`Table ${table.name}`}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <button className="rm-btn" onClick={onClose}>✕ Close</button>
          <button className="rm-btn" onClick={run(onAddItem)}>Add item</button>
          {occupied && (
            <button className="rm-btn" onClick={run((id) => onCall(id, "waiter"))}>Call waiter</button>
          )}
          {occupied && (
            <button className="rm-btn rm-btn--primary" onClick={run(onBill)}>Bill</button>
          )}
        </>
      }
    >
      <div className="rm-kv-grid">
        <Kv label="Status" value={table.status} />
        <Kv label="Seats" value={table.meta} />
        <Kv label="Zone" value={table.zone} />
        <Kv label="Available seats" value={table.availableSeats} />
      </div>

      {occupied && (
        <>
          <h4 style={{ margin: "12px 0 6px",fontSize:"14px" }}>Customers orders</h4>
          {orders.length === 0 ? (
            <div className="rm-muted">No running orders</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rm-order-row">
                <b>{o.customerName}</b> · {o.guests} guests
                <div className="rm-muted">{o.orderStatus} · {o.paymentStatus}</div>
              </div>
            ))
          )}
        </>
      )}
    </Modal>
  );
}