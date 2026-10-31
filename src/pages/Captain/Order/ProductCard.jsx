
import { STATIONS } from "./OrderData";
import { inr } from "./OrderHelpers";

const ProductCard = ({ item, onClick }) => {
  const station = STATIONS[item.station];
  const unavailable = item.off || item.left === 0;

  return (
    <div
      className={`pc ${unavailable ? "off" : ""}`}
      onClick={() => onClick(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${item.name} ${inr(item.price)}`}
    >
      <span
        className={`veg ${item.veg ? "" : "nv"}`}
        title={item.veg ? "Veg" : "Non-veg"}
      />

      {item.fav && <span className="pc-fav">⭐</span>}

      <span className="pc-icon" style={{ marginTop: 8 }}>
        {item.icon}
      </span>

      <div className="pc-name">{item.name}</div>
      <div className="pc-price">{inr(item.price)}</div>

      <div className="stn" style={{ color: station?.color }}>
        {station?.label || "Kitchen"}
      </div>

      {unavailable ? (
        <span className="off-t">UNAVAILABLE</span>
      ) : (
        item.left != null && (
          <span className="left">{item.left} left</span>
        )
      )}
    </div>
  );
};

export default ProductCard;
