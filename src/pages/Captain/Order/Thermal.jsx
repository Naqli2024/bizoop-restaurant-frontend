
import { STATIONS } from "./OrderData";
import { pad4 } from "./OrderHelpers";

const Thermal = ({ k, shop }) => {
  return (
    <div className="thermal">
      <div className="c big">{shop}</div>
      <div className="c b">** KITCHEN ORDER TICKET **</div>

      {k.kind !== "new" && (
        <div className="c big">
          {k.kind === "cancel"
            ? "✕ CANCELLED ITEM"
            : "✎ MODIFIED ITEM"}
        </div>
      )}

      <hr />

      <div className="big">KOT-{pad4(k.no)}</div>
      <div>Table/Order: <b>{k.label}</b></div>
      <div>Captain: {k.captain}</div>
      <div>
        Time:{" "}
        {k.at.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div>Station: {STATIONS[k.station]?.label || k.station}</div>

      {k.prio && <div className="b">⚡ PRIORITY</div>}

      <hr />

      {k.items.map((item, index) => (
        <div className="li" key={item.uid ?? index}>
          <span>{item.qty}×</span>
          <span>
            {item.name}
            {item.note && (
              <>
                <br />
                <i>› {item.note}</i>
              </>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Thermal;
