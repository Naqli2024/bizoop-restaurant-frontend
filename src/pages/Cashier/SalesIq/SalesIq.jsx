
import { useMemo, useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
    Tooltip,
} from "recharts";

import "../../../assets/styles/salesIntelligence.css";

const TIME_OPTIONS = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

const SCENARIOS = [
    { value: 1, label: "Scenario: normal" },
    { value: 1.25, label: "Festival / event +25%" },
    { value: 0.85, label: "Heavy rain −15%" },
];

const BRANCHES = ["All", "Anna Nagar", "T Nagar", "OMR"];

/* Original dashboard figures */

const BRANCH_DATA = {
    All: {
        todaySales: 116354,
        projectedClose: 153654,
        target: 122596,
        normalPace: 2968,
        salesPace: 5641,
        requiredPerHour: 9230,
        confidence: 52,
        rangeMin: 132000,
        rangeMax: 215000,
        day: "Wednesday",
        status: "ON TRACK",
        message: "Combined branch dashboard.",
    },
    "Anna Nagar": {
        todaySales: 0,
        projectedClose: 23039,
        target: 16000,
        normalPace: 768,
        salesPace: 0,
        requiredPerHour: 1600,
        confidence: 52,
        rangeMin: 18000,
        rangeMax: 29000,
        day: "Wednesday",
        status: "ON TRACK",
        message: "Anna Nagar outlet performance.",
    },
    "T Nagar": {
        todaySales: 1607,
        projectedClose: 38473,
        target: 25330,
        normalPace: 768,
        salesPace: 1607,
        requiredPerHour: 2372,
        confidence: 52,
        rangeMin: 29239,
        rangeMax: 47706,
        day: "Wednesday",
        status: "ON TRACK",
        message:
            "Sales are 109.4% above the normal Wednesday pace.",
    },
    OMR: {
        todaySales: 0,
        projectedClose: 76708,
        target: 16500,
        normalPace: 768,
        salesPace: 0,
        requiredPerHour: 1650,
        confidence: 52,
        rangeMin: 58000,
        rangeMax: 95000,
        day: "Wednesday",
        status: "ON TRACK",
        message: "OMR outlet performance.",
    },
};

const DAY_PART_ROWS = [
    ["Lunch", 10132, 1607, 13048],
    ["Evening", 5629, 0, 8475],
    ["Dinner", 9569, 0, 14407],
];

const HISTORY_ROWS = [
    ["Wed −1", 22682],
    ["Wed −2", 23834],
    ["Wed −3", 22106],
    ["Wed −4", 23488],
];

const WEEKLY_ROWS = [
    ["Monday", 22479],
    ["Tuesday", 23576],
    ["Wednesday", 23028],
    ["Thursday", 24672],
    ["Friday", 28510],
    ["Saturday", 35090],
    ["Sunday", 38928],
];

const CHANNEL_ROWS = [
    ["Dine-in", 1607, 100, 44, "positive"],
    ["Takeaway", 0, 0, -14, "negative"],
    ["Direct delivery", 0, 0, -8, "negative"],
    ["Swiggy", 0, 0, -13, "negative"],
    ["Zomato", 0, 0, -9, "negative"],
];

const OUTLETS = [
    { name: "Anna Nagar", amount: 23039, percentage: 44, status: "🟠" },
    { name: "T Nagar", amount: 38473, percentage: 152, status: "🟢" },
    { name: "OMR", amount: 76708, percentage: 368, status: "🟢" },
];

const BILLING_ROWS = [
    ["11:53", "TN-0013", "T5 · Dine-in", 1607],
];

const CHART_SOURCE = [
    { time: "11AM", actual: 0, forecast: null, normal: 0 },
    { time: "12PM", actual: 1607, forecast: 1607, normal: 768 },
    { time: "1PM", actual: null, forecast: 5420, normal: 3072 },
    { time: "2PM", actual: null, forecast: 11355, normal: 6620 },
    { time: "3PM", actual: null, forecast: 15600, normal: 10000 },
    { time: "4PM", actual: null, forecast: 16870, normal: 10500 },
    { time: "5PM", actual: null, forecast: 18140, normal: 11200 },
    { time: "6PM", actual: null, forecast: 20240, normal: 13760 },
    { time: "7PM", actual: null, forecast: 24010, normal: 16060 },
    { time: "8PM", actual: null, forecast: 29500, normal: 19300 },
    { time: "9PM", actual: null, forecast: 34900, normal: 22000 },
];

const formatINR = (value) =>
    `₹${Number(value ?? 0).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
    })}`;

const formatCompactINR = (value) => {
    const number = Number(value ?? 0);

    if (Math.abs(number) >= 100000) {
        return `₹${(number / 100000).toFixed(2)}L`;
    }

    return formatINR(number);
};

const formatVariance = (value) =>
    `${value > 0 ? "+" : ""}${Number(value).toFixed(1)} pts`;

function Card({ title, note, children }) {
    return (
        <section className="si-card">
            {title && (
                <div className="si-card-header">
                    <span>{title}</span>
                    {note && <span className="si-muted">{note}</span>}
                </div>
            )}
            {children}
        </section>
    );
}

function DataTable({ headers = [], rows = [] }) {
    return (
        <div className="si-table-wrap">
            <table className="si-table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={header}
                                className={index ? "si-num-right" : ""}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={`${row[0]}-${rowIndex}`}
                            className={row.highlight ? "si-highlight-row" : ""}
                        >
                            {row.cells.map((cell, cellIndex) => (
                                <td
                                    key={`${rowIndex}-${cellIndex}`}
                                    className={
                                        cellIndex
                                            ? "si-num-right si-num"
                                            : ""
                                    }
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function SummaryRows({ rows = [] }) {
    return (
        <div className="si-summary-rows">
            {rows.map(([label, value, bold = false], index) => (
                <div className="si-summary-row" key={`${label}-${index}`}>
                    <span>{label}</span>
                    <span className={bold ? "si-bold" : ""}>{value}</span>
                </div>
            ))}
        </div>
    );
}

function ProjectionChart({ data, target, max, asof }) {
    return (
        <div className="si-chart-wrap">
            <div className="si-chart">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 12, right: 22, left: 8, bottom: 2 }}
                    >
                        <CartesianGrid
                            stroke="var(--border)"
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="time"
                            tick={{ fill: "var(--muted)", fontSize: 10 }}
                            axisLine={{ stroke: "var(--border)" }}
                            tickLine={false}
                            interval={1}
                        />

                        <YAxis
                            domain={[0, max]}
                            ticks={[0, max / 2, max]}
                            tickFormatter={(value) =>
                                value === 0
                                    ? "₹0"
                                    : formatCompactINR(value)
                            }
                            tick={{ fill: "var(--muted)", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            width={55}
                        />

                        <Tooltip
                            formatter={(value, name) => [
                                value == null ? "—" : formatINR(value),
                                name,
                            ]}
                            contentStyle={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: 8,
                                color: "var(--text)",
                            }}
                        />

                        <ReferenceLine
                            y={target}
                            stroke="var(--a2)"
                            strokeDasharray="3 3"
                            label={{
                                value: "Target",
                                fill: "var(--a2)",
                                fontSize: 10,
                                position: "insideTopRight",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="actual"
                            name="Actual"
                            stroke="var(--green)"
                            strokeWidth={2}
                            dot={false}
                            connectNulls={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="forecast"
                            name="Forecast"
                            stroke="var(--accent)"
                            strokeWidth={2}
                            strokeDasharray="5 4"
                            dot={false}
                        />

                        <Line
                            type="monotone"
                            dataKey="normal"
                            name="Normal Wednesday"
                            stroke="var(--muted)"
                            strokeWidth={2}
                            strokeDasharray="5 4"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="si-chart-legend">
                <span>
                    <i className="si-legend-actual" /> Actual
                </span>
                <span>
                    <i className="si-legend-forecast" /> Forecast
                </span>
                <span>
                    <i className="si-legend-normal" /> Normal Wednesday
                </span>
            </div>

            <p className="si-muted">
                Cumulative projection · as of{" "}
                {asof === 12 ? "12 PM" : `${asof - 12} PM`}
            </p>
        </div>
    );
}

export default function SalesIq() {
    const [asof, setAsof] = useState(12);
    const [scenario, setScenario] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState("T Nagar");

    const today = new Date();

    const formattedDate = today
        .toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        .toUpperCase()
        .replace(",", " ·");

    const branch = BRANCH_DATA[selectedBranch] ?? BRANCH_DATA["T Nagar"];

    const todaySales = branch.todaySales;
    const target = branch.target;
    const projectedClose = Math.round(branch.projectedClose * scenario);
    const variance = projectedClose - target;

    const hoursLeft = Math.max(0, 22 - asof);

    const requiredPerHour =
        hoursLeft > 0
            ? Math.max(0, Math.ceil((target - todaySales) / hoursLeft))
            : 0;

    const currentMetrics = useMemo(
        () => [
            {
                label: "Today's sales",
                value: formatINR(todaySales),
                color: "green",
            },
            {
                label: "Projected close",
                value: formatINR(projectedClose),
                color: "accent",
            },
            {
                label: "Target",
                value: formatINR(target),
                color: "a2",
            },
            {
                label: "Variance",
                value: `${variance >= 0 ? "+" : "−"}${formatINR(
                    Math.abs(variance)
                )}`,
                color: variance >= 0 ? "green" : "red",
            },
            {
                label: "Sales pace /hr",
                value: `${formatINR(branch.salesPace)} vs ${formatINR(
                    branch.normalPace
                )}`,
                color: "green",
            },
            {
                label: "Required /hr",
                value: `${formatINR(requiredPerHour)} · ${hoursLeft}h left`,
                color: "red",
            },
            {
                label: "Confidence",
                value: `${branch.confidence}%`,
                color: "blue",
            },
            {
                label: "Likely range",
                value: `${formatINR(
                    Math.round(branch.rangeMin * scenario)
                )} – ${formatINR(Math.round(branch.rangeMax * scenario))}`,
                color: "blue",
            },
        ],
        [
            todaySales,
            projectedClose,
            target,
            variance,
            branch,
            requiredPerHour,
            hoursLeft,
            scenario,
        ]
    );

    const displayChartData = useMemo(
        () =>
            CHART_SOURCE.map((point, index) => {
                const hour = 11 + index;
                const elapsed = hour <= asof;

                return {
                    ...point,
                    actual: elapsed
                        ? hour === 12
                            ? todaySales
                            : hour < 12
                              ? 0
                              : null
                        : null,
                    forecast:
                        point.forecast == null
                            ? null
                            : Math.round(
                                  point.forecast *
                                      (projectedClose / 38473)
                              ),
                    normal: point.normal,
                };
            }),
        [asof, todaySales, projectedClose]
    );

    const displayDayParts = DAY_PART_ROWS.map(
        ([period, periodTarget, actual, close]) => [
            period,
            formatINR(periodTarget),
            formatINR(period === "Lunch" ? todaySales : 0),
            `${formatINR(Math.round(close * scenario))} 🟢`,
        ]
    );

    const historyAverage = Math.round(
        HISTORY_ROWS.reduce((sum, row) => sum + row[1], 0) /
            HISTORY_ROWS.length
    );

    const historyDisplay = [
        ...HISTORY_ROWS.map(([label, amount]) => [label, formatINR(amount)]),
        ["Average", formatINR(historyAverage), true],
        [
            "× current pace +109.4%",
            formatINR(Math.round(historyAverage * 2.094)),
        ],
        ["+ bookings / scenario", formatINR(projectedClose), true],
    ];

    const displayWeeklyRows = WEEKLY_ROWS.map(([day, normal]) => {
        const isSelectedDay = day === "Wednesday";

        return {
            cells: [
                day,
                formatINR(normal),
                isSelectedDay ? formatINR(todaySales) : "—",
                isSelectedDay ? formatINR(projectedClose) : "—",
            ],
            highlight: isSelectedDay,
        };
    });

    const displayChannels = CHANNEL_ROWS.map(
        ([name, amount, percentage, variancePoints, tone]) => [
            name,
            `${formatINR(name === "Dine-in" ? todaySales : amount)} · ${
                name === "Dine-in" ? (todaySales ? 100 : 0) : percentage
            }%`,
            `${variancePoints > 0 ? "+" : ""}${variancePoints.toFixed(1)} pts`,
            tone,
        ]
    );

    const displayOutlets = OUTLETS.map((outlet) => ({
        ...outlet,
        amount:
            outlet.name === selectedBranch
                ? `${formatINR(projectedClose)} · ${Math.round(
                      (projectedClose / target) * 100
                  )}%`
                : `${formatINR(outlet.amount)} · ${outlet.percentage}%`,
    }));

    const displayBilling = BILLING_ROWS.map(([time, bill, table, amount]) => ({
        cells: [time, bill, table, formatINR(amount)],
    }));

    const capacityAmount = Math.round(27173 * scenario);
    const capacityDemand = projectedClose;

    return (
        <div className="pnl act si-page" id="p-sint">
            <header className="si-page-header">
                <div className="si-title">
                    <span>📈 Sales intelligence</span>
                    <span className="si-date-badge">{formattedDate}</span>
                </div>

                <div className="si-header-controls">
                    <select
                        className="si-input"
                        value={asof}
                        onChange={(event) => setAsof(Number(event.target.value))}
                        aria-label="Sales as of time"
                    >
                        {TIME_OPTIONS.map((hour) => (
                            <option key={hour} value={hour}>
                                As of {hour === 12 ? "12 PM" : `${hour - 12} PM`}
                            </option>
                        ))}
                    </select>

                    <select
                        className="si-input"
                        value={scenario}
                        onChange={(event) =>
                            setScenario(Number(event.target.value))
                        }
                        aria-label="Sales scenario"
                    >
                        {SCENARIOS.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="si-scroll">
                <div className="si-branch-row">
                    {BRANCHES.map((branchName) => (
                        <button
                            type="button"
                            key={branchName}
                            className={`si-chip ${
                                selectedBranch === branchName
                                    ? "is-selected"
                                    : ""
                            }`}
                            onClick={() => setSelectedBranch(branchName)}
                        >
                            {branchName}
                        </button>
                    ))}
                </div>

                <div className="si-pad si-pad-top-zero">
                    <div className="si-status-card">
                        <strong>
                            {projectedClose >= target
                                ? "🟢 ON TRACK"
                                : "🟠 BELOW TARGET"}
                        </strong>{" "}
                        — {branch.message} Projected close{" "}
                        {formatINR(projectedClose)} against a target of{" "}
                        {formatINR(target)}.
                    </div>
                </div>

                <div className="si-metric-grid">
                    {currentMetrics.slice(0, 4).map((metric) => (
                        <div
                            className="si-metric-card"
                            data-accent={metric.color}
                            key={metric.label}
                        >
                            <div className="si-metric-label">
                                {metric.label}
                            </div>
                            <div className="si-metric-value">
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="si-metric-grid si-metric-grid-second">
                    {currentMetrics.slice(4).map((metric) => (
                        <div
                            className="si-metric-card"
                            data-accent={metric.color}
                            key={metric.label}
                        >
                            <div className="si-metric-label">
                                {metric.label}
                            </div>
                            <div className="si-metric-value">
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="si-pad si-pad-top-zero">
                    <Card
                        title="Sales projection"
                        note="cumulative · refreshes every minute"
                    >
                        <ProjectionChart
                            data={displayChartData}
                            target={target}
                            max={Math.max(42320, projectedClose * 1.1)}
                            asof={asof}
                        />
                    </Card>

                    <div className="si-grid-two">
                        <Card title="Day-part projection">
                            <DataTable
                                headers={[
                                    "Period",
                                    "Target",
                                    "Actual",
                                    "Expected close",
                                ]}
                                rows={displayDayParts.map((row) => ({
                                    cells: row,
                                }))}
                            />
                        </Card>

                        <Card title="Same-day history (last 4 Wednesdays)">
                            <SummaryRows rows={historyDisplay} />
                        </Card>
                    </div>

                    <div className="si-grid-two">
                        <Card
                            title="Sales by hour"
                            note="Peak window: 12:45–1:45 PM · 7–9 PM"
                        >
                            <DataTable
                                headers={["Hour", "Actual", "Normal", "Var."]}
                                rows={[
                                    {
                                        cells: [
                                            "11 AM",
                                            formatINR(todaySales),
                                            "₹768",
                                            "+109%",
                                        ],
                                    },
                                ]}
                            />
                        </Card>

                        <Card title="Normal sales by day">
                            <DataTable
                                headers={[
                                    "Day",
                                    "Normal",
                                    "Current",
                                    "Projection",
                                ]}
                                rows={displayWeeklyRows}
                            />
                        </Card>
                    </div>

                    <div className="si-grid-two">
                        <Card
                            title="Sales by channel"
                            note="vs historical share"
                        >
                            <SummaryRows
                                rows={displayChannels.map(
                                    ([name, amount, variancePoints, tone]) => [
                                        name,
                                        <>
                                            {amount}{" "}
                                            <span
                                                className={
                                                    tone === "positive"
                                                        ? "si-positive"
                                                        : "si-negative"
                                                }
                                            >
                                                {variancePoints}
                                            </span>
                                        </>,
                                    ]
                                )}
                            />
                        </Card>

                        <Card
                            title="Outlet performance"
                            note="click to drill in"
                        >
                            <div className="si-summary-rows">
                                {displayOutlets.map((outlet) => (
                                    <button
                                        type="button"
                                        className="si-summary-row si-outlet-row"
                                        key={outlet.name}
                                        onClick={() =>
                                            setSelectedBranch(outlet.name)
                                        }
                                    >
                                        <span>{outlet.name}</span>
                                        <span className="si-num">
                                            {outlet.amount} {outlet.status}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <Card title="Forecast feeds the rest of BOS">
                        <SummaryRows
                            rows={[
                                [
                                    "🍳 Kitchen",
                                    "Prepare ~26 extra biryani portions",
                                ],
                                [
                                    "📦 Store",
                                    <>
                                        Chicken need +6.5 kg · stock 22 kg{" "}
                                        <b className="si-negative">
                                            — insufficient for tomorrow
                                        </b>
                                    </>,
                                ],
                                ["🛒 Purchase", "Create PO for chicken today"],
                                ["👥 Labour", "Add 2 kitchen staff 7–10 PM"],
                                [
                                    "📊 Management",
                                    "Expected sales +67% vs normal",
                                ],
                            ]}
                        />
                    </Card>

                    <Card
                        title="Projected vs capacity"
                        note="Try the festival scenario"
                    >
                        <SummaryRows
                            rows={[
                                ["Forecast demand", formatINR(capacityDemand), true],
                                ["Kitchen capacity", formatINR(capacityAmount), true],
                            ]}
                        />

                        <div className="si-capacity-alert">
                            <b>
                                {capacityDemand <= capacityAmount
                                    ? "🟢 WITHIN CAPACITY"
                                    : "🔴 CAPACITY ALERT"}
                            </b>{" "}
                            —{" "}
                            {capacityDemand > capacityAmount
                                ? `Demand exceeds kitchen capacity by approximately ${formatINR(
                                      capacityDemand - capacityAmount
                                  )}. Actions: extra prep · extra staff · station reallocation · throttle slow items · alert manager.`
                                : "Projected demand is within kitchen capacity."}
                        </div>
                    </Card>

                    <Card title="Live billing" note="cashier / manager view">
                        <DataTable
                            headers={["Time", "Bill", "Table / type", "Amount"]}
                            rows={displayBilling}
                        />
                    </Card>

                    <p className="si-model-note">
                        Model: day-part pattern × current pace (60% carry-over)
                        + bookings. "Normal" is estimated from today's data
                        until 8+ weeks of history exist; targets are +10% over
                        normal. Weather, events and aggregator feeds aren't
                        connected yet — use the scenario selector.
                    </p>
                </div>
            </div>
        </div>
    );
}
