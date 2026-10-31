import { useState, useEffect } from "react";
import { X, Check, Upload } from "lucide-react";

const SOPChecklistModal = ({ batch, onClose, onSave }) => {
    const SOP_ITEMS = {
        DOUGH: [
            { text: "Measure maida, water, oil, and salt" },
            { text: "Mix ingredients into a dough" },
            { text: "Knead until smooth and elastic" },
            { text: "Rest the dough for the required time" },
            { text: "Divide and portion the dough" },
            { text: "Check quality, cover, and label" },
        ],

        MCH: [
            { text: "Clean and portion chicken" },
            { text: "Measure marinade ingredients" },
            { text: "Mix chicken thoroughly with marinade" },
            { text: "Check that all pieces are evenly coated" },
            {
                text: "Cover and store under refrigeration",
                critical: true,
            },
            { text: "Label with preparation date and time" },
        ],

        PAR: [
            { text: "Measure maida, water, oil, and salt" },
            { text: "Mix ingredients into a dough" },
            { text: "Knead until smooth and elastic" },
            { text: "Rest the dough for the required time" },
            { text: "Divide and portion the dough" },
            { text: "Check quality, cover, and label" },
        ],

        CUR: [
            { text: "Mise en place: weigh every ingredient" },
            { text: "Sauté onion to golden" },
            { text: "Add tomato and masala, cook until oil separates" },
            {
                text: "Cook chicken to a core temperature of 75 °C",
                critical: true,
            },
            { text: "Taste and adjust" },
            {
                text: "Hold above 60 °C, or chill below 5 °C within 2 hours",
                critical: true,
            },
            { text: "Portion and label" },
        ],

        FRY: [
            { text: "Wash and portion chicken" },
            { text: "Marinate chicken" },
            { text: "Heat oil to the correct temperature" },
            {
                text: "Cook chicken to a core temperature of 75 °C",
                critical: true,
            },
            { text: "Drain and hold hot above 60 °C", critical: true },
        ],
    };

    const [steps, setSteps] = useState([]);
    const [customSteps, setCustomSteps] = useState("");
    const [attachedSop, setAttachedSop] = useState([]);
    const [attachment, setAttachment] = useState("");
    const [isSopAttached, setIsSopAttached] = useState(true);

    useEffect(() => {
        if (!batch) return;

        const initialSteps = SOP_ITEMS[batch.sop] || [];

        setSteps(
            initialSteps.map((step, index) => ({
                ...step,
                checked: index < (batch.sopDone || 0),
            }))
        );

        setCustomSteps("");
        setAttachedSop([]);
        setAttachment("");
    }, [batch]);

    if (!batch) return null;

    const toggleStep = (index, checked) => {
        setSteps((current) =>
            current.map((step, i) =>
                i === index ? { ...step, checked } : step
            )
        );
    };

    const addSteps = () => {
        const newSteps = customSteps
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => ({
                text: line.replace(/^!\s*/, ""),
                critical: line.startsWith("!"),
                checked: false,
            }));

        setSteps((current) => [...current, ...newSteps]);
        setCustomSteps("");
    };

    const handleSave = () => {
        const completedCount = steps.filter(
            (step) => step.checked
        ).length;

        onSave(batch.id, completedCount, steps);
    };

    return (
        <div
            className="production-waste-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="production-waste-modal production-modal-md production-sop-modal"
                role="dialog"
                aria-modal="true"
            >
                <div className="production-waste-modal-header">
                    <span>
                        SOP · {batch.id} · {batch.product}
                    </span>

                    <button
                        type="button"
                        className="production-waste-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {isSopAttached ? (
                    <div className="production-sop-card">
                        <div className="production-sop-card-header">
                            <strong>{batch.product} SOP</strong>

                            <div className="production-sop-header-actions">
                                <span className="production-tag tag-planned">
                                    Library
                                </span>

                                <button
                                    type="button"
                                    className="production-btn production-btn-secondary"
                                    onClick={() => {
                                        setIsSopAttached(false);
                                        setAttachedSop([]);
                                        setSteps([]);
                                    }}
                                >
                                    <X size={14} />
                                    Detach
                                </button>
                            </div>
                        </div>

                        {steps.map((step, index) => (
                            <label
                                className="production-sop-check"
                                key={`${index}-${step.text}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={step.checked}
                                    onChange={(e) => toggleStep(index, e.target.checked)}
                                />

                                {step.critical && (
                                    <span className="production-tag production-tag-danger">
                                        Critical
                                    </span>
                                )}

                                <span>{step.text}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="production-sop-card production-sop-empty">
                        <strong>No SOP attached</strong>
                        <p>Attach an SOP from the library or upload a document.</p>
                    </div>
                )}

                <div className="production-sop-attach">
                    <select
                        className="production-reason-input"
                        value={attachment}
                        onChange={(e) => setAttachment(e.target.value)}
                    >
                        <option value="">Attach from library…</option>
                        <option value="Parotta dough SOP">
                            Parotta dough SOP
                        </option>
                        <option value="Parotta rolling and half-cook SOP">
                            Parotta rolling and half-cook SOP
                        </option>
                        <option value="Chicken marination SOP">
                            Chicken marination SOP
                        </option>
                        <option value="Chicken fry SOP">
                            Chicken fry SOP
                        </option>
                        <option value="Chicken Biryani">
                            Chicken Biryani (dish SOP)
                        </option>
                    </select>

                    <button
                        type="button"
                        className="production-btn"
                        disabled={!attachment}
                        onClick={() => {
                            setAttachedSop((current) =>
                                current.includes(attachment)
                                    ? current
                                    : [...current, attachment]
                            );
                            setAttachment("");
                        }}
                    >
                        Attach
                    </button>

                    <label className="production-btn production-upload-btn">
                        <Upload size={15} />
                        Upload document
                        <input
                            type="file"
                            hidden
                            accept=".pdf,image/*"
                            onChange={(e) =>
                                setAttachedSop((current) => [
                                    ...current,
                                    e.target.files?.[0]?.name,
                                ].filter(Boolean))
                            }
                        />
                    </label>
                </div>

                {attachedSop.length > 0 && (
                    <div className="production-attached-list">
                        {attachedSop.map((item, index) => (
                            <div key={`${item}-${index}`}>{item}</div>
                        ))}
                    </div>
                )}

                <textarea
                    className="production-reason-input production-sop-custom"
                    rows={3}
                    value={customSteps}
                    onChange={(e) => setCustomSteps(e.target.value)}
                    placeholder="Add checklist steps, one per line. Start a line with ! for a critical step"
                />

                <button
                    type="button"
                    className="production-btn production-sop-add"
                    onClick={addSteps}
                    disabled={!customSteps.trim()}
                >
                    Add steps
                </button>

                <div className="production-modal-footer">
                    <button
                        type="button"
                        className="production-btn production-btn-primary"
                        onClick={handleSave}
                    >
                        <Check size={15} />
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SOPChecklistModal;