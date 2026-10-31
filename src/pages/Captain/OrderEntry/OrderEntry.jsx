import { useMemo, useState } from "react";
import "../../../assets/styles/order-entry.css";
import { useNavigate } from "react-router-dom";
const INITIAL_ORDERS = [
    {
        id: "O9",
        label: "DEL-01",
        customer: "Priya S.",
        pax: 1,
        minutes: 33,
        captain: "Ravi K.",
        status: "Food ready",
        items: [
            { name: "Butter Chicken", qty: 1, status: "Ready" },
            { name: "Garlic Naan", qty: 3, status: "Ready" },
        ],
    },
    {
        id: "O2",
        label: "T4",
        customer: "Priya S.",
        pax: 4,
        minutes: 29,
        captain: "Priya S.",
        status: "Food ready",
        items: [
            { name: "Butter Chicken", qty: 1, status: "Preparing" },
            { name: "Butter Naan", qty: 4, status: "Preparing" },
            { name: "Chicken Tikka", qty: 1, status: "Ready" },
            { name: "Fresh Lime Soda", qty: 2, status: "Served" },
        ],
    },
    {
        id: "O6",
        label: "F3",
        customer: "Priya S.",
        pax: 4,
        minutes: 56,
        captain: "Priya S.",
        status: "Dining",
        items: [
            { name: "Veg Biryani", qty: 2, status: "Served" },
            { name: "Dal Tadka", qty: 1, status: "Served" },
            { name: "Butter Naan", qty: 2, status: "Served" },
            { name: "Masala Chai", qty: 4, status: "Served" },
        ],
    },
    {
        id: "O1",
        label: "T2",
        customer: "Ravi K.",
        pax: 3,
        minutes: 50,
        captain: "Ravi K.",
        status: "Bill requested",
        items: [
            { name: "Chicken Biryani", qty: 2, status: "Served" },
            { name: "Paneer Tikka", qty: 1, status: "Served" },
            { name: "Mango Lassi", qty: 2, status: "Served" },
            { name: "Gulab Jamun (2)", qty: 2, status: "Served" },
        ],
    },
    {
        id: "O5",
        label: "F2",
        customer: "Ravi K.",
        pax: 5,
        minutes: 38,
        captain: "Ravi K.",
        status: "In kitchen",
        items: [
            { name: "Chicken 65", qty: 2, status: "Served" },
            { name: "Tandoori Chicken (Half)", qty: 1, status: "Preparing" },
            { name: "Kerala Parotta", qty: 6, status: "Served" },
            { name: "Kothu Parotta", qty: 1, status: "Preparing" },
            { name: "Mint Mojito", qty: 3, status: "Served" },
            { name: "Brownie with Ice Cream", qty: 2, status: "Not sent" },
        ],
    },
    {
        id: "O8",
        label: "TA-01",
        customer: "Ravi K.",
        pax: 1,
        minutes: 23,
        captain: "Ravi K.",
        status: "In kitchen",
        items: [
            { name: "Chicken Biryani", qty: 3, status: "Preparing" },
            { name: "Gulab Jamun (2)", qty: 2, status: "Served" },
        ],
    },
    {
        id: "O3",
        label: "T5",
        customer: "Karthik M.",
        pax: 2,
        minutes: 21,
        captain: "Karthik M.",
        status: "In kitchen",
        items: [
            { name: "Mutton Biryani", qty: 2, status: "New" },
            { name: "Gobi Manchurian", qty: 1, status: "Preparing" },
        ],
    },
    {
        id: "O7",
        label: "R1",
        customer: "Divya R.",
        pax: 3,
        minutes: 16,
        captain: "Divya R.",
        status: "In kitchen",
        items: [
            { name: "Chicken Chettinad", qty: 1, status: "New" },
            { name: "Kerala Parotta", qty: 4, status: "New" },
            { name: "Mint Mojito", qty: 3, status: "New" },
        ],
    },
    {
        id: "O4",
        label: "T1",
        customer: "Divya R.",
        pax: 2,
        minutes: 12,
        captain: "Divya R.",
        status: "Ordering",
        items: [
            { name: "Masala Dosa", qty: 2, status: "Not sent" },
            { name: "Filter Coffee", qty: 2, status: "Not sent" },
        ],
    },
];
const STATUS_CLASS = {
    "Food ready": "ready",
    Dining: "dining",
    "Bill requested": "bill",
    "In kitchen": "kitchen",
    Ordering: "ordering",
};

/* =========================
   ITEM STATUS CLASS
========================= */

const ITEM_STATUS_CLASS = {
    Ready: "ready",
    Preparing: "preparing",
    Served: "served",
    New: "new",
    "Not sent": "draft",
};

function getReadyCount(order) {
    return (order.items || []).filter(
        (item) => item.status === "Ready"
    ).length;
}

function getActiveItems(order) {
    return (order.items || []).filter(
        (item) => item.status !== "Void" && item.status !== "void"
    );
}

export default function MyOrders({
    captainName = "Ravi K.",
    onOpenOrder,
    onServeReady,
}) {
    const [mineOnly, setMineOnly] = useState(true);
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    const navigate = useNavigate();

    // Match the original Mine / All captains behavior.
    const visibleOrders = useMemo(() => {
        const filteredOrders = orders.filter((order) => {
            const hasActiveItems = getActiveItems(order).length > 0;

            const isMine =
                !mineOnly || order.captain === captainName;

            return hasActiveItems && isMine;
        });

        // Ready orders first, then older orders.
        return filteredOrders.sort((a, b) => {
            const readyDifference =
                Number(getReadyCount(b) > 0) -
                Number(getReadyCount(a) > 0);

            if (readyDifference !== 0) {
                return readyDifference;
            }

            return (a.created ?? a.minutes ?? 0) -
                (b.created ?? b.minutes ?? 0);
        });
    }, [orders, mineOnly, captainName]);

    const mineOrders = orders.filter(
        (order) =>
            order.captain === captainName &&
            getActiveItems(order).length > 0
    );

    const readyItemsCount = mineOrders.reduce(
        (total, order) => total + getReadyCount(order),
        0
    );

    const openOrders = mineOrders.filter(
        (order) =>
            order.status !== "Bill requested" &&
            order.status !== "Dining"
    );

    const openCovers = openOrders.reduce(
        (total, order) => total + (Number(order.pax) || 0),
        0
    );

    // Mark ready items as served without removing the order card.
    function handleServeReady(order) {
        const readyItems = (order.items || []).filter(
            (item) => item.status === "Ready"
        );

        if (readyItems.length === 0) return;

        setOrders((previousOrders) =>
            previousOrders.map((currentOrder) => {
                if (currentOrder.id !== order.id) {
                    return currentOrder;
                }

                return {
                    ...currentOrder,
                    items: currentOrder.items.map((item) =>
                        item.status === "Ready"
                            ? { ...item, status: "Served" }
                            : item
                    ),
                    status: currentOrder.items.every(
                        (item) =>
                            item.status === "Ready" ||
                            item.status === "Served"
                    )
                        ? "Dining"
                        : currentOrder.status,
                };
            })
        );

        if (onServeReady) {
            onServeReady(order.id, readyItems);
        }

        // Refresh the order list after the local state update.
    }

    function handleOpenOrder(order) {
        if (onOpenOrder) {
            onOpenOrder(order);
            return;
        }

        navigate(`/captain/order?orderId=${encodeURIComponent(order.id)}`, {
            state: {
                orderId: order.id,
                order,
            },
        });
    }

    return (
        <section className="order-my-entry-panel">
            {/* HEADER */}

            <header className="order-my-entry-header">
                <div className="order-my-entry-heading">
                    <h2>
                        <span aria-hidden="true">📋</span> Orders
                    </h2>

                    <span className="order-my-entry-captain-badge">
                        {captainName}
                    </span>
                </div>

                <div className="order-my-entry-filters">
                    <button
                        type="button"
                        className={`order-my-entry-chip ${
                            mineOnly ? "selected" : ""
                        }`}
                        onClick={() => setMineOnly(true)}
                    >
                        Mine
                    </button>

                    <button
                        type="button"
                        className={`order-my-entry-chip ${
                            !mineOnly ? "selected" : ""
                        }`}
                        onClick={() => setMineOnly(false)}
                    >
                        All captains
                    </button>
                </div>
            </header>

            {/* METRICS */}

            <div className="order-my-entry-metrics">
                <div className="order-my-entry-metric">
                    <span className="order-my-entry-metric-label">
                        My open tables
                    </span>

                    <strong>{openOrders.length}</strong>
                </div>

                <div className="order-my-entry-metric green">
                    <span className="order-my-entry-metric-label">
                        Ready to serve
                    </span>

                    <strong>{readyItemsCount}</strong>
                </div>

                <div className="order-my-entry-metric blue">
                    <span className="order-my-entry-metric-label">
                        Covers (open)
                    </span>

                    <strong>{openCovers}</strong>
                </div>

                <div className="order-my-entry-metric purple">
                    <span className="order-my-entry-metric-label">
                        My sales today
                    </span>

                    <strong>₹15,660</strong>

                    <span className="order-my-entry-metric-note">
                        15 settled bills
                    </span>
                </div>
            </div>

            {/* ORDER CARDS */}

            <div className="order-my-entry-cards">
                {visibleOrders.length === 0 ? (
                    <div className="order-my-entry-empty">
                        No active orders. Open a table from the floor.
                    </div>
                ) : (
                    visibleOrders.map((order) => {
                        const activeItems = getActiveItems(order);
                        const readyCount = getReadyCount(order);
                        const isReady = readyCount > 0;

                        return (
                            <article
                                className={`order-my-entry-card ${
                                    isReady ? "hot" : ""
                                }`}
                                key={order.id}
                            >
                                {/* CARD HEADER */}

                                <div className="order-my-entry-card-header">
                                    <strong className="order-my-entry-order-number">
                                        {order.label}
                                    </strong>

                                    <span
                                        className={`order-my-entry-status ${
                                            STATUS_CLASS[order.status] || "kitchen"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                {/* ORDER DETAILS */}

                                <div className="order-my-entry-meta">
                                    {order.captain} · {order.pax} pax ·{" "}
                                    {order.minutes} min
                                </div>

                                {/* ITEMS */}

                                <div className="order-my-entry-items">
                                    {activeItems.map((item, index) => (
                                        <div
                                            className="order-my-entry-item"
                                            key={`${order.id}-${item.name}-${index}`}
                                        >
                                            <span className="order-my-entry-qty">
                                                {item.qty}×
                                            </span>

                                            <span className="order-my-entry-item-name">
                                                {item.name}
                                            </span>

                                            <span
                                                className={`order-my-entry-item-status ${
                                                    ITEM_STATUS_CLASS[item.status] ||
                                                    "draft"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* ACTIONS */}

                                <div className="order-my-entry-actions">
                                    {isReady && (
                                        <button
                                            type="button"
                                            className="order-my-entry-button serve"
                                            onClick={() =>
                                                handleServeReady(order)
                                            }
                                        >
                                            ✔ Serve {readyCount} ready
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="order-my-entry-button open"
                                        onClick={() =>
                                            handleOpenOrder(order)
                                        }
                                    >
                                        Open
                                    </button>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}