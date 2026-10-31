
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

const getElapsedMinutes = (batch) => {
    if (!batch.startedAt) return 0;

    return Math.max(
        0,
        Math.floor(
            (Date.now() - new Date(batch.startedAt).getTime()) / 60000
        )
    );
};

const RunningTab = ({
    batches = [],
    sopSteps = {},
    onComplete,
    onOpenSOPChecklist,
    onQCPass,
    onQCReject,
    criticalSteps,
}) => {
    // Include running and awaiting-QC batches in the same card list
    const runningBatches = batches.filter((batch) =>
        ["In production", "Awaiting QC"].includes(batch.status)
    );

    const awaitingQC = batches.filter(
        (batch) => batch.status === "Awaiting QC"
    );

    const overTime = batches.filter(
        (batch) =>
            batch.status === "In production" &&
            getElapsedMinutes(batch) >= (batch.estimatedMinutes || 90)
    );

    const planned = batches.filter(
        (batch) => batch.status === "Planned"
    );

    return (
        <div className="production-running">
            {/* Summary cards */}
            <div className="production-metrics">
                <div className="production-metric metric-blue">
                    <span>Running now</span>
                    <strong>
                        {batches.filter((b) => b.status === "In production").length}
                    </strong>
                </div>

                <div className="production-metric metric-orange">
                    <span>Awaiting QC</span>
                    <strong>{awaitingQC.length}</strong>
                </div>

                <div className="production-metric metric-green">
                    <span>Running over time</span>
                    <strong>{overTime.length}</strong>
                </div>

                <div className="production-metric metric-purple">
                    <span>Planned next</span>
                    <strong>{planned.length}</strong>
                </div>
            </div>

            {/* Running and QC batch cards */}
            <div className="production-running-content">
                <h3>Running Production</h3>

                {runningBatches.length === 0 ? (
                    <div className="production-empty">
                        No running or awaiting-QC batches.
                    </div>
                ) : (
                    <div className="production-running-grid">
                        {runningBatches.map((batch) => {
                            const steps = sopSteps[batch.sop] || [];
                            const criticalStepsBySop = criticalSteps[batch.sop] || [];
                            const completedSteps = batch.sopDone || 0;
                            const elapsed = getElapsedMinutes(batch);
                            const estimated = batch.estimatedMinutes || 90;

                            const progress = Math.min(
                                100,
                                Math.round((elapsed / estimated) * 100)
                            );

                            const criticalOpen = criticalStepsBySop.length;

                            const isAwaitingQC = batch.status === "Awaiting QC";

                            return (
                                <div
                                    className="production-running-card"
                                    key={batch.id}
                                >
                                    <div className="production-running-header">
                                        <strong>{batch.id}</strong>

                                        <span
                                            className={`production-tag ${isAwaitingQC ? "tag-await" : "tag-running"
                                                }`}
                                        >
                                            {batch.status}
                                        </span>
                                    </div>

                                    <div className="production-running-product">
                                        {batch.productName || batch.product} ·{" "}
                                        {batch.target} portions
                                    </div>

                                    <div className="production-running-muted">
                                        {batch.station || "Main Kitchen"} ·{" "}
                                        {batch.owner || "Unassigned"}

                                        {batch.startedAt && (
                                            <>
                                                {" "}· Started{" "}
                                                {new Date(batch.startedAt).toLocaleTimeString(
                                                    "en-IN",
                                                    { hour: "numeric", minute: "2-digit" }
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {!isAwaitingQC && (
                                        <>
                                            <div className="production-progress-track">
                                                <div
                                                    className="production-progress-fill"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>

                                            <div className="production-running-muted">
                                                {elapsed} of about {estimated} min
                                            </div>
                                        </>
                                    )}

                                    {batch.materials?.length > 0 && (
                                        <div className="production-materials">
                                            {batch.materials.map((material, index) => (
                                                <span key={material.name || index}>
                                                    {material.name} {material.qty}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="production-running-footer">
                                        <span>
                                            SOP {completedSteps}/{steps.length}

                                            {!isAwaitingQC && criticalOpen > 0 && (
                                                <span className="tag-critical">
                                                    {criticalOpen} critical open
                                                </span>
                                            )}
                                        </span>

                                        <div className="production-running-actions">
                                            {/* SOP button remains visible for running and awaiting-QC batches */}
                                            <button
                                                type="button"
                                                className="production-btn"
                                                onClick={() => onOpenSOPChecklist(batch)}
                                            >
                                                SOP {completedSteps}/{steps.length}
                                            </button>

                                           {!isAwaitingQC && (
                                                <button
                                                    type="button"
                                                    className="production-btn production-btn-primary"
                                                    onClick={() => onComplete(batch.id)}
                                                >
                                                    <CheckCircle size={14} />
                                                    Complete
                                                </button>
                                            )}

                                            {isAwaitingQC && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="production-btn production-btn-primary"
                                                        onClick={() => onQCPass(batch.id)}
                                                    >
                                                        <CheckCircle size={14} />
                                                        QC Pass &amp; Release
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="production-btn production-btn-danger"
                                                        onClick={() => onQCReject(batch.id)}
                                                    >
                                                        <AlertTriangle size={14} />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RunningTab;
