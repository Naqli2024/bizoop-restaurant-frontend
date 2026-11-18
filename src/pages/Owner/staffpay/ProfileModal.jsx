import { X } from "lucide-react";
import { useEffect } from "react";


const inr = (n) => "₹" + (Number(n) || 0).toLocaleString("en-IN");
const dash = (v) => (v === undefined || v === null || v === "" ? "—" : v);

const DOC_LABELS = {
  aadhaar: "Aadhaar",
  pan: "PAN",
  altid: "Alternate ID",
  passport: "Passport",
  drivinglicense: "Driving licence",
  voterid: "Voter ID",
  addr: "Address proof",
  bank: "Cheque / passbook",
  relv: "Relieving letter",
  slip: "Salary slip",
  edu: "Qualification",
};

const maskAccount = (acc) => (acc && acc.length > 4 ? "•".repeat(acc.length - 4) + acc.slice(-4) : acc);

function Row({ label, children }) {
  return (
    <div className="pf-row">
      <span>{label}</span>
      <span className="pf-row__value">{children}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="pf-card">
      <h3 className="pf-card__title">{title}</h3>
      {children}
    </section>
  );
}

export default function ProfileModal({ employee, profile, loading = false, roles = [], onClose = () => {} }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const p = profile || {};
  const files = Object.entries(p.files || {});
  const hasEmergency = p.ec_name || p.nom_name;
  const amount = p.salary !== undefined && p.salary !== "" ? Number(p.salary) : employee.rate;
  const roleName = roles.find((r) => r._id === p.roleId)?.code;

  return (
    <div className="pf-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pf-dialog" role="dialog" aria-modal="true" aria-labelledby="pf-title">
        <div className="pf-head">
          <span id="pf-title">👤 {employee.employeeName}</span>
          <button className="pf-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <p className="pf-muted">Loading profile…</p>
        ) : (
          <div className="pf-grid">
            <div className="pf-col">
              <Section title="Employment">
                <Row label="ID">{dash(employee.employeeCode)}</Row>
                <Row label="Designation">{dash(employee.role)}</Row>
                <Row label="Department">{dash(p.dept)}</Row>
                <Row label="Outlet">{dash(p.outlet)}</Row>
                <Row label="Type">{dash(p.etype)}</Row>
                <Row label="Joined">{dash(p.joining)}</Row>
              </Section>

              <Section title="Personal">
                <Row label="Mobile">{dash(p.mobile)}</Row>
                <Row label="Email">{dash(p.email)}</Row>
                <Row label="Date of birth">{dash(p.dob)}</Row>
                <Row label="Gender">{dash(p.gender)}</Row>
                <Row label="Address">{dash(p.addr)}</Row>
              </Section>

              <Section title="Login account">
                <Row label="Username">{dash(p.username)}</Row>
                <Row label="Role">{dash(roleName)}</Row>
              </Section>
            </div>

            <div className="pf-col">
              <Section title="Salary">
                <Row label={employee.payType}>
                  <b>{inr(amount)}</b>
                </Row>
                <Row label="Allowances">{inr(p.allowances)}</Row>
                <Row label="Deductions">{inr(p.deductions)}</Row>
                <Row label="Bank">
                  {p.bankname || p.acc ? `${p.bankname || "Bank"} ${maskAccount(p.acc) || ""}`.trim() : "—"}
                </Row>
                <Row label="Branch">{dash(p.branch)}</Row>
                <Row label="IFSC">{dash(p.ifsc)}</Row>
              </Section>

              <Section title="Documents">
                {files.length === 0 ? (
                  <p className="pf-muted">No documents on record</p>
                ) : (
                  files.map(([key, name]) => (
                    <Row key={key} label={DOC_LABELS[key] || key}>
                      <span className="pf-file" title={name}>✓ {name}</span>
                    </Row>
                  ))
                )}
              </Section>

              <Section title="Emergency & nominee">
                {!hasEmergency ? (
                  <p className="pf-muted">—</p>
                ) : (
                  <>
                    <Row label="Emergency">{dash(p.ec_name)}{p.ec_rel && ` (${p.ec_rel})`}</Row>
                    <Row label="Emergency mobile">{dash(p.ec_mobile)}</Row>
                    <Row label="Nominee">{dash(p.nom_name)}{p.nom_rel && ` (${p.nom_rel})`}</Row>
                    <Row label="Nominee contact">{dash(p.nom_mobile)}</Row>
                  </>
                )}
              </Section>
            </div>
          </div>
        )}

        <div className="pf-foot">
          <button className="pf-btn" onClick={onClose}>
            <X size={14} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
