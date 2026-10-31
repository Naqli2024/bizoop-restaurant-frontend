import { STATUS_LABELS } from "../Floor/FloorData";

const FloorTable = ({
  table,
  order,
  status,
  dim,
  getMinutes,
  getTotal,
  onClick,
}) => {
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(getTotal(order));

  return (
    <div
      className="floor-tbl"
      data-s={status}
      role="button"
      tabIndex={0}
      aria-label={`Table ${table.id}: ${STATUS_LABELS[status]}`}
      style={{ opacity: dim ? 0.35 : 1 }}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="floor-tn">
        {table.id}
        <small>{table.seats} seats</small>
      </div>

      <div className="tt">
        {STATUS_LABELS[status] || status}
      </div>

      <div className="floor-tm">
        {order ? (
          <>
            {order.captain} · {order.pax} pax
            <br />
            {getMinutes(order.created)} min
            {order.prio ? " · ⚡" : ""}
          </>
        ) : table.res ? (
          <>
            {table.res.n} · {table.res.p} pax
            <br />
            at {table.res.t}
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