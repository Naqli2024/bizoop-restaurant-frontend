import { STATUS_LABELS } from "../Floor/FloorData";

const FloorOrder = ({
  order,
  getMinutes,
  getTotal,
  onClick,
}) => {
  const status = order.status || "ordering";

  const orderType =
    order.type === "take"
      ? "Takeaway"
      : order.platform || "Delivery";

  
  return (
    <div
      className="floor-tbl"
      data-s={status}
      role="button"
      tabIndex={0}
      aria-label={`${order.label} ${orderType}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="floor-tn">
        {order.label}
        <small>{orderType}</small>
      </div>

      <div className="floor-tt">
        {STATUS_LABELS[status] || status}
      </div>

      <div className="floor-tm">
        {order.captain}
        <br />
        <div>{order.cust?.name || order.cust?.mobile}</div>
        
        {order.type !== "take" && order.type !== "del" && (
          <div>{getMinutes(order.created)} min</div>
        )}
      </div>

      <div className="floor-ta"> ₹{getTotal(order).toLocaleString("en-IN")}</div>
    </div>
  );
};

export { FloorOrder };