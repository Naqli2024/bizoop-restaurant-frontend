import { useEffect, useMemo, useState } from "react";
import "../../../assets/styles/display.css";
import {
  Activity,
  AlertTriangle,
  ChefHat,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Coffee,
  Dessert,
  Flame,
  Gauge,
  Play,
  Printer,
  Radio,
  Zap,
  Utensils,
  Eject,
} from "lucide-react";
import ManagerAuthModal from "./ManagerAuthModal";
import PrintModal from "./PrintModal";

const INITIAL_KOTS = [
  {
    id: 132,
    number: "KOT-0132",
    table: "R1",
    station: "Main Kitchen",
    captain: "Divya R.",
    time: "14:40",
    age: "04:28",
    sla: "18m",
    status: "New",
    items: [
      { name: "Chicken Chettinad", qty: 1, done: false },
      { name: "Kerala Parotta", qty: 4, done: false },
    ],
  },
  {
    id: 133,
    number: "KOT-0133",
    table: "R1",
    station: "Bar",
    captain: "Divya R.",
    time: "14:40",
    age: "04:28",
    sla: "6m",
    status: "New",
    items: [{ name: "Mint Mojito", qty: 3, done: false }],
  },
  {
    id: 126,
    number: "KOT-0126",
    table: "F2",
    station: "Main Kitchen",
    captain: "Ravi K.",
    time: "14:18",
    age: "26:28",
    sla: "18m",
    status: "Preparing",
    priority: true,
    items: [
      { name: "Chicken 65", qty: 2, done: true },
      { name: "Kerala Parotta", qty: 6, done: true },
      { name: "Kothu Parotta", qty: 1, done: false },
    ],
  },
  {
    id: 127,
    number: "KOT-0127",
    table: "F2",
    station: "Tandoor",
    captain: "Ravi K.",
    time: "14:18",
    age: "26:28",
    sla: "14m",
    status: "Preparing",
    priority: true,
    items: [
      { name: "Tandoori Chicken (Half)", qty: 1, done: false },
    ],
  },
  {
    id: 122,
    number: "KOT-0122",
    table: "T4",
    station: "Main Kitchen",
    captain: "Priya S.",
    time: "14:27",
    age: "17:28",
    sla: "18m",
    status: "Preparing",
    items: [{ name: "Butter Chicken", qty: 1, done: false }],
  },
  {
    id: 123,
    number: "KOT-0123",
    table: "T4",
    station: "Tandoor",
    captain: "Priya S.",
    time: "14:27",
    age: "17:28",
    sla: "14m",
    status: "Preparing",
    items: [
      { name: "Butter Naan", qty: 4, done: false },
      { name: "Chicken Tikka", qty: 1, done: true },
    ],
  },
  {
    id: 134,
    number: "KOT-0134",
    table: "TA-01",
    station: "Main Kitchen",
    captain: "Ravi K.",
    time: "14:33",
    age: "11:28",
    sla: "18m",
    status: "Preparing",
    items: [{ name: "Chicken Biryani", qty: 3, done: false }],
  },
  {
    id: 125,
    number: "KOT-0125",
    table: "T5",
    station: "Main Kitchen",
    captain: "Karthik M.",
    time: "14:35",
    age: "09:28",
    sla: "18m",
    status: "Preparing",
    items: [
      { name: "Mutton Biryani", qty: 2, done: false },
      { name: "Gobi Manchurian", qty: 1, done: false },
    ],
  },
  {
    id: 136,
    number: "KOT-0136",
    table: "DEL-01",
    station: "Main Kitchen",
    captain: "Priya S.",
    time: "14:23",
    age: "10:00",
    sla: "18m",
    status: "Ready",
    items: [{ name: "Butter Chicken", qty: 1, done: true }],
  },
  {
    id: 137,
    number: "KOT-0137",
    table: "DEL-01",
    station: "Tandoor",
    captain: "Priya S.",
    time: "14:23",
    age: "10:00",
    sla: "14m",
    status: "Ready",
    items: [{ name: "Garlic Naan", qty: 3, done: true }],
  },
  {
    id: 135,
    number: "KOT-0135",
    table: "TA-01",
    station: "Dessert",
    captain: "Ravi K.",
    time: "14:33",
    age: "10:00",
    sla: "5m",
    status: "Ready",
    items: [{ name: "Gulab Jamun (2)", qty: 2, done: true }],
  },
];

const STATIONS = [
  "All",
  "Main Kitchen",
  "Tandoor",
  "Bar",
  "Dessert",
];

const STATION_ICONS = {
  "Main Kitchen": "🍳",
  Tandoor: "🔥",
  Bar: "🍹",
  Dessert: "🍨",
};

export default function Display() {
  const [kots, setKots] = useState(INITIAL_KOTS);
  const [selectedStation, setSelectedStation] = useState("All");
  const [priorityIds, setPriorityIds] = useState(
    INITIAL_KOTS.filter((kot) => kot.priority).map((kot) => kot.id)
  );
  const [authKot, setAuthKot] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [printKot, setPrintKot] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setKots((prev) =>
        prev.map((kot) => {
          const [min, sec] = kot.age.split(":").map(Number);
          const total = min * 60 + sec + 1;

          return {
            ...kot,
            age: `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
              total % 60
            ).padStart(2, "0")}`,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const filteredKots = useMemo(() => {
    return kots.filter(
      (kot) =>
        selectedStation === "All" ||
        kot.station === selectedStation
    );
  }, [kots, selectedStation]);

  const newCount = kots.filter((kot) => kot.status === "New").length;
  const cookingCount = kots.filter(
    (kot) => kot.status === "Preparing"
  ).length;
  const readyCount = kots.filter((kot) => kot.status === "Ready").length;

  const stationCounts = useMemo(() => {
    return {
      All: kots.length,
      "Main Kitchen": kots.filter(
        (kot) => kot.station === "Main Kitchen"
      ).length,
      Tandoor: kots.filter((kot) => kot.station === "Tandoor").length,
      Bar: kots.filter((kot) => kot.station === "Bar").length,
      Dessert: kots.filter((kot) => kot.station === "Dessert").length,
    };
  }, [kots]);

  function toggleItem(kotId, itemIndex) {
    setKots((previous) =>
      previous.map((kot) =>
        kot.id !== kotId
          ? kot
          : {
            ...kot,
            items: kot.items.map((item, index) =>
              index === itemIndex
                ? { ...item, done: !item.done }
                : item
            ),
          }
      )
    );
  }

  function startKot(kotId) {
    setKots((previous) =>
      previous.map((kot) =>
        kot.id === kotId && kot.status === "New"
          ? { ...kot, status: "Preparing" }
          : kot
      )
    );
  }

  function markReady(kotId) {
    setKots((previous) =>
      previous.map((kot) =>
        kot.id === kotId
          ? {
            ...kot,
            status: "Ready",
            items: kot.items.map((item) => ({
              ...item,
              done: true,
            })),
          }
          : kot
      )
    );
  }

  function bumpKot(kotId) {
    setKots((previous) =>
      previous.filter((kot) => kot.id !== kotId)
    );
  }

  function togglePriority(kotId) {
    setPriorityIds((previous) =>
      previous.includes(kotId)
        ? previous.filter((id) => id !== kotId)
        : [...previous, kotId]
    );
  }



  function renderKot(kot) {
    const isPriority = priorityIds.includes(kot.id);
    const isLate = kot.age.startsWith("26:");
    const allDone = kot.items.every((item) => item.done);

    return (
      <article
        className={`kd-ticket ${isLate ? "late" : ""} ${kot.age.startsWith("17:") || kot.age.startsWith("04:")
          ? "warn"
          : ""
          }`}
        key={kot.id}
      >
        <div className="kd-ticket-header">
          <div className="kd-ticket-labels">
            <span className="kd-ticket-number">{kot.number}</span>
            <span className="kd-tag">{kot.table}</span>
            {isPriority && (
              <span className="kd-tag kd-tag-priority">
                ⚡ PRIORITY
              </span>
            )}
          </div>

          <span
            className={`kd-ticket-age ${isLate ? "late" : ""
              }`}
          >
            {kot.age}
          </span>
        </div>

        <div className="kd-ticket-meta">
          <span className={`kd-station kd-${kot.station
            .toLowerCase()
            .replace(/\s+/g, "-")}`}>
            {STATION_ICONS[kot.station]} {kot.station}
          </span>
          <span>{kot.captain}</span>
          <span>{kot.time}</span>
          <span>SLA {kot.sla}</span>
        </div>

        <div className="kd-ticket-items">
          {kot.items.map((item, index) => (
            <button
              type="button"
              className={`kd-item ${item.done ? "done" : ""
                }`}
              key={`${kot.id}-${item.name}-${index}`}
              onClick={() => toggleItem(kot.id, index)}
              aria-pressed={item.done}
            >
              <span className="kd-qty">{item.qty}×</span>
              <span className="kd-item-name">{item.name}</span>
              <span className="kd-checkbox">
                {item.done ? <Check size={13} /> : ""}
              </span>
            </button>
          ))}
        </div>

        <div className="kd-ticket-actions">
          {kot.status === "New" && (
            <button
              type="button"
              className="kd-btn kd-btn-primary"
              onClick={() => startKot(kot.id)}
            >
              <Play size={15} /> Start
            </button>
          )}

          {kot.status === "Preparing" && (
            <button
              type="button"
              className="kd-btn kd-btn-ready"
              onClick={() => markReady(kot.id)}
            >
              <Check size={15} />Ready
            </button>
          )}

          {kot.status === "Ready" && (
            <button
              type="button"
              className="kd-btn"
              onClick={() => bumpKot(kot.id)}
            >
              <Eject size={15} />Bump
            </button>
          )}

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
          <p className="kd-all-done">All items checked</p>
        )}
      </article>
    );
  }

  return (
    <section className="kd-board">
      <header className="kd-header">
        <h2 className="kd-title">
          📟 Kitchen Display <span className="kd-live">LIVE</span>
        </h2>

        <div className="kd-summary">
          <span><strong>{newCount}</strong> new</span>
          <span><strong>{cookingCount}</strong> cooking</span>
          <span className="kd-late-count">
            <strong>3</strong> late
          </span>
          <span><strong>9</strong> cooked this hour</span>
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
              : `${STATION_ICONS[station]} ${station}`}
            <span className="kd-count">
              {stationCounts[station]}
            </span>
          </button>
        ))}
      </div>

      <div className="kd-columns">
        <section className="kd-column">
          <h3 className="kd-column-title new">
            🆕 New <span>{filteredKots.filter(
              (kot) => kot.status === "New"
            ).length}</span>
          </h3>

          <div className="kd-column-body">
            {filteredKots
              .filter((kot) => kot.status === "New")
              .map(renderKot)}
          </div>
        </section>

        <section className="kd-column">
          <h3 className="kd-column-title preparing">
            🔥 Preparing <span>{filteredKots.filter(
              (kot) => kot.status === "Preparing"
            ).length}</span>
          </h3>

          <div className="kd-column-body">
            {filteredKots
              .filter((kot) => kot.status === "Preparing")
              .map(renderKot)}
          </div>
        </section>

        <section className="kd-column">
          <h3 className="kd-column-title ready">
            ✅ Ready — pick up <span>{filteredKots.filter(
              (kot) => kot.status === "Ready"
            ).length}</span>
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
        isPriority={printKot ? priorityIds.includes(printKot.id) : false}
        onClose={() => setPrintKot(null)}
      />
    </section>
  );
}