
import { STATUS_LABELS, STATUS_COLORS } from "../Floor/FloorData";

const FloorLegend = ({ tables, getStatus }) => {
  return (
    <div className="floor-stn-tabs">
      <div className="floor-legend">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <span key={status}>
            <i style={{ background: STATUS_COLORS[status] }} />
            {label}{" "}
            {
              tables.filter(
                (table) => getStatus(table) === status
              ).length
            }
          </span>
        ))}
      </div>
    </div>
  );
};

export { FloorLegend };
