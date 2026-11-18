import { QUESTIONS } from "./ComplianceData";

export default function ApplicabilityTab({ answers, setAnswers, applicable }) {
  const captured = applicable.filter((d) => d.captured).length;
  const added = applicable.filter((d) => d.requires && answers[d.requires]).map((d) => d.name);
  return (
    <div className="cx-pair">
      <section className="cx-box">
        <h3 className="cx-box__title">About this outlet</h3>
        {QUESTIONS.map(([key, label]) => (
          <label className="cx-switch" key={key}>
            <span>{label}</span>
            <input type="checkbox" checked={!!answers[key]} onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.checked }))} />
            <i />
          </label>
        ))}
      </section>
      <section className="cx-box">
        <h3 className="cx-box__title">Your checklist</h3>
        <div className="cx-score cx-score--plain">{captured} of {applicable.length}</div>
        <div className="cx-muted">required documents captured</div>
        {added.length > 0 && <p className="cx-note">Added by your answers: {added.join(", ")}.</p>}
        <div className="cx-muted cx-small">Only documents that apply to this outlet are tracked.</div>
      </section>
    </div>
  );
}
