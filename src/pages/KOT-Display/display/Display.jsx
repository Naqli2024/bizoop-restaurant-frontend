
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  Play,
  Printer,
  Zap,
  Eject,
} from "lucide-react";

import "../../../assets/styles/display.css";
import ManagerAuthModal from "./ManagerAuthModal";
import PrintModal from "./PrintModal";

import {
  getKitchenDisplay,
  startKot as startKotAction,
  updateKotItemStatus,
} from "../../../redux/Kitchen/KitchenSlice";
import { toast } from "react-toastify";
import { getKitchenStation } from "../../../redux/Kitchen/KotSlice";

const STATION_ICONS = {
  "Main Kitchen": "🍳",
  Tandoor: "🔥",
  Bar: "🍹",
  Dessert: "🍨",
};

// Convert API response into existing UI format
const formatKot = (kot) => ({
  ...kot,
  id: kot._id,
  number: `${kot.kotNumber?.slice(0, 9)}${kot.kotNumber?.slice(-5)}`,
  table: kot.tableName || "-",
  station: kot.kitchenStationName || "-",
  customer: kot.customerName,
  captain: kot.captainName || "—",
  time: kot.createdAt
    ? new Date(kot.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "—",
  readyTime: kot.readyAt
    ? new Date(kot.readyAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "—",
  status: kot.kotStatus,
  items: (kot.items || []).map((item) => ({
    ...item,
    name: item.itemName,
    qty: item.quantity,
    done: item.itemStatus === "Ready",
  })),
});

export default function Display() {
  const dispatch = useDispatch();

  // REDUX DATA
  const {
    summary,
    stations: displayStations,
    columns,
    loading,

  } = useSelector((state) => state.kitchen);
  const { stations } = useSelector((state) => state.stations)

  const [selectedStation, setSelectedStation] = useState("All");
  const [priorityIds, setPriorityIds] = useState([]);
  const [authKot, setAuthKot] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [printKot, setPrintKot] = useState(null);


  // GET KITCHEN DISPLAY
  useEffect(() => {
    dispatch(getKitchenDisplay());
    dispatch(getKitchenStation());
  }, [dispatch]);


  // GET ALL KOTS FROM REDUX
  const kots = useMemo(() => {
    const allKots = [
      ...(columns?.new || []),
      ...(columns?.preparing || []),
      ...(columns?.ready || []),
    ];

    return allKots.map(formatKot);
  }, [columns]);

  // STATION TABS
  const STATIONS = useMemo(
    () => [
      "All",
      ...(stations || [])
        .filter((station) => station.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((station) => station.name),
    ],
    [stations]
  );

  // FILTER KOTS
  const filteredKots = useMemo(() => {
    return kots.filter(
      (kot) =>
        selectedStation === "All" ||
        kot.station === selectedStation
    );
  }, [kots, selectedStation]);

  // STATION COUNTS
  const stationCounts = useMemo(() => {
    const counts = {
      All: summary?.total || 0,
    };

    STATIONS.slice(1).forEach((name) => {
      counts[name] =
        displayStations?.find((station) => station.name === name)?.count || 0;
    });

    return counts;
  }, [STATIONS, displayStations, summary]);

  // REFRESH KITCHEN DISPLAY
  const refreshKitchen = () => {
    dispatch(getKitchenDisplay());
  };

  // MANAGER AUTHORISED REPRINT
  function handleAuthorised(kot) {
    setAuditLog((previous) => [
      ...previous,
      {
        kot: kot.number,
        action: "REPRINT",
        at: new Date().toLocaleTimeString(),
      },
    ]);

    setAuthKot(null);
    setPrintKot(kot);
  }

  // START KOT API
  async function handleStartKot(kotId) {
    try {
      await dispatch(startKotAction(kotId)).unwrap();

      refreshKitchen();
    } catch (error) {
      console.error("Start KOT error:", error);
    }
  }

  async function markReady(kot) {
    try {
      await Promise.all(
        kot.items.map((item) =>
          dispatch(
            updateKotItemStatus({
              kotId: kot._id,
              itemId: item._id,
              payload: {
                status: "Ready",
              },
            })
          ).unwrap()
        )
      );
      refreshKitchen();
      toast.success("KOT marked as Ready");
    } catch (error) {
      console.error("Mark KOT ready error:", error);
      toast.error(error)
    }
  }

  async function bumpKot(kot) {
    try {
      await Promise.all(
        kot.items.map((item) =>
          dispatch(
            updateKotItemStatus({
              kotId: kot._id,
              itemId: item._id,
              payload: {
                status: "Served",
              },
            })
          ).unwrap()
        )
      );
      refreshKitchen();
      toast.success("KOT served successfully");
    } catch (error) {
      console.error("Serve KOT error:", error);
      toast.error(error)
    }
  }

  // PRIORITY
  function togglePriority(kotId) {
    setPriorityIds((previous) =>
      previous.includes(kotId)
        ? previous.filter((id) => id !== kotId)
        : [...previous, kotId]
    );
  }

  // RENDER KOT CARD
  function renderKot(kot) {
    const isPriority = priorityIds.includes(kot.id);
    const allDone = kot.items.every((item) => item.done);

    return (
      <article
        className="kd-ticket"
        key={kot.id}
      >
        <div className="kd-ticket-header">
          <div className="kd-ticket-labels">
            <span className="kd-ticket-number">
              {kot.number}
            </span>

            <span className="kd-tag">
              {kot.table}
            </span>

            {isPriority && (
              <span className="kd-tag kd-tag-priority">
                ⚡ PRIORITY
              </span>
            )}
          </div>

          <span
            className="kd-ticket-age"
          >
            {kot.status === "Ready" ? kot.readyTime : kot.time}
          </span>
        </div>

        <div className="kd-ticket-meta">
          <span
            className={`kd-station kd-${kot.station
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {STATION_ICONS[kot.station]} {kot.station}
          </span>

          <span>{kot.customer}</span>
          <span>{kot.time}</span>
        </div>

        <div className="kd-ticket-items">
          {kot.items.map((item, index) => (
            <div
              className={`kd-item ${item.done ? "done" : ""
                }`}
              key={item._id || `${kot.id}-${index}`}
            >
              <span className="kd-qty">
                {item.qty}×
              </span>

              <span className="kd-item-name">
                {item.name}
              </span>

              <span className="kd-checkbox">
                {item.done ? <Check size={13} /> : ""}
              </span>
            </div>
          ))}
        </div>

        <div className="kd-ticket-actions">
          {kot.status === "New" && (
            <button
              type="button"
              className="kd-btn kd-btn-primary"
              onClick={() => handleStartKot(kot._id)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="kd-spinner"></span>
                  starting ...
                </>
              ) : (
                <>
                  <Play size={15} /> Start
                </>
              )}

            </button>
          )}

          {kot.status === "Preparing" && (
            <button
              type="button"
              className="kd-btn kd-btn-ready"
              onClick={() => markReady(kot)}
              disabled={loading}

            >
              {loading ? (
                <>
                  <span className="kd-spinner"></span>
                  Ready ...
                </>
              ) : (
                <>
                  <Check size={15} /> Ready
                </>
              )}

            </button>
          )}

          {/* {kot.status === "Ready" && (
            <button
              type="button"
              className="kd-btn"
              onClick={() => bumpKot(kot)}
              disabled={loading}
            >
              <Eject size={15} /> Bump
            </button>
          )} */}

          {kot.status !== "Ready" && (
            <>
              <button
                type="button"
                className="kd-btn"
                onClick={() => togglePriority(kot.id)}
                title="Toggle priority"
              >
                <Zap size={15} />
              </button>

              <button
                type="button"
                className="kd-btn"
                title="Reprint"
                onClick={() => setAuthKot(kot)}
              >
                <Printer size={15} />
              </button>
            </>
          )}
        </div>

        {kot.status === "Preparing" && allDone && (
          <p className="kd-all-done">
            All items checked
          </p>
        )}
      </article>
    );
  }

  return (
    <section className="kd-board">
      <header className="kd-header">
        <h2 className="kd-title">
          📟 Kitchen Display{" "}
          <span className="kd-live">LIVE</span>
        </h2>

        <div className="kd-summary">
          <span>
            <strong>{summary?.new || 0}</strong> new
          </span>

          <span>
            <strong>{summary?.preparing || 0}</strong> preparing
          </span>

          <span>
            <strong>{summary?.ready || 0}</strong> ready
          </span>

          <span>
            <strong>{summary?.total || 0}</strong> total
          </span>
        </div>
      </header>

      <div className="kd-station-tabs">
        {STATIONS.map((station) => (
          <button
            type="button"
            key={station}
            className={`kd-chip ${selectedStation === station ? "selected" : ""
              }`}
            onClick={() => setSelectedStation(station)}
          >
            {station === "All"
              ? "All stations"
              : `${STATION_ICONS[station] || "🍽"} ${station}`}

            <span className="kd-count">
              {stationCounts[station] || 0}
            </span>
          </button>
        ))}
      </div>
      <div className="kd-columns">
        <section className="kd-column">
          <h3 className="kd-column-title new">
            🆕 New{" "}
            <span>
              {
                filteredKots.filter(
                  (kot) => kot.status === "New"
                ).length
              }
            </span>
          </h3>

          <div className="kd-column-body">
            {filteredKots
              .filter((kot) => kot.status === "New")
              .map(renderKot)}
          </div>
        </section>

        <section className="kd-column">
          <h3 className="kd-column-title preparing">
            🔥 Preparing{" "}
            <span>
              {
                filteredKots.filter(
                  (kot) => kot.status === "Preparing"
                ).length
              }
            </span>
          </h3>

          <div className="kd-column-body">
            {filteredKots
              .filter((kot) => kot.status === "Preparing")
              .map(renderKot)}
          </div>
        </section>

        <section className="kd-column">
          <h3 className="kd-column-title ready">
            ✅ Ready — pick up{" "}
            <span>
              {
                filteredKots.filter(
                  (kot) => kot.status === "Ready"
                ).length
              }
            </span>
          </h3>

          <div className="kd-column-body">
            {filteredKots
              .filter((kot) => kot.status === "Ready")
              .map(renderKot)}
          </div>
        </section>
      </div>

      <ManagerAuthModal
        kot={authKot}
        onClose={() => setAuthKot(null)}
        onAuthorise={handleAuthorised}
      />

      <PrintModal
        kot={printKot}
        isPriority={
          printKot
            ? priorityIds.includes(printKot.id)
            : false
        }
        onClose={() => setPrintKot(null)}
      />
    </section>
  );
}
