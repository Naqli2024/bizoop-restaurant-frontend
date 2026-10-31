import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import "../../../assets/styles/perf.css";

const KITCHEN_DATA = [
  {
    name: "Main Kitchen",
    icon: "🍳",
    time: 15.7,
    target: 18,
    percentage: 69,
    tickets: 36,
    color: "#F59E0B",
  },
  {
    name: "Tandoor",
    icon: "🔥",
    time: 13.0,
    target: 14,
    percentage: 53,
    tickets: 36,
    color: "#F97316",
  },
  {
    name: "Bar",
    icon: "🍹",
    time: 4.8,
    target: 6,
    percentage: 82,
    tickets: 38,
    color: "#3B82F6",
  },
  {
    name: "Dessert",
    icon: "🍨",
    time: 3.6,
    target: 5,
    percentage: 97,
    tickets: 35,
    color: "#EC4899",
  },
];

const HOURLY_DATA = [
  { hour: "12:00", tickets: 16 },
  { hour: "13:00", tickets: 32 },
  { hour: "14:00", tickets: 19 },
  { hour: "19:00", tickets: 17 },
  { hour: "20:00", tickets: 33 },
  { hour: "21:00", tickets: 19 },
];

const SLOW_DISHES = [
  { name: "Dal Tadka", time: 18.5 },
  { name: "Fish Fry", time: 18.2 },
  { name: "Chicken 65", time: 17.9 },
  { name: "Veg Kurma", time: 17.4 },
  { name: "Butter Chicken", time: 17.4 },
  { name: "Tandoori Chicken (Half)", time: 17.2 },
];

const Perf = () => {
  return (
    <div className="pnl act kitchen-performance" id="p-perf">
      {/* HEADER */}
      <div className="ph">
        <span className="ph-title">
          ⚡ Kitchen performance
          <span className="ph-badge">Today</span>
        </span>
      </div>

      <div className="kitchen-scroll">
        {/* PERFORMANCE CARDS */}
        <div className="kitchen-metrics">
          {KITCHEN_DATA.map((kitchen) => (
            <div
              className="kitchen-metric"
              key={kitchen.name}
              style={{ "--accent": kitchen.color }}
            >
              <div className="kitchen-metric-label">
                {kitchen.icon} {kitchen.name}
              </div>

              <div className="kitchen-metric-value">
                {kitchen.time}
                <span> min</span>
              </div>

              <div
                className={`kitchen-metric-help ${
                  kitchen.percentage >= 80 ? "up" : "dn"
                }`}
              >
                {kitchen.percentage}% within {kitchen.target}-min target
                {" · "}
                {kitchen.tickets} tickets
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="kitchen-charts">
          {/* HOURLY TICKETS */}
          <div className="kitchen-card">
            <div className="kitchen-card-header">
              Tickets cooked by hour
            </div>

            <div className="kitchen-bar-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={HOURLY_DATA}
                  margin={{
                    top: 12,
                    right: 8,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="none"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="hour"
                    tick={{ fill: "var(--muted)", fontSize: 11 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "var(--muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  

                  <Bar
                    dataKey="tickets"
                    fill="var(--accent)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                    label={{
                      position: "top",
                      fill: "var(--text)",
                      fontSize: 11,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SLOWEST DISHES */}
          <div className="kitchen-card">
            <div className="kitchen-card-header">
              Slowest dishes (avg prep)
            </div>

            <div className="slow-dishes">
              {SLOW_DISHES.map((dish) => (
                <div className="slow-dish-row" key={dish.name}>
                  <span className="slow-dish-name" title={dish.name}>
                    {dish.name}
                  </span>

                  <div className="slow-dish-track">
                    <div
                      className="slow-dish-fill"
                      style={{
                        width: `${(dish.time / 22) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="slow-dish-time">
                    {dish.time.toFixed(1)}m
                  </span>
                </div>
              ))}
            </div>

            <div className="kitchen-cancelled">
              <span>Cancelled / modified tickets</span>
              <strong>1</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perf;