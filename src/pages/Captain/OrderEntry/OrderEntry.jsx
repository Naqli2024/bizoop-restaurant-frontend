
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
    getCaptainReadyKot,
    getCaptainDashboard,
    getOrderById,
    checkOutOrder,
} from "../../../redux/Order/OrderSlice";

import { getLoggedInUser } from "../../../redux/Auth/AuthSlice";
import { updateKotItemStatus } from "../../../redux/Kitchen/KitchenSlice";
import { getFloorsTables } from "../../../redux/Floors/FloorSlice";
import { billRequest } from "../../../redux/Bills/BillSlice";

import "../../../assets/styles/order-entry.css";
import { Check } from "lucide-react";

/* =========================
   STATUS CLASS
========================= */

const STATUS_CLASS = {
    Ready: "ready",
    Served: "served",
};

const ITEM_STATUS_CLASS = {
    Ready: "ready",
    Served: "served",
};

/* =========================
   READY ITEMS
========================= */

function getReadyItems(kot) {
    return kot?.readyItems || [];
}

/* =========================
   MY ORDERS
========================= */

export default function MyOrders({
    onOpenOrder,
    onServeReady,
}) {
    const [mineOnly, setMineOnly] = useState(true);
    const [openingOrderId, setOpeningOrderId] = useState(null);
    const [checkingOutId, setCheckingOutId] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* =========================
       REDUX DATA
    ========================= */

    const {
        readyKot,
        dashboard,
        loading,
    } = useSelector((state) => state.order);

    const { user } = useSelector(
        (state) => state.authAdmin
    );

    const { floors } = useSelector(
        (state) => state.floors
    );

    const {
        bills,
        loading: billLoading,
    } = useSelector((state) => state.bills);

    /* =========================
       CAPTAIN DETAILS
    ========================= */

    const captainName = user?.role?.name || "Captain";
    const captainId = user?.userId || user?._id;

    /* =========================
       DASHBOARD DATA
    ========================= */

    const myDashboard = dashboard?.myDashboard;

    /* =========================
       FETCH API
    ========================= */

    useEffect(() => {
        dispatch(getCaptainReadyKot());
        dispatch(getCaptainDashboard());
        dispatch(getLoggedInUser());
        dispatch(getFloorsTables());
    }, [dispatch]);

    /* =========================
       API ORDERS
    ========================= */

    const orders = Array.isArray(readyKot)
        ? readyKot
        : [];

    /* =========================
       FILTER ORDERS
    ========================= */

    const visibleOrders = useMemo(() => {
        return orders.filter((kot) => {
            const hasActiveItems =
                getReadyItems(kot).length > 0;

            const kotCaptainId =
                kot.captainId?._id || kot.captainId;

            const isMine =
                !mineOnly ||
                String(kotCaptainId) === String(captainId);

            return hasActiveItems && isMine;
        });
    }, [orders, mineOnly, captainId]);

    /* =========================
       ORDER METRICS
    ========================= */

    const mineOrders = orders.filter((kot) => {
        const kotCaptainId =
            kot.captainId?._id || kot.captainId;

        return (
            String(kotCaptainId) === String(captainId) &&
            getReadyItems(kot).length > 0
        );
    });

    const openOrders = mineOrders.filter(
        (kot) => kot.kotStatus !== "Served"
    );

    const openCovers = openOrders.reduce(
        (total, kot) =>
            total + (Number(kot.numberOfGuests) || 0),
        0
    );

    /* =========================
       FIND TABLE NAME
    ========================= */

    const getTableName = (tableId) => {
        const id = tableId?._id || tableId;

        const allTables = Array.isArray(floors)
            ? floors.flatMap((floor) => floor.tables || [])
            : [];

        const table = allTables.find(
            (table) => String(table._id) === String(id)
        );

        return table?.tableName || "Table not found";
    };

    /* =========================
       DASHBOARD METRICS
    ========================= */

    const openTables =
        myDashboard?.openTables ?? 0;

    const readyItemsCount =
        myDashboard?.readyItemQuantity ?? 0;

    const readyItemLines =
        myDashboard?.readyItemLines ?? 0;

    const salesToday =
        myDashboard?.salesToday ?? 0;

    const completedOrders =
        myDashboard?.completedOrders ?? 0;

    /* =========================
       SERVE READY ITEMS
    ========================= */

    const handleServeReady = async (kot) => {
        const readyItems = getReadyItems(kot);

        if (!readyItems.length) return;

        try {
            for (const item of readyItems) {
                await dispatch(
                    updateKotItemStatus({
                        kotId: kot._id,
                        itemId: item._id,
                        payload: {
                            status: "Served",
                        },
                    })
                ).unwrap();
            }

            if (onServeReady) {
                onServeReady(kot._id, readyItems);
            }

            await Promise.all([
                dispatch(getCaptainReadyKot()).unwrap(),
                dispatch(getCaptainDashboard()).unwrap(),
            ]);

            toast.success("Items served successfully.");

        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Failed to serve items."
            );
        }
    };

    /* =========================
       BILL REQUEST
========================= */

    const handleBillRequest = async (orderId) => {
        try {
            const response = await dispatch(
                billRequest(orderId)
            ).unwrap();

            toast.success(
                response?.message || "Bill requested successfully."
            );

        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Failed to request bill."
            );
        }
    };

    /* =========================
       OPEN ORDER
       GET ORDER BY ID
    ========================= */

    const handleOpenOrder = async (kot) => {
        const orderId =
            kot.orderId?._id || kot.orderId;

        if (!orderId) {
            toast.error("Order ID not found.");
            return;
        }

        try {
            setOpeningOrderId(orderId);

            const response = await dispatch(
                getOrderById(orderId)
            ).unwrap();

            // API response:
            // response.data = complete order details

            const orderData = response?.data;

            if (!orderData) {
                toast.error("Order details not found.");
                return;
            }

            if (onOpenOrder) {
                onOpenOrder(orderData);
                return;
            }

            navigate(
                `/captain/order?orderId=${encodeURIComponent(orderId)}`,
                {
                    state: {
                        orderId,
                        kotId: kot._id,
                        order: orderData,
                    },
                }
            );

        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Failed to fetch order details."
            );
        } finally {
            setOpeningOrderId(null);
        }
    };

    /* =========================
       CHECKOUT ORDER
    ========================= */

    const handleCheckout = async (kot) => {
        const orderId =
            kot.orderId?._id || kot.orderId;

        if (!orderId) {
            toast.error("Order ID not found.");
            return;
        }

        // CHECK PAYMENT AND SEATING STATUS

        const isPaid =
            kot.paymentStatus?.toLowerCase() === "paid";

        const isSeated =
            kot.seatingStatus?.toLowerCase() === "seated";

        if (!isPaid || !isSeated) {
            toast.error("Order must be Paid and Seated.");
            return;
        }

        try {
            setCheckingOutId(orderId);

            const response = await dispatch(
                checkOutOrder(orderId)
            ).unwrap();

            toast.success(
                response?.message || "Checkout successful."
            );

            // REFRESH API DATA

            await Promise.all([
                dispatch(getCaptainReadyKot()).unwrap(),
                dispatch(getCaptainDashboard()).unwrap(),
                dispatch(getFloorsTables()).unwrap(),
            ]);

        } catch (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : error?.message || "Checkout failed."
            );
        } finally {
            setCheckingOutId(null);
        }
    };

    /* =========================
       UI
    ========================= */

    return (
        <section className="order-my-entry-panel">

            {/* HEADER */}

            <header className="order-my-entry-header">

                <div className="order-my-entry-heading">
                    <h2>
                        <span aria-hidden="true">📋</span>
                        Orders
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

                    <strong>{openTables}</strong>
                </div>

                <div className="order-my-entry-metric green">
                    <span className="order-my-entry-metric-label">
                        Ready to serve
                    </span>

                    <strong>{readyItemsCount}</strong>

                    <span className="order-my-entry-metric-note">
                        {readyItemLines} item lines
                    </span>
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

                    <strong>
                        ₹{Number(salesToday).toLocaleString("en-IN")}
                    </strong>

                    <span className="order-my-entry-metric-note">
                        {completedOrders} completed orders
                    </span>
                </div>

            </div>

            {/* ORDER CARDS */}

            <div className="order-my-entry-cards">

                {loading && orders.length === 0 ? (

                    <div className="order-my-entry-empty">
                        Loading orders...
                    </div>

                ) : visibleOrders.length === 0 ? (

                    <div className="order-my-entry-empty">
                        No active orders. Open a table from the floor.
                    </div>

                ) : (

                    visibleOrders.map((kot) => {

                        const tableName =
                            kot.tableId?.tableName ||
                            getTableName(kot.tableId);

                        const readyItems = getReadyItems(kot);
                        const readyCount = readyItems.length;

                        const orderId =
                            kot.orderId?._id || kot.orderId;

                        // CHECK BILL REQUEST STATUS

                        const isBillRequested =
                            kot.paymentStatus === "Bill Requested" ||
                            kot.paymentStatus === "billRequested" ||
                            (
                                bills?.orderId === orderId &&
                                (
                                    bills?.paymentStatus === "Bill Requested" ||
                                    bills?.paymentStatus === "billRequested"
                                )
                            );

                        // CHECKOUT CONDITION

                        const canCheckout =
                            kot.paymentStatus?.toLowerCase() === "paid" &&
                            kot.seatingStatus?.toLowerCase() === "seated";

                        return (
                            <article
                                className={`order-my-entry-card ${
                                    readyCount > 0 ? "hot" : ""
                                }`}
                                key={kot._id}
                            >

                                {/* CARD HEADER */}

                                <div className="order-my-entry-card-header">

                                    <strong className="order-my-entry-order-number">
                                        {tableName}
                                    </strong>

                                    <span
                                        className={`order-my-entry-status ${
                                            STATUS_CLASS[kot.kotStatus] || "kitchen"
                                        }`}
                                    >
                                        {kot.kotStatus}
                                    </span>

                                </div>

                                {/* ORDER DETAILS */}

                                <div className="order-my-entry-meta">
                                    {kot.customerName}
                                    {" · "}
                                    {kot.numberOfGuests} pax
                                    {" · "}
                                    {kot.kotNumber
                                        ? kot.kotNumber.slice(0, 9) +
                                          kot.kotNumber.slice(-6)
                                        : ""}
                                </div>

                                <div className="order-my-entry-meta">
                                    Order ID: {orderId}
                                </div>

                                {/* ITEMS */}

                                <div className="order-my-entry-items">

                                    {readyItems.map((item) => (

                                        <div
                                            className="order-my-entry-item"
                                            key={item._id}
                                        >

                                            <span className="order-my-entry-qty">
                                                {item.quantity}×
                                            </span>

                                            <span className="order-my-entry-item-name">
                                                {item.itemName}
                                            </span>

                                            <span
                                                className={`order-my-entry-item-status ${
                                                    ITEM_STATUS_CLASS[item.itemStatus] || ""
                                                }`}
                                            >
                                                {item.itemStatus}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                                {/* READY TIME */}

                                {kot.readyAt && (
                                    <div className="order-my-entry-meta">
                                        Ready at:{" "}
                                        {new Date(kot.readyAt).toLocaleTimeString(
                                            "en-IN",
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </div>
                                )}

                                {/* PAYMENT STATUS */}

                                <div className="order-my-entry-meta">
                                    Payment: {kot.paymentStatus || "Pending"}
                                </div>

                                <div className="order-my-entry-meta">
                                    Seating: {kot.seatingStatus || "—"}
                                </div>

                                {/* ACTIONS */}

                                <div className="order-my-entry-actions">

                                    {isBillRequested ? (

                                        <button
                                            type="button"
                                            className="order-my-entry-button bill-requested"
                                            onClick={() => handleBillRequest(orderId)}
                                            disabled={billLoading}
                                        >
                                            {billLoading
                                                ? "Requesting..."
                                                : "Bill Requested"}
                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            className="order-my-entry-button serve"
                                            onClick={() => handleServeReady(kot)}
                                            disabled={loading || readyCount === 0}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="kd-spinner"></span>
                                                    serving...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={14} />
                                                    Serve {readyCount} ready
                                                </>
                                            )}
                                        </button>

                                    )}

                                    {/* OPEN BUTTON */}

                                    <button
                                        type="button"
                                        className="order-my-entry-button open"
                                        onClick={() => handleOpenOrder(kot)}
                                        disabled={openingOrderId === orderId}
                                    >
                                        {openingOrderId === orderId
                                            ? "Opening..."
                                            : "Open"}
                                    </button>

                                    {/* CHECKOUT BUTTON */}

                                    {canCheckout && (
                                        <button
                                            type="button"
                                            className="order-my-entry-button checkout"
                                            onClick={() => handleCheckout(kot)}
                                            disabled={checkingOutId === orderId}
                                        >
                                            {checkingOutId === orderId
                                                ? "Checking out..."
                                                : "Checkout"}
                                        </button>
                                    )}

                                </div>

                            </article>
                        );
                    })

                )}

            </div>

        </section>
    );
}
