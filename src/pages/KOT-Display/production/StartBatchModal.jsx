
import React, { useEffect, useState } from "react";
import { X, Play } from "lucide-react";

const MATERIALS_BY_SOP = {
    CUR: [
        { name: "Chicken", standard: 22, unit: "kg", kitchen: 0, store: 22 },
        { name: "Tomato", standard: 8, unit: "kg", kitchen: 0, store: 9 },
        { name: "Onion", standard: 5, unit: "kg", kitchen: 0, store: 40 },
        { name: "Cooking Oil", standard: 3, unit: "L", kitchen: 0, store: 31 },
        { name: "Biryani Masala", standard: 0.6, unit: "kg", kitchen: 0, store: 1.1 },
    ],

    FRY: [
        { name: "Chicken", standard: 10, unit: "kg", kitchen: 0, store: 22 },
        { name: "Marination Masala", standard: 1, unit: "kg", kitchen: 0, store: 3 },
        { name: "Ginger Garlic Paste", standard: 0.5, unit: "kg", kitchen: 0, store: 2 },
        { name: "Cooking Oil", standard: 5, unit: "L", kitchen: 0, store: 31 },
        { name: "Chilli Powder", standard: 0.3, unit: "kg", kitchen: 0, store: 1.5 },
    ],
};

const StartBatchModal = ({ batch, onClose, onStart }) => {

    const MATERIALS = MATERIALS_BY_SOP[batch?.sop] || [];

    const [quantities, setQuantities] = useState(
        MATERIALS.map((material) => String(material.standard))
    );

    useEffect(() => {
        setQuantities(
            MATERIALS_BY_SOP[batch?.sop]?.map((material) =>
                String(material.standard)
            ) || []
        );
    }, [batch?.id, batch?.sop]);

    if (!batch) return null;

    const handleStart = () => {
        const issues = MATERIALS.map((material, index) => ({
            material: material.name,
            quantity: Number(quantities[index]),
            unit: material.unit,
        }));

        const invalid = issues.some(
            (issue) => !Number.isFinite(issue.quantity) || issue.quantity < 0
        );

        if (invalid) return;

        onStart(batch.id, issues);
        onClose();
    };

    return (
        <div
            className="production-waste-modal-overlay"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                className="production-waste-modal production-start-modal"
                role="dialog"
                aria-modal="true"
            >
                <div className="production-waste-modal-header">
                    <h3>Start batch {batch.id}</h3>
                    <button
                        type="button"
                        className="production-waste-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                <p className="production-start-description">
                    {batch.product} · target {batch.target} portions ·{" "}
                    {batch.station || "Main Kitchen"}. Issue materials to the kitchen
                    and then into this batch.
                </p>

                <div className="production-table-wrap">
                    <table className="production-table">
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th className="num-r">Standard</th>
                                <th className="num-r">In kitchen</th>
                                <th className="num-r">In store / prepared</th>
                                <th className="num-r">Issue to batch</th>
                            </tr>
                        </thead>

                        <tbody>
                            {MATERIALS.map((material, index) => (
                                <tr key={material.name}>
                                    <td>{material.name}</td>
                                    <td className="num-r">{material.standard} {material.unit}</td>
                                    <td className="num-r">{material.kitchen}</td>
                                    <td className="num-r">{material.store}</td>
                                    <td>
                                        <input
                                            className="production-form-input production-issue-input"
                                            type="number"
                                            min="0"
                                            max={material.store + material.kitchen}
                                            step="0.1"
                                            value={quantities[index]}
                                            onChange={(event) => {
                                                const updated = [...quantities];
                                                updated[index] = event.target.value;
                                                setQuantities(updated);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="production-modal-footer">
                    <button
                        type="button"
                        className="production-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="production-btn production-btn-primary"
                        onClick={handleStart}
                    >
                        <Play size={14} />
                        Issue and start
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartBatchModal;
