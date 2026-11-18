import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Metric } from "../Shared";
import AddTableModal from "../AddTableModal"; // adjust path

const slug = (s = "") =>
  s.toLowerCase().replace(/\s+/g, "-");

export default function LiveFloorTab({
  tables = [],
  loading = false,
  onTable,
  waiterCalls = [],
  avgResponse = "—",
  onAttend,
}) {
  const { floors: storeFloors } = useSelector((s) => s.floors);

  // null = closed, "" = open with no preselected floor, "<id>" = open for that floor
  const [addTableFor, setAddTableFor] = useState(null);

  const occupied = tables.filter((t) => t.occupiedSeats > 0).length;

  const liveOrders = tables.reduce(
    (n, t) => n + t.orders.filter((o) => o.orderStatus === "Active").length,
    0
  );

  // Group existing flattened tables by floor
  const floors = [...new Set(tables.map((t) => t.zone))];

  // Match a zone name back to its floor id from the store
  const floorIdOf = (zone) =>
    storeFloors.find((f) => f.floorName === zone)?._id || "";

  return (
    <>
      <div className="rm-metrics">
        <Metric label="Tables occupied" value={`${occupied}/${tables.length}`} />
        <Metric label="Guest orders live" value={liveOrders} />
        <Metric label="Waiter calls open" value={waiterCalls.length} color="var(--green)" />
        <Metric label="Avg response" value={avgResponse} color="var(--blue)" />
      </div>

      {waiterCalls.length > 0 && (
        <div className="rm-waiter-card">
          <h4>Waiter calls</h4>
          {waiterCalls.map((call) => {
            const t = tables.find((x) => x.id === call.table);

            return (
              <div className="rm-waiter-item" key={call.id}>
                <div>
                  <b>Table {t?.name ?? call.table} · Assistance</b>
                  <div className="rm-muted">
                    {Math.floor((Date.now() - call.at) / 60000)} min ago
                  </div>
                </div>
                <button className="rm-btn rm-btn--primary" onClick={() => onAttend(call.id)}>
                  Attend
                </button>
              </div>
            );
          })}
        </div>
      )}

      {loading && tables.length === 0 && (
        <div className="rm-muted">Loading tables…</div>
      )}

      {!loading && tables.length === 0 && (
        <div className="rm-muted">No tables found.</div>
      )}

      <div className="rm-floor-zones">
        {floors.map((floor) => (
          <div className="rm-floor-zone-wrap" key={floor}>
            <section className="rm-floor-zone">
              <h4 className="rm-floor-zone__title">{floor}</h4>

              <div className="rm-floor">
                {tables
                  .filter((t) => t.zone === floor)
                  .map((t) => {
                    const order = t.orders?.[0];
                    const hasCall = waiterCalls.some((c) => c.table === t.id);

                    return (
                      <button
                        key={t.id}
                        className="rm-table-tile"
                        data-state={slug(t.status)}
                        onClick={() => onTable(t.id)}
                      >
                        <div className="rm-table-tile__top">
                          <strong>{t.name}</strong>
                          <small>{t.meta}</small>
                        </div>

                        <div className="rm-table-tile__state">
                          {t.status}
                          {hasCall && " 🛎"}
                        </div>

                        {t.occupiedSeats > 0 ? (
                          <div className="rm-muted">
                            {order?.customerName || "Guest"}
                            {" · "}
                            {order?.numberOfGuests ?? t.occupiedSeats} pax
                          </div>
                        ) : (
                          <div className="rm-muted">Tap to open table</div>
                        )}
                      </button>
                    );
                  })}
                <button
                  type="button"
                  className="rm-btn rm-btn--primary rm-floor-add"
                  disabled={loading}
                  onClick={() => setAddTableFor(floorIdOf(floor))}
                >
                  <Plus size={14} /> Add table
                </button>
              </div>
            </section>

          </div>
        ))}
      </div>

      {addTableFor !== null && (
        <AddTableModal
          floors={storeFloors}
          defaultFloorId={addTableFor}
          onClose={() => setAddTableFor(null)}
        />
      )}
    </>
  );
}