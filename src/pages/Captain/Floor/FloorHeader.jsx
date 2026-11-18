const FloorHeader = ({
  sections,
  section,
  setSection,
  occupied,
  totalTables,
  myTables,
  setMyTables,
  onTakeaway,
  onDelivery,
}) => (
  <div className="floor-ph">
    <span className="floor-ph-title">
      🗺 Floor
      <span className="floor-ph-badge">
        {occupied}/{totalTables} occupied
      </span>
    </span>

    <div className="floor-row floor-wrap floor-right">
      {sections.map((item) => (
        <button
          type="button"
          key={item}
          className={`floor-chip ${section === item ? "floor-sel" : ""}`}
          onClick={() => setSection(item)}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        className={`floor-chip ${myTables ? "floor-sel" : ""}`}
        onClick={() => setMyTables((previous) => !previous)}
      >
        My tables
      </button>

      <button
        type="button"
        className="btn btn-sm btn-p"
        onClick={onTakeaway}
      >
        + Takeaway
      </button>

      <button
        type="button"
        className="btn btn-sm"
        onClick={onDelivery}
      >
        + Delivery
      </button>
    </div>
  </div>
);

export { FloorHeader };