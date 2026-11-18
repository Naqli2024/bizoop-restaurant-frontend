const FloorTable = ({
  table,
  order,
  status,
  getMinutes,
  getTotal,
  onClick,
}) => {
  const amount = order
    ? new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(getTotal(order))
    : null;

  const minutes = order ? getMinutes(order.created) : null;
  const extraOrders = table.orders.length - 1;

  return (
    <div
      className="floor-tbl"
      data-s={status}
      role="button"
      tabIndex={0}
      aria-label={`Table ${table.name}: ${status}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="floor-tn">
        {table.name}
        <small>
          {table.occupiedSeats}/{table.seats} seats
        </small>
      </div>

      <div className="floor-tt">{status}</div>

      <div className="floor-tm">
        {order ? (
          <>
            {order.cust?.name || "—"} · {order.pax} pax
            {minutes !== null && (
              <>
                <br />
                {minutes} min
              </>
            )}
            {order.status && (
              <>
                <br />
                <span className="floor-os" data-os={order.status}>
                  {order.status}
                </span>
              </>
            )}
            {extraOrders > 0 ? ` · +${extraOrders} more` : ""}
          </>
        ) : (
          "Tap to open table"
        )}
      </div>

      {order && <div className="floor-ta">{amount}</div>}
    </div>
  );
};

export { FloorTable };