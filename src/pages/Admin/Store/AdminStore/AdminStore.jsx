import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../assets/styles/adminStore.css";
import { Play } from "lucide-react";
import ItemModal from "../ItemModal";

const METRICS = [
    { id: "value", label: "Inventory value", value: "₹28,717", hint: "on hand", tone: "default" },
    { id: "critical", label: "Critical / low", value: "4 items", hint: "at or below minimum", tone: "danger" },
    { id: "variance", label: "Unexplained variance", value: "₹2,026", hint: "6 items", tone: "danger" },
    { id: "waste", label: "Waste logged", value: "₹339", hint: "today", tone: "warn" },
];

const ITEMS = [
    { key: "rice", name: "Basmati Rice" },
    { key: "chk", name: "Chicken" },
    { key: "mut", name: "Mutton" },
    { key: "pan", name: "Paneer" },
    { key: "mas", name: "Biryani Masala" },
    { key: "oil", name: "Cooking Oil" },
    { key: "cur", name: "Curd" },
    { key: "flr", name: "Wheat Flour (Maida)" },
    { key: "mlk", name: "Milk" },
    { key: "cof", name: "Coffee Decoction" },
    { key: "onn", name: "Onion" },
    { key: "tom", name: "Tomato" },
    { key: "fsh", name: "Seer Fish" },
    { key: "btr", name: "Butter" },
    { key: "egg", name: "Eggs" },
    { key: "pkg", name: "Packaging Box" },
];

const WORKSPACES = [
    { label: "Stock", tab: "admin", sub: "stock" },
    { label: "Reconciliation", tab: "back-office", sub: "recon" },
    { label: "Waste & control", tab: "admin", sub: "ctl" },
    { label: "Inventory", tab: "back-office", sub: "inventory" },
];

const ITEM_DETAILS = {
    rice: {
        icon: "🍚",
        price: "₹118.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "38.0 kg", bold: true },
            { label: "Today's requirement", value: "36.4 kg" },
            { label: "Tomorrow forecast", value: "35.9 kg" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹118.00" },
            { label: "30-day average", value: "₹109.46" },
            { label: "Change", value: "+7.8%", tone: "danger" },
        ],
        consumption: [
            { label: "Expected", value: "34.0" },
            { label: "Actual", value: "34.4" },
            { label: "Variance", value: "+0.4 (1.2%)", bold: true },
        ],
        suppliers: [
            { label: "Sri Lakshmi Traders", value: "₹118.00" },
            { label: "Local trader", value: "₹114.50" },
            { label: "Wholesale mart", value: "₹121.50" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Local trader at ₹114.50 (3% below current).",
    },
    chk: {
        icon: "🍗",
        price: "₹214.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "24.5 kg", bold: true },
            { label: "Today's requirement", value: "28.0 kg" },
            { label: "Tomorrow forecast", value: "30.5 kg" },
            { label: "Open PO", value: "1 pending" },
        ],
        cost: [
            { label: "Current", value: "₹214.00" },
            { label: "30-day average", value: "₹208.30" },
            { label: "Change", value: "+2.7%" },
        ],
        consumption: [
            { label: "Expected", value: "26.0" },
            { label: "Actual", value: "26.8" },
            { label: "Variance", value: "+0.8 (3.1%)", bold: true },
        ],
        suppliers: [
            { label: "Sri Lakshmi Traders", value: "₹214.00" },
            { label: "Fresh Poultry Co", value: "₹208.00" },
            { label: "Local trader", value: "₹219.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Fresh Poultry Co at ₹208.00 (3% below current).",
    },
    mut: {
        icon: "🥩",
        price: "₹720.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "12.0 kg", bold: true },
            { label: "Today's requirement", value: "14.5 kg" },
            { label: "Tomorrow forecast", value: "15.0 kg" },
            { label: "Open PO", value: "1 pending" },
        ],
        cost: [
            { label: "Current", value: "₹720.00" },
            { label: "30-day average", value: "₹705.20" },
            { label: "Change", value: "+2.1%" },
        ],
        consumption: [
            { label: "Expected", value: "13.0" },
            { label: "Actual", value: "13.9" },
            { label: "Variance", value: "+0.9 (6.9%)", bold: true, tone: "danger" },
        ],
        suppliers: [
            { label: "Meat Hub", value: "₹720.00" },
            { label: "Local butcher", value: "₹705.00" },
            { label: "Sri Lakshmi Traders", value: "₹735.00" },
        ],
        insight:
            "Consumption is 7% above recipe standard — check portioning and wastage. Best rate: Local butcher at ₹705.00 (2% below current).",
    },
    pan: {
        icon: "🧀",
        price: "₹340.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "6.2 kg", bold: true },
            { label: "Today's requirement", value: "9.0 kg" },
            { label: "Tomorrow forecast", value: "9.5 kg" },
            { label: "Open PO", value: "1 pending" },
        ],
        cost: [
            { label: "Current", value: "₹340.00" },
            { label: "30-day average", value: "₹332.00" },
            { label: "Change", value: "+2.4%" },
        ],
        consumption: [
            { label: "Expected", value: "7.5" },
            { label: "Actual", value: "9.9" },
            { label: "Variance", value: "+2.4 (32.0%)", bold: true, tone: "danger" },
        ],
        suppliers: [
            { label: "Amul Dairy Depot", value: "₹340.00" },
            { label: "Local dairy", value: "₹332.00" },
            { label: "Wholesale mart", value: "₹348.00" },
        ],
        insight:
            "Consumption is 32% above recipe standard — check portioning and wastage. Best rate: Local dairy at ₹332.00 (2% below current).",
    },
    mas: {
        icon: "🌶️",
        price: "₹640.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "3.4 kg", bold: true },
            { label: "Today's requirement", value: "2.8 kg" },
            { label: "Tomorrow forecast", value: "2.9 kg" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹640.00" },
            { label: "30-day average", value: "₹630.00" },
            { label: "Change", value: "+1.6%" },
        ],
        consumption: [
            { label: "Expected", value: "2.6" },
            { label: "Actual", value: "2.7" },
            { label: "Variance", value: "+0.1 (3.8%)", bold: true },
        ],
        suppliers: [
            { label: "Spice Traders", value: "₹640.00" },
            { label: "Local trader", value: "₹655.00" },
            { label: "Wholesale mart", value: "₹625.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Wholesale mart at ₹625.00 (2% below current).",
    },
    oil: {
        icon: "🛢️",
        price: "₹138.00",
        unit: "l",
        position: [
            { label: "Stock", value: "42.0 l", bold: true },
            { label: "Today's requirement", value: "18.0 l" },
            { label: "Tomorrow forecast", value: "17.5 l" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹138.00" },
            { label: "30-day average", value: "₹142.50" },
            { label: "Change", value: "-3.2%", tone: "ok" },
        ],
        consumption: [
            { label: "Expected", value: "17.0" },
            { label: "Actual", value: "17.4" },
            { label: "Variance", value: "+0.4 (2.4%)", bold: true },
        ],
        suppliers: [
            { label: "Sri Lakshmi Traders", value: "₹138.00" },
            { label: "Wholesale mart", value: "₹134.50" },
            { label: "Local trader", value: "₹141.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Wholesale mart at ₹134.50 (3% below current).",
    },
    cur: {
        icon: "🥣",
        price: "₹62.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "15.0 kg", bold: true },
            { label: "Today's requirement", value: "16.0 kg" },
            { label: "Tomorrow forecast", value: "16.5 kg" },
            { label: "Open PO", value: "1 pending" },
        ],
        cost: [
            { label: "Current", value: "₹62.00" },
            { label: "30-day average", value: "₹60.50" },
            { label: "Change", value: "+2.5%" },
        ],
        consumption: [
            { label: "Expected", value: "15.0" },
            { label: "Actual", value: "15.2" },
            { label: "Variance", value: "+0.2 (1.3%)", bold: true },
        ],
        suppliers: [
            { label: "Local dairy", value: "₹62.00" },
            { label: "Amul Dairy Depot", value: "₹64.00" },
            { label: "Wholesale mart", value: "₹60.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Wholesale mart at ₹60.00 (3% below current).",
    },
    flr: {
        icon: "🌾",
        price: "₹44.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "55.0 kg", bold: true },
            { label: "Today's requirement", value: "12.0 kg" },
            { label: "Tomorrow forecast", value: "11.5 kg" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹44.00" },
            { label: "30-day average", value: "₹43.20" },
            { label: "Change", value: "+1.9%" },
        ],
        consumption: [
            { label: "Expected", value: "11.0" },
            { label: "Actual", value: "11.1" },
            { label: "Variance", value: "+0.1 (0.9%)", bold: true },
        ],
        suppliers: [
            { label: "Sri Lakshmi Traders", value: "₹44.00" },
            { label: "Wholesale mart", value: "₹42.50" },
            { label: "Local trader", value: "₹45.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Wholesale mart at ₹42.50 (3% below current).",
    },
    mlk: {
        icon: "🥛",
        price: "₹56.00",
        unit: "l",
        position: [
            { label: "Stock", value: "30.0 l", bold: true },
            { label: "Today's requirement", value: "38.0 l" },
            { label: "Tomorrow forecast", value: "40.0 l" },
            { label: "Open PO", value: "1 pending" },
        ],
        cost: [
            { label: "Current", value: "₹56.00" },
            { label: "30-day average", value: "₹55.00" },
            { label: "Change", value: "+1.8%" },
        ],
        consumption: [
            { label: "Expected", value: "36.0" },
            { label: "Actual", value: "37.2" },
            { label: "Variance", value: "+1.2 (3.3%)", bold: true },
        ],
        suppliers: [
            { label: "Local dairy", value: "₹56.00" },
            { label: "Amul Dairy Depot", value: "₹58.00" },
            { label: "Co-op society", value: "₹55.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Co-op society at ₹55.00 (2% below current).",
    },
    cof: {
        icon: "☕",
        price: "₹310.00",
        unit: "l",
        position: [
            { label: "Stock", value: "4.5 l", bold: true },
            { label: "Today's requirement", value: "6.0 l" },
            { label: "Tomorrow forecast", value: "6.5 l" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹310.00" },
            { label: "30-day average", value: "₹302.00" },
            { label: "Change", value: "+2.6%" },
        ],
        consumption: [
            { label: "Expected", value: "5.5" },
            { label: "Actual", value: "5.6" },
            { label: "Variance", value: "+0.1 (1.8%)", bold: true },
        ],
        suppliers: [
            { label: "Coffee Works", value: "₹310.00" },
            { label: "Local trader", value: "₹318.00" },
            { label: "Wholesale mart", value: "₹305.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Wholesale mart at ₹305.00 (2% below current).",
    },
    onn: {
        icon: "🧅",
        price: "₹32.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "48.0 kg", bold: true },
            { label: "Today's requirement", value: "20.0 kg" },
            { label: "Tomorrow forecast", value: "21.0 kg" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹32.00" },
            { label: "30-day average", value: "₹38.00" },
            { label: "Change", value: "-15.8%", tone: "ok" },
        ],
        consumption: [
            { label: "Expected", value: "19.0" },
            { label: "Actual", value: "20.5" },
            { label: "Variance", value: "+1.5 (7.9%)", bold: true, tone: "danger" },
        ],
        suppliers: [
            { label: "Mandi agent", value: "₹32.00" },
            { label: "Local trader", value: "₹35.00" },
            { label: "Wholesale mart", value: "₹34.00" },
        ],
        insight:
            "Consumption is 8% above recipe standard — check portioning and wastage. Current supplier already has the best rate.",
    },
    tom: {
        icon: "🍅",
        price: "₹46.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "9.0 kg", bold: true },
            { label: "Today's requirement", value: "14.0 kg" },
            { label: "Tomorrow forecast", value: "15.0 kg" },
            { label: "Open PO", value: "1 pending" },
        ],
        cost: [
            { label: "Current", value: "₹46.00" },
            { label: "30-day average", value: "₹36.00" },
            { label: "Change", value: "+27.8%", tone: "danger" },
        ],
        consumption: [
            { label: "Expected", value: "13.0" },
            { label: "Actual", value: "13.4" },
            { label: "Variance", value: "+0.4 (3.1%)", bold: true },
        ],
        suppliers: [
            { label: "Mandi agent", value: "₹46.00" },
            { label: "Local trader", value: "₹44.00" },
            { label: "Wholesale mart", value: "₹49.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Local trader at ₹44.00 (4% below current).",
    },
    fsh: {
        icon: "🐟",
        price: "₹980.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "5.5 kg", bold: true },
            { label: "Today's requirement", value: "8.0 kg" },
            { label: "Tomorrow forecast", value: "9.0 kg" },
            { label: "Open PO", value: "1 pending" },
        ],
        cost: [
            { label: "Current", value: "₹980.00" },
            { label: "30-day average", value: "₹940.00" },
            { label: "Change", value: "+4.3%" },
        ],
        consumption: [
            { label: "Expected", value: "7.5" },
            { label: "Actual", value: "7.9" },
            { label: "Variance", value: "+0.4 (5.3%)", bold: true, tone: "danger" },
        ],
        suppliers: [
            { label: "Harbour Fish", value: "₹980.00" },
            { label: "Local trader", value: "₹1000.00" },
            { label: "Wholesale mart", value: "₹965.00" },
        ],
        insight:
            "Consumption is 5% above recipe standard — check portioning and wastage. Best rate: Wholesale mart at ₹965.00 (2% below current).",
    },
    btr: {
        icon: "🧈",
        price: "₹520.00",
        unit: "kg",
        position: [
            { label: "Stock", value: "8.0 kg", bold: true },
            { label: "Today's requirement", value: "2.5 kg" },
            { label: "Tomorrow forecast", value: "2.6 kg" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹520.00" },
            { label: "30-day average", value: "₹515.00" },
            { label: "Change", value: "+1.0%" },
        ],
        consumption: [
            { label: "Expected", value: "2.4" },
            { label: "Actual", value: "2.5" },
            { label: "Variance", value: "+0.1 (2.1%)", bold: true },
        ],
        suppliers: [
            { label: "Amul Dairy Depot", value: "₹520.00" },
            { label: "Wholesale mart", value: "₹510.00" },
            { label: "Local trader", value: "₹535.00" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Wholesale mart at ₹510.00 (2% below current).",
    },
    egg: {
        icon: "🥚",
        price: "₹6.20",
        unit: "pc",
        position: [
            { label: "Stock", value: "240 pc", bold: true },
            { label: "Today's requirement", value: "180 pc" },
            { label: "Tomorrow forecast", value: "190 pc" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹6.20" },
            { label: "30-day average", value: "₹6.00" },
            { label: "Change", value: "+3.3%" },
        ],
        consumption: [
            { label: "Expected", value: "170.0" },
            { label: "Actual", value: "176.0" },
            { label: "Variance", value: "+6.0 (3.5%)", bold: true },
        ],
        suppliers: [
            { label: "Poultry farm", value: "₹6.20" },
            { label: "Local trader", value: "₹6.40" },
            { label: "Wholesale mart", value: "₹5.90" },
        ],
        insight:
            "Consumption is within tolerance. Best rate: Wholesale mart at ₹5.90 (5% below current).",
    },
    pkg: {
        icon: "📦",
        price: "₹8.50",
        unit: "pc",
        position: [
            { label: "Stock", value: "600 pc", bold: true },
            { label: "Today's requirement", value: "220 pc" },
            { label: "Tomorrow forecast", value: "230 pc" },
            { label: "Open PO", value: "0 pending" },
        ],
        cost: [
            { label: "Current", value: "₹8.50" },
            { label: "30-day average", value: "₹8.50" },
            { label: "Change", value: "+0.0%" },
        ],
        consumption: [
            { label: "Expected", value: "210.0" },
            { label: "Actual", value: "214.0" },
            { label: "Variance", value: "+4.0 (1.9%)", bold: true },
        ],
        suppliers: [
            { label: "PackCo", value: "₹8.50" },
            { label: "Local trader", value: "₹9.00" },
            { label: "Wholesale mart", value: "₹8.80" },
        ],
        insight:
            "Consumption is within tolerance. Current supplier already has the best rate.",
    },
};

export default function AdminStore(

) {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState(null);

    const openItem = (item) =>
        setActiveItem({ icon: "📦", ...item, ...(ITEM_DETAILS[item.key] || {}) });
    const closeItem = () => setActiveItem(null);

    return (
        <section className="store-panel store-panel--active" id="p-dstore">
            <header className="store-header">
                <h1 className="store-header__title">
                    05 Store
                    <span className="store-header__badge">Stock intelligence centre</span>
                </h1>
            </header>

            <div className="store-body">
                <div className="store-metrics">
                    {METRICS.map((m) => (
                        <div key={m.id} className={`store-metric store-metric--${m.tone}`}>
                            <div className="store-metric__label">{m.label}</div>
                            <div className="store-metric__value">{m.value}</div>
                            <div className="store-metric__hint">{m.hint}</div>
                        </div>
                    ))}
                </div>

                <div className="store-content">
                    <div className="store-box">
                        <div className="store-box__title">✨ Ambient AI</div>
                        <div className="store-box__row">
                            <span>Inventory AI: Paneer consumption is 32% above recipe standard.</span>
                        </div>
                    </div>

                    <div className="store-box">
                        <div className="store-box__title">
                            Item workspaces
                            <span className="store-box__subtitle">click for the business-object view</span>
                        </div>
                        <div className="store-tags">
                            {ITEMS.map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    className="store-tag"
                                     onClick={() => openItem(item)}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="store-box">
                        <div className="store-box__title">Open workspace</div>
                        <div className="store-actions">
                            {WORKSPACES.map((w) => (
                                <button
                                    key={w.label}
                                    type="button"
                                    className="store-action"
                                    onClick={() => navigate(`/${w.tab}/${w.sub}`)}
                                >
                                    <span>{w.label}</span>
                                    <Play size={12} aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {activeItem &&
                <ItemModal item={activeItem} onClose={closeItem} />
            }
        </section>
    );
}
