
import React, { useState } from "react";
import WasteModal from "./WasteModal";

const STOCK_ITEMS = [
    {
        id: "dough",
        name: "Parotta dough",
        type: "WIP",
        qty: 0,
        unit: "kg",
        value: 0,
        nextStep: "Portion and roll",
        useBy: null,
        processTo: { id: "par", label: "Half-cooked parotta", target: 300 },
        canWaste: false,
    },
    {
        id: "par",
        name: "Half-cooked parotta",
        type: "Semi-finished",
        qty: 120,
        unit: "pcs",
        value: 399,
        nextStep: "Final cook on the tawa",
        useBy: "07:06 pm",
        processTo: null,
        canWaste: true,
    },
    {
        id: "mch",
        name: "Marinated chicken",
        type: "Semi-finished",
        qty: 9,
        unit: "kg",
        value: 1934,
        nextStep: "Fry or grill",
        useBy: "09:06 pm",
        processTo: { id: "fry", label: "Chicken fry", target: 40 },
        canWaste: true,
    },
    {
        id: "fry",
        name: "Chicken fry",
        type: "Finished",
        qty: 0,
        unit: "portions",
        value: 0,
        nextStep: "Sell or serve",
        useBy: null,
        processTo: null,
        canWaste: false,
    },
    {
        id: "cry",
        name: "Chicken curry base",
        type: "Finished",
        qty: 38,
        unit: "portions",
        value: 2228,
        nextStep: "Sell or serve",
        useBy: "09:06 pm",
        processTo: null,
        canWaste: true,
    },
];

const STOCK_LOTS = [
    {
        id: "PAR-OPEN",
        item: "Half-cooked parotta",
        qty: 120,
        unit: "pcs",
        costPerUnit: 3.32,
        made: "09:06 am",
        useBy: "07:06 pm",
        status: "Fresh",
    },
    {
        id: "MCH-OPEN",
        item: "Marinated chicken",
        qty: 9,
        unit: "kg",
        costPerUnit: 214.93,
        made: "09:06 am",
        useBy: "09:06 pm",
        status: "Fresh",
    },
    {
        id: "CUR-OPEN",
        item: "Chicken curry base",
        qty: 38,
        unit: "portions",
        costPerUnit: 58.63,
        made: "09:06 am",
        useBy: "09:06 pm",
        status: "Fresh",
    },
];

const formatValue = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
    })}`;

const formatUnitCost = (value) =>
    `₹${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const typeClass = (type) =>
    type === "Finished"
        ? "tag-completed"
        : type === "Semi-finished"
            ? "tag-semi-finished"
            : "tag-wip";

const lotClass = (status) =>
    status === "Fresh" ? "tag-completed" : "tag-running";

const StockTab = ({
    items = STOCK_ITEMS,
    lots = STOCK_LOTS,
    onProcess,
    onWaste,
    onDiscardExpired,
}) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleWasteSave = (record) => {
        if (onWaste) {
            onWaste(record);
        }

        setSelectedItem(null);
    };
    return (
        <div className="production-stock">
            {/* Toolbar */}
            <div className="production-toolbar">
                <p className="production-stock-description">
                    Raw material stays in the store. Work in progress,
                    semi-finished and finished items are held here, each
                    with its own next step.
                </p>

                <button
                    type="button"
                    className="production-btn production-btn-secondary"
                    onClick={() => onDiscardExpired?.()}
                >
                    Discard expired
                </button>
            </div>

            {/* Stock items card */}
            <div className="production-card production-stock-card">
                <div className="production-card-header">
                    <h3>Semi-finished &amp; ready stock</h3>
                    <span className="production-stock-count">
                        {items.length} items
                    </span>
                </div>

                <div className="production-table-wrap">
                    <table className="production-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Type</th>
                                <th className="num-r">Available</th>
                                <th className="num-r">Value</th>
                                <th>Next step</th>
                                <th>Earliest use-by</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <strong>{item.name}</strong>
                                        </td>

                                        <td>
                                            <span
                                                className={`production-tag ${typeClass(item.type)}`}
                                            >
                                                {item.type}
                                            </span>
                                        </td>

                                        <td className="num-r production-num">
                                            {item.qty} {item.unit}
                                        </td>

                                        <td className="num-r production-num">
                                            {formatValue(item.value)}
                                        </td>

                                        <td>{item.nextStep}</td>

                                        <td>
                                            {item.useBy ? (
                                                <span className="production-fresh">
                                                    {item.useBy}
                                                </span>
                                            ) : (
                                                <span className="production-muted">
                                                    —
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            <div className="production-actions">
                                                {item.processTo && (
                                                    <button
                                                        type="button"
                                                        className="production-btn production-btn-secondary"
                                                        onClick={() =>
                                                            onProcess?.(item.processTo)
                                                        }
                                                    >
                                                        Process to {item.processTo.label}
                                                    </button>
                                                )}

                                                {item.canWaste && item.qty > 0 && (
                                                    <button
                                                        type="button"
                                                        className="production-btn production-btn-secondary"
                                                        onClick={() => setSelectedItem(item)}
                                                    >
                                                        Waste
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="production-empty">
                                        No stock items available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Lots card */}
            <div className="production-card production-stock-card">
                <div className="production-card-header">
                    <h3>Lots</h3>
                    <span className="production-stock-count">
                        {lots.length} batches
                    </span>
                </div>

                <div className="production-table-wrap">
                    <table className="production-table">
                        <thead>
                            <tr>
                                <th>Batch</th>
                                <th>Item</th>
                                <th className="num-r">Left</th>
                                <th className="num-r">Cost / unit</th>
                                <th>Made</th>
                                <th>Use by</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {lots.length > 0 ? (
                                lots.map((lot) => (
                                    <tr key={lot.id}>
                                        <td>
                                            <strong>{lot.id}</strong>
                                        </td>

                                        <td>{lot.item}</td>

                                        <td className="num-r production-num">
                                            {lot.qty} {lot.unit}
                                        </td>

                                        <td className="num-r production-num">
                                            {formatUnitCost(lot.costPerUnit)}
                                        </td>

                                        <td>{lot.made}</td>

                                        <td>
                                            <span className="production-fresh">
                                                {lot.useBy}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`production-tag ${lotClass(lot.status)}`}
                                            >
                                                {lot.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="production-empty">
                                        No lots in stock.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedItem && (
                <WasteModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onSave={handleWasteSave}
                />
            )}
        </div>
    );
};

export default StockTab;
