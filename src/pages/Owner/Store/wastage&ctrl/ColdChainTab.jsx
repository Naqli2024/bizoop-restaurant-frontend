
import { useState } from "react";
import {
  Snowflake,
  Thermometer,
  AlertTriangle,
  RotateCcw,
  Check,
} from "lucide-react";



const INITIAL_SENSORS = [
  {
    id: "chiller",
    name: "Walk-in Chiller",
    temperature: 3.2,
    min: 0,
    max: 5,
  },
  {
    id: "freezer",
    name: "Deep Freezer 1",
    temperature: -19.4,
    min: -25,
    max: -18,
  },
  {
    id: "dessert",
    name: "Dessert Display",
    temperature: 4.1,
    min: 0,
    max: 5,
  },
  {
    id: "hot-hold",
    name: "Hot-hold Counter",
    temperature: 68.0,
    min: 63,
    max: 75,
  },
];

const INCIDENT_STEPS = [
  "Alert manager",
  "Record incident",
  "Quarantine stock",
  "Inspection & release",
];

function ColdChainTab() {
  const [sensors, setSensors] = useState(INITIAL_SENSORS);
  const [breachActive, setBreachActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const isNormal = (sensor) =>
    sensor.temperature >= sensor.min &&
    sensor.temperature <= sensor.max;

  const simulateBreach = () => {
    setSensors((prev) =>
      prev.map((sensor) =>
        sensor.id === "freezer"
          ? { ...sensor, temperature: -11.2 }
          : sensor
      )
    );

    setBreachActive(true);
    setCompletedSteps([]);
  };

  const markStepDone = () => {
    const nextStep = INCIDENT_STEPS.find(
      (_, index) => !completedSteps.includes(index)
    );

    if (!nextStep) return;

    const nextIndex = INCIDENT_STEPS.indexOf(nextStep);

    setCompletedSteps((prev) => [...prev, nextIndex]);
  };

  const resetSensors = () => {
    setSensors(INITIAL_SENSORS);
    setBreachActive(false);
    setCompletedSteps([]);
  };

  const allStepsCompleted =
    completedSteps.length === INCIDENT_STEPS.length;

  return (
    <div className="cold-chain">

      {/* TEMPERATURE MONITORING */}
      <div className="cold-chain-grid">
        {sensors.map((sensor) => {
          const normal = isNormal(sensor);

          return (
            <div
              className={`cold-chain-card ${
                normal ? "normal" : "breach"
              }`}
              key={sensor.id}
            >
              <div className="cold-chain-card-header">
                <span>{sensor.name}</span>

                <span className="cold-chain-status-icon">
                  {normal ? (
                    <Snowflake size={15} />
                  ) : (
                    <AlertTriangle size={15} />
                  )}
                </span>
              </div>

              <div
                className={`cold-chain-temperature ${
                  normal ? "safe" : "danger"
                }`}
              >
                {sensor.temperature.toFixed(1)}°C

                <span className="cold-chain-indicator">
                  {normal ? "🟢" : "🔴"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SIMULATE BREACH */}
      {!breachActive && (
        <div className="cold-chain-actions">
          <button
            className="cold-chain-btn"
            onClick={simulateBreach}
          >
            <Thermometer size={14} />
            Simulate freezer breach (IoT sensor)
          </button>
        </div>
      )}

      {/* INCIDENT CHECKLIST */}
      {breachActive && (
        <div className="cold-chain-incident">

          <div className="cold-chain-incident-header">
            <AlertTriangle size={17} />

            <strong>
              Deep Freezer 1 above threshold for 18 minutes
            </strong>
          </div>

          <div className="cold-chain-checklist">
            {INCIDENT_STEPS.map((step, index) => {
              const completed = completedSteps.includes(index);

              return (
                <div
                  className={`cold-chain-check-row ${
                    completed ? "completed" : ""
                  }`}
                  key={step}
                >
                  <span className="cold-chain-check-icon">
                    {completed ? (
                      <Check size={14} />
                    ) : null}
                  </span>

                  <span>{step}</span>

                  {completed && (
                    <span className="cold-chain-done-label">
                      Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {allStepsCompleted && (
            <div className="cold-chain-complete-message">
              <Check size={15} />
              All incident response steps completed.
            </div>
          )}

          <div className="cold-chain-incident-actions">
            <button
              className="cold-chain-step-btn"
              onClick={markStepDone}
              disabled={allStepsCompleted}
            >
              <Check size={14} />
              {allStepsCompleted
                ? "All steps completed"
                : "Mark step done"}
            </button>

            <button
              className="cold-chain-reset"
              onClick={resetSensors}
            >
              <RotateCcw size={14} />
              Reset simulation
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default ColdChainTab;
