import { useMemo, useState } from "react";
import "../../../../assets/styles/admin/stock.css";
import PurchaseOrderModal from "./PurchaseOrderModal";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const INITIAL_STOCK = [
    { name: "Basmati Rice", qty: 38, unit: "kg", min: 20, rate: 118, vendor: "Sri Lakshmi Traders" },
    { name: "Chicken", qty: 22, unit: "kg", min: 15, rate: 210, vendor: "Fresh Poultry Co." },
    { name: "Mutton", qty: 4.2, unit: "kg", min: 6, rate: 760, vendor: "Fresh Poultry Co." },
    { name: "Paneer", qty: 4.5, unit: "kg", min: 4, rate: 340, vendor: "Aavin Dairy" },
    { name: "Biryani Masala", qty: 1.1, unit: "kg", min: 1.5, rate: 520, vendor: "Sakthi Masala" },
    { name: "Cooking Oil", qty: 31, unit: "L", min: 15, rate: 135, vendor: "Sri Lakshmi Traders" },
    { name: "Curd", qty: 12, unit: "kg", min: 8, rate: 70, vendor: "Aavin Dairy" },
    { name: "Wheat Flour (Maida)", qty: 18, unit: "kg", min: 10, rate: 44, vendor: "Sri Lakshmi Traders" },
    { name: "Milk", qty: 25, unit: "L", min: 15, rate: 56, vendor: "Aavin Dairy" },
    { name: "Coffee Decoction", qty: 6, unit: "L", min: 3, rate: 210, vendor: "Kumbakonam Coffee" },
    { name: "Onion", qty: 40, unit: "kg", min: 20, rate: 38, vendor: "Koyambedu Market" },
    { name: "Tomato", qty: 9, unit: "kg", min: 10, rate: 42, vendor: "Koyambedu Market" },
    { name: "Seer Fish", qty: 0, unit: "kg", min: 5, rate: 780, vendor: "Kasimedu Fish Mkt" },
    { name: "Butter", qty: 3.4, unit: "kg", min: 2, rate: 560, vendor: "Aavin Dairy" },
    { name: "Eggs", qty: 120, unit: "nos", min: 60, rate: 6.5, vendor: "Sri Lakshmi Traders" },
    { name: "Packaging Box", qty: 140, unit: "nos", min: 100, rate: 9, vendor: "PackWell" },
];

const RECIPES = {
    "Chicken Biryani": [
        ["Basmati Rice", 0.2, "kg"],
        ["Chicken", 0.25, "kg"],
        ["Biryani Masala", 0.02, "kg"],
        ["Cooking Oil", 0.03, "L"],
        ["Curd", 0.04, "kg"],
        ["Onion", 0.08, "kg"],
    ],
    "Mutton Biryani": [
        ["Basmati Rice", 0.2, "kg"],
        ["Mutton", 0.25, "kg"],
        ["Biryani Masala", 0.02, "kg"],
        ["Cooking Oil", 0.03, "L"],
        ["Curd", 0.04, "kg"],
        ["Onion", 0.08, "kg"],
    ],
    "Egg Biryani": [
        ["Basmati Rice", 0.2, "kg"],
        ["Eggs", 2, "nos"],
        ["Biryani Masala", 0.02, "kg"],
        ["Cooking Oil", 0.03, "L"],
        ["Curd", 0.04, "kg"],
        ["Onion", 0.08, "kg"],
    ],
    "Veg Biryani": [
        ["Basmati Rice", 0.2, "kg"],
        ["Biryani Masala", 0.02, "kg"],
        ["Cooking Oil", 0.03, "L"],
        ["Curd", 0.04, "kg"],
        ["Onion", 0.1, "kg"],
        ["Tomato", 0.05, "kg"],
    ],
    "Chicken 65": [
        ["Chicken", 0.2, "kg"],
        ["Curd", 0.03, "kg"],
        ["Cooking Oil", 0.08, "L"],
        ["Eggs", 0.5, "nos"],
    ],
    "Chicken Tikka": [
        ["Chicken", 0.2, "kg"],
        ["Curd", 0.03, "kg"],
        ["Cooking Oil", 0.02, "L"],
    ],
    "Tandoori Chicken (Half)": [
        ["Chicken", 0.4, "kg"],
        ["Curd", 0.05, "kg"],
        ["Cooking Oil", 0.02, "L"],
        ["Butter", 0.01, "kg"],
    ],
    "Chicken Chettinad": [
        ["Chicken", 0.25, "kg"],
        ["Onion", 0.1, "kg"],
        ["Tomato", 0.06, "kg"],
        ["Cooking Oil", 0.04, "L"],
    ],
    "Butter Chicken": [
        ["Chicken", 0.25, "kg"],
        ["Butter", 0.03, "kg"],
        ["Tomato", 0.12, "kg"],
        ["Onion", 0.06, "kg"],
        ["Milk", 0.05, "L"],
        ["Cooking Oil", 0.02, "L"],
    ],
    "Paneer Butter Masala": [
        ["Paneer", 0.15, "kg"],
        ["Butter", 0.03, "kg"],
        ["Tomato", 0.12, "kg"],
        ["Onion", 0.06, "kg"],
        ["Milk", 0.05, "L"],
        ["Cooking Oil", 0.02, "L"],
    ],
    "Paneer Tikka": [
        ["Paneer", 0.18, "kg"],
        ["Curd", 0.04, "kg"],
        ["Onion", 0.03, "kg"],
        ["Cooking Oil", 0.02, "L"],
    ],
    "Fish Fry": [
        ["Seer Fish", 0.2, "kg"],
        ["Cooking Oil", 0.06, "L"],
        ["Wheat Flour (Maida)", 0.01, "kg"],
    ],
    "Dal Tadka": [
        ["Onion", 0.05, "kg"],
        ["Tomato", 0.06, "kg"],
        ["Butter", 0.01, "kg"],
        ["Cooking Oil", 0.02, "L"],
    ],
    "Butter Naan": [
        ["Wheat Flour (Maida)", 0.1, "kg"],
        ["Butter", 0.015, "kg"],
        ["Curd", 0.02, "kg"],
        ["Milk", 0.02, "L"],
    ],
    "Garlic Naan": [
        ["Wheat Flour (Maida)", 0.1, "kg"],
        ["Butter", 0.015, "kg"],
        ["Curd", 0.02, "kg"],
        ["Milk", 0.02, "L"],
    ],
    "Tandoori Roti": [
        ["Wheat Flour (Maida)", 0.08, "kg"],
    ],
    "Kerala Parotta": [
        ["Wheat Flour (Maida)", 0.12, "kg"],
        ["Cooking Oil", 0.03, "L"],
        ["Milk", 0.02, "L"],
    ],
    "Kothu Parotta": [
        ["Wheat Flour (Maida)", 0.15, "kg"],
        ["Eggs", 1, "nos"],
        ["Onion", 0.06, "kg"],
        ["Tomato", 0.04, "kg"],
        ["Cooking Oil", 0.05, "L"],
    ],
    "Filter Coffee": [
        ["Coffee Decoction", 0.04, "L"],
        ["Milk", 0.15, "L"],
    ],
    "Masala Chai": [
        ["Milk", 0.15, "L"],
    ],
    "Cold Coffee": [
        ["Coffee Decoction", 0.05, "L"],
        ["Milk", 0.2, "L"],
    ],
    "Mango Lassi": [
        ["Curd", 0.15, "kg"],
        ["Milk", 0.05, "L"],
    ],
};

const rateOf = (name) => INITIAL_STOCK.find((s) => s.name === name)?.rate ?? 0;
const unitOf = (name) => INITIAL_STOCK.find((s) => s.name === name)?.unit ?? "";

const INITIAL_WASTAGE = [
    { time: "16:49", item: "Cooking Oil", qty: 0.02, reason: "Returned by customer" },
    { time: "16:49", item: "Curd", qty: 0.05, reason: "Returned by customer" },
    { time: "16:49", item: "Chicken", qty: 0.35, reason: "Returned by customer" },
    { time: "11:20", item: "Tomato", qty: 1.5, reason: "Spoiled" },
    { time: "13:05", item: "Chicken", qty: 0.4, reason: "Over-prep" },
    { time: "15:40", item: "Milk", qty: 2, reason: "Curdled" },
].map((w) => ({ ...w, unit: unitOf(w.item), cost: w.qty * rateOf(w.item) }));

const nowHHMM = () =>
    new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const FLOW = [
    { title: "POS sale", sub: "deducts live", on: true },
    { title: "Recipe / BOM", sub: "22 dishes mapped", on: true },
    { title: "Stock", sub: "16 items", on: true },
    { title: "Purchase", sub: "PO from low stock" },
    { title: "GRN", sub: "planned" },
    { title: "Wastage", sub: "6 entries" },
    { title: "Vendors / warehouse", sub: "planned" },
];

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const rate = (n) => "₹" + n.toFixed(2);

function getStatus(item) {
    if (item.qty <= 0) return { label: "Out", mod: "out" };
    if (item.qty <= item.min) return { label: "Reorder", mod: "reorder" };
    return { label: "OK", mod: "ok" };
}

export default function Inventory() {
    const [stock, setStock] = useState(INITIAL_STOCK);
    const [dish, setDish] = useState("Chicken Tikka");
    const [qty, setQty] = useState(2);
    const [showPO, setShowPO] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const navigate=useNavigate();

    // wastage log
    const [wastage, setWastage] = useState(INITIAL_WASTAGE);
    const wastageToday = wastage.reduce((sum, w) => sum + w.cost, 0);

    // One click: log 1 unit of a random in-stock ingredient as "Spillage"
    const logWaste = () => {
        const available = stock.filter((s) => s.qty > 0);
        if (!available.length) return;
        const pick = available[Math.floor(Math.random() * available.length)];
        const amount = Math.min(1, pick.qty);

        setStock((prev) =>
            prev.map((s) =>
                s.name === pick.name ? { ...s, qty: Math.max(0, +(s.qty - amount).toFixed(3)) } : s
            )
        );
        setWastage((prev) => [
            { time: nowHHMM(), item: pick.name, qty: amount, unit: pick.unit, reason: "Spillage", cost: amount * pick.rate },
            ...prev,
        ]);
    };

    const stats = useMemo(() => {
        const low = stock.filter((s) => s.qty <= s.min);
        return {
            value: stock.reduce((sum, s) => sum + s.qty * s.rate, 0),
            low,
            out: stock.filter((s) => s.qty <= 0).length,
        };
    }, [stock]);

    const consumption = (RECIPES[dish] || []).map(([name, per, unit]) => ({
        name,
        unit,
        used: +(per * qty).toFixed(3),
    }));

    const handleSendPO = (orders) => {
        const newPOs = orders.map((po, index) => ({
            id: `PO-${String(purchaseOrders.length + index + 1).padStart(3, "0")}`,
            vendor: po.vendor,
            date: new Date().toISOString().split("T")[0],
            lines: po.lines,
            total: po.total,
            status: "Sent",
        }));

        setPurchaseOrders((prev) => [...prev, ...newPOs]);

        setShowPO(false);
    };

    return (
        <section className="stock-panel">
            <header className="stock-header">
                <span className="stock-title">
                    📦 Inventory <span className="stock-badge">auto-deduct on sale</span>
                </span>
                <button
                    type="button"
                    className="stock-btn stock-btn--primary"
                    onClick={() => setShowPO(true)}
                >
                    Create PO for low stock ({stats.low.length})
                </button>
            </header>

            <div className="stock-body">
                <div className="stock-flow">
                    {FLOW.map((s) => (
                        <div key={s.title} className={`stock-flow-step${s.on ? " stock-flow-step--on" : ""}`}>
                            <b>{s.title}</b>
                            {s.sub}
                        </div>
                    ))}
                </div>

                <div className="stock-metrics">
                    <div className="stock-metric">
                        <div className="stock-metric-label">Stock value</div>
                        <div className="stock-metric-value">{inr(stats.value)}</div>
                    </div>
                    <div className="stock-metric stock-metric--warn">
                        <div className="stock-metric-label">At / below minimum</div>
                        <div className="stock-metric-value">{stats.low.length}</div>
                    </div>
                    <div className="stock-metric stock-metric--danger">
                        <div className="stock-metric-label">Out of stock</div>
                        <div className="stock-metric-value">{stats.out}</div>
                    </div>
                    <div className="stock-metric">
                        <div className="stock-metric-label">Wastage today</div>
                        <div className="stock-metric-value">{inr(wastageToday)}</div>
                    </div>
                </div>

                <div className="stock-grid">
                    <div className="stock-table-wrap">
                        <table className="stock-table">
                            <thead>
                                <tr>
                                    <th>Ingredient</th>
                                    <th className="stock-right">In stock</th>
                                    <th className="stock-right">Min</th>
                                    <th className="stock-right">Rate</th>
                                    <th>Vendor</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stock.map((item) => {
                                    const st = getStatus(item);
                                    return (
                                        <tr key={item.name}>
                                            <td>{item.name}</td>
                                            <td className="stock-num stock-right">{item.qty} {item.unit}</td>
                                            <td className="stock-num stock-right">{item.min}</td>
                                            <td className="stock-num stock-right">{rate(item.rate)}</td>
                                            <td>{item.vendor}</td>
                                            <td>
                                                <span className={`stock-tag stock-tag--${st.mod}`}>{st.label}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <aside className="stock-side">
                        <div className="stock-card">
                            <div className="stock-card-header">What does a sale consume?</div>
                            <div className="stock-sim-controls">
                                <select
                                    className="stock-select"
                                    value={dish}
                                    onChange={(e) => setDish(e.target.value)}
                                    aria-label="Dish"
                                >
                                    {Object.keys(RECIPES).map((d) => (
                                        <option key={d}>{d}</option>
                                    ))}
                                </select>
                                <input
                                    className="stock-input"
                                    type="number"
                                    min="1"
                                    value={qty}
                                    onChange={(e) => setQty(Math.max(1, +e.target.value || 1))}
                                    aria-label="Quantity"
                                />
                            </div>
                            <div style={{ marginTop: 8 }}>
                                {consumption.map((c) => (
                                    <div className="stock-row" key={c.name}>
                                        <span>{qty} {dish} → {c.name}</span>
                                        <span className="stock-num">{c.used} {c.unit}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="stock-card-note">
                                Takeaway and delivery orders also consume one packaging box per main dish.
                            </div>
                        </div>

                        <div className="stock-card">
                            <div className="stock-card-header">
                                Live consumption <span className="stock-muted">from bills settled now</span>
                            </div>
                            <div className="stock-card-note">
                                Settle a bill in Cashier view — ingredient usage appears here.
                            </div>
                        </div>

                        <div className="stock-card">
                            <div className="stock-card-header">
                                Wastage log
                                <button type="button" className="stock-btn" onClick={logWaste}>
                                    + Log
                                </button>
                            </div>

                            {wastage.map((w, i) => (
                                <div className="stock-row" key={i}>
                                    <span>{w.time} · {w.item} {w.qty} {w.unit}</span>
                                    <span className="stock-muted">{w.reason}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
                <div>
                    <button onClick={()=>navigate('/admin/store')} className="staff-back-btn">
                        <ArrowLeft size={14} />  Store
                    </button>
                </div>
            </div>
            {showPO &&
                <PurchaseOrderModal
                    open={showPO}
                    stock={stock}
                    onClose={() => setShowPO(false)}
                    onSend={handleSendPO}
                />
            }
        </section>
    );
}
