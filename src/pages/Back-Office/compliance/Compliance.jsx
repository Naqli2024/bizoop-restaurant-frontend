import { useMemo, useState } from "react";
import CaptureModal from "./CaptureModal";
import DocumentDetailModal from "./DocumentDetailModal";
import "../../../assets/styles/back-office/compliance.css";
import DashboardTab from "./DashboardTab";
import DocumentsTab from "./DocumentsTab";
import ApplicabilityTab from "./ApplicabilityTab";
import FilingsTab from "./FilingsTab";
import { DOCS } from "./ComplianceData";
import { todayIso, addMonths, docStatus, baseHistory } from "./ComplianceUtils";
import { Btn } from "./ComplianceUi";

export default function Compliance() {
  const today = todayIso(); // call it: a string, not the function
  const [tab, setTab] = useState("dash");
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const [answers, setAnswers] = useState({ lpg: true, gen: true, sign: true });
  const [modal, setModal] = useState(null); // capture/renew modal: null | { type: docId }
  const [detail, setDetail] = useState(null); // detail modal: null | docId
  const [changes, setChanges] = useState({}); // per-document overrides: { [id]: { captured, state } }
  const [verified, setVerified] = useState(() => new Set());
  const [dues, setDues] = useState({}); // { [filingId]: next due date }
  const [renewed, setRenewed] = useState(() => new Set());

  const applicable = useMemo(
    () => DOCS.filter((d) => !d.requires || answers[d.requires]).map((d) => ({ ...d, ...changes[d.id] })),
    [answers, changes]
  );

  const rows = useMemo(
    () =>
      applicable
        .map((doc) => ({ doc, st: docStatus(doc, today, verified) }))
        .sort((a, b) => {
          const k = (r) => (!r.doc.captured ? "0" : r.doc.expiry || "9999");
          return k(a).localeCompare(k(b));
        }),
    [applicable, today, verified]
  );

  // apply changes to a document and append history events
  const log = (id, change, ...events) =>
    setChanges((c) => {
      const base = c[id]?.history ?? baseHistory(DOCS.find((d) => d.id === id) || {});
      const added = events.map((text) => ({ date: today, text }));
      return { ...c, [id]: { ...c[id], ...change, history: [...base, ...added] } };
    });

  const getDoc = (id) => {
    const base = DOCS.find((d) => d.id === id);
    return base && { ...base, ...changes[id] };
  };

  const saveModal = (f, verifyNow) => {
    const wasCaptured = !!getDoc(f.type)?.captured;
    log(
      f.type,
      {
        captured: true, no: f.no || undefined, expiry: f.expiry || undefined, issued: f.issue,
        authority: f.authority, outlet: f.outlet, owner: f.owner, remind: f.remind,
        state: verifyNow ? undefined : "unverified", // unverified -> shows Verify button
      },
      wasCaptured ? "Renewed" : "Captured",
      verifyNow ? "Verified" : "Sent for verification"
    );
    setVerified((s) => { const n = new Set(s); n.delete(f.type); return n; });
    setModal(null);
  };

  const handlers = {
    open: (id) => setDetail(id),
    capture: (id) => setModal({ type: id }),
    renew: (id) => setModal({ type: id }),
    verify: (id) => { setVerified((s) => new Set(s).add(id)); log(id, {}, "Verified"); },
  };

  // renew items: 1st click = "Mark renewed" (status only, button becomes "Mark filed").
  // "Mark filed" (and every file-type item) moves the due date forward one period each click.
  const markDone = (f) => {
    if (f.kind === "renew" && !renewed.has(f.id)) {
      setRenewed((s) => new Set(s).add(f.id));
      return;
    }
    setDues((d) => ({ ...d, [f.id]: addMonths(d[f.id] ?? f.due, f.every) }));
  };
  const pickCategory = (c) => { setCat(c); setTab("docs"); };

  const tabs = [["dash", "Dashboard"], ["docs", `Documents (${applicable.length})`], ["app", "Applicability"], ["fil", "Filings"]];

  return (
    <div className="cx-page">
      <header className="cx-header">
        <h2 className="cx-header__title">
          🛡 Compliance <span className="cx-header__badge">capture · verify · track</span>
        </h2>
        <Btn variant="primary" icon="plus" onClick={() => setModal({ type: "fssai" })}>Capture document</Btn>
      </header>

      <nav className="cx-tabs">
        {tabs.map(([key, label]) => (
          <button key={key} type="button" className={`cx-tabs__item${tab === key ? " is-active" : ""}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>

      <main className="cx-body">
        {tab === "dash" && <DashboardTab rows={rows} onPickCategory={pickCategory} handlers={handlers} />}
        {tab === "docs" && <DocumentsTab rows={rows} query={query} setQuery={setQuery} cat={cat} setCat={setCat} handlers={handlers} />}
        {tab === "app" && <ApplicabilityTab answers={answers} setAnswers={setAnswers} applicable={applicable} />}
        {tab === "fil" && <FilingsTab today={today} dues={dues} renewed={renewed} markDone={markDone} />}
      </main>

      {detail && (() => {
        const doc = getDoc(detail);
        return (
          <DocumentDetailModal
            doc={doc}
            status={docStatus(doc, today, verified)}
            verified={verified.has(detail)}
            history={doc.history ?? baseHistory(doc)}
            onClose={() => setDetail(null)}
            onProgress={() => { log(detail, { state: "renewing" }, "Renewal started"); setDetail(null); }}
            onNotApplicable={() => { log(detail, { state: "na" }, "Marked not applicable"); setDetail(null); }}
            onRenew={() => { setModal({ type: detail }); setDetail(null); }}
          />
        );
      })()}

      {modal && (
        <CaptureModal key={modal.type} initialType={modal.type} today={today} getDoc={getDoc}
          onClose={() => setModal(null)} onSave={saveModal} />
      )}
    </div>
  );
}
