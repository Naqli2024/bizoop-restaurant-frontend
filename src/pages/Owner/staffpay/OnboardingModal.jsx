import { useEffect, useMemo, useState } from "react";


const STEPS = ["Basic details", "Emergency & nominee", "Documents", "Bank & salary", "Account", "Review"];

const SECTIONS = ["Basic Details", "Identity", "Address", "Bank", "Employment Documents", "Salary Details", "Account"];

const DOCS = [
  { key: "aadhaar", label: "Aadhaar", group: "Identity", required: true },
  { key: "pan", label: "PAN", group: "Identity", required: true },
  { key: "altid", label: "Passport / Driving Licence / Voter ID (optional)", group: "Identity" },
  { key: "addr", label: "Address proof (if different from ID)", group: "Address" },
  { key: "bank", label: "Cancelled cheque / passbook / bank statement", group: "Bank", required: true },
  { key: "relv", label: "Previous experience / relieving letter", group: "Employment" },
  { key: "slip", label: "Last salary slip", group: "Employment" },
  { key: "edu", label: "Highest qualification certificate (optional)", group: "Education" },
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const DEPARTMENTS = ["Kitchen", "Service", "Housekeeping", "Store", "Delivery", "Security", "Management"];
const OUTLETS = ["Anna Nagar", "T Nagar", "OMR"];
const EMP_TYPES = ["Full-time", "Part-time", "Contract", "Daily wage", "Trainee"];
const SALARY_TYPES = ["Monthly", "Weekly", "Daily", "Hourly"];

const today = () => new Date().toISOString().slice(0, 10);

const initialData = () => ({
  photo: "",
  photoFile: null,
  employeeName: "", mobile: "", email: "", dob: "", gender: "",
  joining: today(), desig: "", dept: "", outlet: "Anna Nagar", etype: "", addr: "",
  username: "", password: "", roleCode: "",
  ec_name: "", ec_rel: "", ec_mobile: "",
  nom_name: "", nom_rel: "", nom_mobile: "",
  holder: "", bankname: "",branch:"", acc: "", ifsc: "",
  stype: "", salary: "", eff: today(),
  addrSame: false, fresher: false,
  files: {}, // key -> File
});

const isAdult = (dob) => {
  if (!dob) return false;
  const born = new Date(dob);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return born <= cutoff;
};

/** Returns, per section, the list of things still missing. */
function getMissing(d) {
  const f = d.files;
  const basic = [];
  if (!d.employeeName.trim()) basic.push("name");
  if (!/^\d{10}$/.test(d.mobile)) basic.push("valid mobile");
  if (!isAdult(d.dob)) basic.push("DOB (18+)");
  if (!d.gender) basic.push("gender");
  if (!d.addr.trim()) basic.push("address");
  if (!d.desig.trim()) basic.push("role");
  if (!d.dept) basic.push("department");
  if (!d.outlet) basic.push("outlet");
  if (!d.etype) basic.push("type");
  if (!d.ec_name.trim() || !d.ec_rel.trim() || !/^\d{10}$/.test(d.ec_mobile)) basic.push("emergency contact");

  const identity = [];
  if (!f.aadhaar) identity.push("Aadhaar");
  if (!f.pan) identity.push("PAN");

  const address = [];
  if (!d.addrSame && !f.addr) address.push("address proof");

  const bank = [];
  if (!d.holder.trim() || !/^\d{9,18}$/.test(d.acc) || !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(d.ifsc))
    bank.push("account details (valid A/C & IFSC)");
  if (!f.bank) bank.push("cheque / passbook");

  const employment = [];
  if (!d.fresher) {
    if (!f.relv) employment.push("relieving letter");
    if (!f.slip) employment.push("salary slip");
  }

  const salary = [];
  if (!d.stype) salary.push("type");
  if (!d.salary) salary.push("amount");
  if (!d.eff) salary.push("effective date");

  const account = [];
  if (!/^[a-z0-9._-]{3,}$/i.test(d.username)) account.push("username (min 3, no spaces)");
  if (d.password.length < 6) account.push("password (min 6)");
  if (!d.roleCode) account.push("role");

  return [basic, identity, address, bank, employment, salary, account];
}

function Field({ label, children }) {
  return (
    <label className="ob-field">
      <span className="ob-field__label">{label}</span>
      {children}
    </label>
  );
}

function CameraIcon() {
  return (
    <svg className="ob-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function OnboardingModal({
  open = true,
  initial,
  initialStep = 0,
  roles = [],
  saving = false,
  onClose = () => {},
  onSaveDraft = () => {},
  onComplete = () => {},
}) {
  const [step, setStep] = useState(initialStep);
  const [d, setD] = useState(() => ({ ...initialData(), ...initial }));

  const set = (key) => (e) => setD((prev) => ({ ...prev, [key]: e.target.value }));
  const toggle = (key) => (e) => setD((prev) => ({ ...prev, [key]: e.target.checked }));

  const missing = useMemo(() => getMissing(d), [d]);
  const doneCount = missing.filter((m) => m.length === 0).length;
  const percent = Math.round((doneCount / SECTIONS.length) * 100);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Free the temporary preview URL when the photo changes / modal closes
  useEffect(() => {
    return () => {
      if (d.photo && d.photo.startsWith("blob:")) URL.revokeObjectURL(d.photo);
    };
  }, [d.photo]);

  if (!open) return null;

  const pickPhoto = (e) => {
    const file = e.target.files[0];
    setD((p) => ({
      ...p,
      photo: file ? URL.createObjectURL(file) : "",
      photoFile: file || null,
    }));
  };

  // Keep the real File so it can be uploaded; display uses .name
  const pickDoc = (key) => (e) => {
    const file = e.target.files[0];
    if (file) setD((p) => ({ ...p, files: { ...p.files, [key]: file } }));
  };

  const input = (key, type = "text", placeholder = "") => (
    <input className="ob-input" type={type} value={d[key]} placeholder={placeholder} onChange={set(key)} />
  );

  const select = (key, options) => (
    <select className="ob-input" value={d[key]} onChange={set(key)}>
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );

  // Roles come from getAllRoles; only the role `code` is used. ADMIN is not assignable here
  const roleSelect = (
    <select className="ob-input" value={d.roleId} onChange={set("roleId")}>
      <option value="">Select…</option>
      {roles
      .filter(
        (r) =>
          r.isActive &&
          r.code?.toUpperCase() !== "ADMIN"
      )
      .map((r) => (
        <option key={r._id} value={r._id}>
          {r.code}
        </option>
      ))}
    </select>
  );

  const stepBasic = (
    <>
      <div className="ob-photo">
        <div className="ob-photo__preview" style={d.photo ? { backgroundImage: `url(${d.photo})` } : undefined}>
          {!d.photo && "👤"}
        </div>
        <label className="ob-btn ob-btn--sm">
          <CameraIcon />
          Capture / upload photo
          <input type="file" accept="image/*" capture="user" hidden onChange={pickPhoto} />
        </label>
      </div>
      <div className="ob-grid">
        <Field label="Employee name *">{input("employeeName")}</Field>
        <Field label="Mobile number *">{input("mobile", "tel", "10-digit")}</Field>
        <Field label="Email">{input("email", "email")}</Field>
        <Field label="Date of birth *">{input("dob", "date")}</Field>
        <Field label="Gender *">{select("gender", GENDERS)}</Field>
        <Field label="Joining date *">{input("joining", "date")}</Field>
        <Field label="Designation *">{input("desig", "text", "e.g. Captain, Cook")}</Field>
        <Field label="Department *">{select("dept", DEPARTMENTS)}</Field>
        <Field label="Outlet *">{select("outlet", OUTLETS)}</Field>
        <Field label="Employment type *">{select("etype", EMP_TYPES)}</Field>
      </div>
      <Field label="Current address *">{input("addr")}</Field>
    </>
  );

  const stepEmergency = (
    <>
      <h3 className="ob-section-title">Emergency contact</h3>
      <div className="ob-grid">
        <Field label="Name *">{input("ec_name")}</Field>
        <Field label="Relationship *">{input("ec_rel")}</Field>
        <Field label="Mobile *">{input("ec_mobile", "tel")}</Field>
      </div>
      <h3 className="ob-section-title">
        Nominee <span className="ob-section-title__note">(PF / insurance / benefits)</span>
      </h3>
      <div className="ob-grid">
        <Field label="Nominee name">{input("nom_name")}</Field>
        <Field label="Relationship">{input("nom_rel")}</Field>
        <Field label="Nominee contact">{input("nom_mobile", "tel")}</Field>
      </div>
    </>
  );

  const stepDocuments = (
    <>
      <div className="ob-checks">
        <label>
          <input type="checkbox" checked={d.addrSame} onChange={toggle("addrSame")} /> Address same as ID
        </label>
        <label>
          <input type="checkbox" checked={d.fresher} onChange={toggle("fresher")} /> Fresher (no previous employment)
        </label>
      </div>
      {DOCS.filter(
        (doc) =>
          !(doc.key === "addr" && d.addrSame) &&
          !(d.fresher && (doc.key === "relv" || doc.key === "slip"))
      ).map((doc) => (
        <div className="ob-doc" key={doc.key}>
          <div>
            <strong>{doc.label}</strong>
            {doc.required && <span className="ob-badge ob-badge--danger">required</span>}
            <div className="ob-doc__group">{doc.group}</div>
            {d.files[doc.key] && <div className="ob-doc__file">✓ {d.files[doc.key].name}</div>}
          </div>
          <label className="ob-btn ob-btn--sm ob-btn--primary">
            <CameraIcon />
            Scan / upload
            <input type="file" accept="image/*,application/pdf" capture="environment" hidden onChange={pickDoc(doc.key)} />
          </label>
        </div>
      ))}
    </>
  );

  const stepBank = (
    <>
      <h3 className="ob-section-title">Bank account</h3>
      <div className="ob-grid">
        <Field label="Account holder *">{input("holder")}</Field>
        <Field label="Bank name">{input("bankname")}</Field>
        <Field label="Branch name">{input("branch")}</Field>
        <Field label="Account number *">{input("acc", "text", "9–18 digits")}</Field>
        <Field label="IFSC *">{input("ifsc", "text", "e.g. HDFC0001234")}</Field>
      </div>
      <h3 className="ob-section-title">Salary setup</h3>
      <div className="ob-grid">
        <Field label="Salary type *">{select("stype", SALARY_TYPES)}</Field>
        <Field label="Agreed salary (₹) *">{input("salary", "number")}</Field>
        <Field label="Effective date *">{input("eff", "date")}</Field>
      </div>
      <p className="ob-note">Salary is paid to the bank account above (cash for daily wage can be changed at payment).</p>
    </>
  );

  const stepAccount = (
    <>
      <h3 className="ob-section-title">
        Login account <span className="ob-section-title__note">(for the staff app)</span>
      </h3>
      <div className="ob-grid">
        <Field label="Username *">
          <input
            className="ob-input"
            type="text"
            value={d.username}
            autoComplete="off"
            placeholder="e.g. anitha.m"
            onChange={set("username")}
          />
        </Field>
        <Field label="Password *">
          <input
            className="ob-input"
            type="password"
            value={d.password}
            autoComplete="new-password"
            placeholder="min 6 characters"
            onChange={set("password")}
          />
        </Field>
        <Field label="Role *">{roleSelect}</Field>
      </div>
      {roles.length === 0 && <p className="ob-note">No roles loaded yet.</p>}
      {d.roleCode && (
        <p className="ob-note">
          {roles.find((r) => r.code === d.roleCode)?.description}
        </p>
      )}
    </>
  );

  const stepReview = (
    <div className="ob-review">
      <strong>Onboarding {percent}%</strong>
      {SECTIONS.map((name, i) => (
        <div className="ob-row" key={name}>
          <span>{missing[i].length === 0 ? "✅" : "⬜"} {name}</span>
          {missing[i].length > 0 && <span className="ob-row__missing">missing: {missing[i].join(", ")}</span>}
        </div>
      ))}
    </div>
  );

  const stepViews = [stepBasic, stepEmergency, stepDocuments, stepBank, stepAccount, stepReview];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="ob-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ob-dialog" role="dialog" aria-modal="true" aria-labelledby="ob-title">
        <div className="ob-head">
          <span id="ob-title">🧑‍🍳 Employee onboarding</span>
          <button className="ob-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="ob-tabs">
          {STEPS.map((label, i) => (
            <button
              key={label}
              className={`ob-tab ${i === step ? "ob-tab--active" : ""}`}
              onClick={() => setStep(i)}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <div className="ob-layout">
          <aside className="ob-side">
            <div className="ob-side__percent">{percent}%</div>
            <div className="ob-bar">
              <div className="ob-bar__fill" style={{ width: `${percent}%` }} />
            </div>
            {SECTIONS.map((name, i) => (
              <div className="ob-row" key={name}>
                <span>{missing[i].length === 0 ? "●" : "○"} {name}</span>
              </div>
            ))}
          </aside>

          <div className="ob-content">{stepViews[step]}</div>
        </div>

        <div className="ob-foot">
          <button className="ob-btn" onClick={() => onSaveDraft(d)} disabled={saving}>✓ Save draft</button>
          {step > 0 && (
            <button className="ob-btn" onClick={() => setStep(step - 1)}>◀ Back</button>
          )}
          {isLast ? (
            <button
              className="ob-btn ob-btn--primary"
              onClick={() => onComplete(d)}
            >
              {saving ? "Saving…" : "Complete onboarding"}
            </button>
          ) : (
            <button className="ob-btn ob-btn--primary" onClick={() => setStep(step + 1)}>
              Next ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
