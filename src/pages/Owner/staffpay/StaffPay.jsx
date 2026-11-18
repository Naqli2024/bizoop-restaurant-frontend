import { CreditCard, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify"; // or: import toast from "react-hot-toast"
import "../../../assets/styles/admin/staffpay.css";
import { getAllRoles } from "../../../redux/Roles/RoleSlice";      // adjust path
import { addEmployees, getAllEmployees, getEmployeeById } from "../../../redux/Staffs/StaffSlice"; // adjust path
import OnboardingModal from "./OnboardingModal";
import PayModal from "./PayModal";
import ProfileModal from "./ProfileModal";

const inr = (n) => "₹" + (Number(n) || 0).toLocaleString("en-IN");

// status = onboardingStatus from the API ("Pending" | "Completed")
// employmentStatus = employmentStatus from the API ("Active" | ...)
const rowFromApi = (e) => ({
  id: e._id,
  employeeCode: e.employeeCode || "—",
  employeeName: e.employeeName || "—",
  role: e.designation || "—",
  payType: e.salaryDetails?.salaryType || "Daily",
  rate: Number(e.salaryDetails?.basicSalary) || 0,
  days: 0,
  gross: 0,
  advance: 0,
  status: e.onboardingStatus,
  employmentStatus: e.employmentStatus,
});

// Normalise a document type like "PAN" / "AADHAR" / "Aadhaar" to the keys used in the UI
const docKey = (type) => {
  const t = String(type || "").toLowerCase().replace(/[^a-z]/g, "");
  return t === "aadhar" ? "aadhaar" : t;
};

// API employee -> same shape the modals use (for Employee Master + ProfileModal)
// Works for both the list item and the GET /employees/:id response.
const profileFromApi = (e) => ({
  employeeName: e.employeeName || "",
  employeeCode: e.employeeCode || "",
  mobile: e.mobile || "",
  email: e.email || "",
  dob: e.dateOfBirth ? String(e.dateOfBirth).slice(0, 10) : "",
  gender: e.gender || "",
  joining: e.joiningDate ? String(e.joiningDate).slice(0, 10) : "",
  desig: e.designation || "",
  dept: e.department || "",
  outlet: e.outletId?.name || "",
  etype: e.employmentType || "",
  addr: e.currentAddress || "",
  username: e.userId?.username || "",
  password: "",
  roleId: e.userId?.roleId || "",
  ec_name: e.emergencyContact?.name || "",
  ec_rel: e.emergencyContact?.relationship || "",
  ec_mobile: e.emergencyContact?.mobile || "",
  nom_name: e.nominee?.name || "",
  nom_rel: e.nominee?.relationship || "",
  nom_mobile: e.nominee?.contact || "",
  holder: e.bankDetails?.accountHolderName || "",
  bankname: e.bankDetails?.bankName || "",
  branch: e.bankDetails?.branchName || "",
  acc: e.bankDetails?.accountNumber || "",
  ifsc: e.bankDetails?.ifscCode || "",
  stype: e.salaryDetails?.salaryType || "",
  salary: e.salaryDetails?.basicSalary ?? "",
  allowances: e.salaryDetails?.allowances ?? "",
  deductions: e.salaryDetails?.deductions ?? "",
  addrSame: !!e.addressSameAsId,
  fresher: !!e.isFresher,
  photo: e.photo || "",
  // documents: array -> { pan: "file name or number", ... } so p.files.aadhaar works
  files: Object.fromEntries(
    (e.documents || []).map((doc) => [
      docKey(doc.documentType),
      doc.originalFileName || doc.documentNumber || "Uploaded",
    ])
  ),
});

// Modal form data -> the request body used in Postman
const buildPayload = (d) => ({
  employee: {
    employeeName: d.employeeName.trim(),
    mobile: d.mobile,
    email: d.email,
    designation: d.desig,
    department: d.dept,
    employmentType: d.etype,
    joiningDate: d.joining,
    gender: d.gender,
    currentAddress: d.addr,
    permanentAddress: d.addr,
    addressSameAsId: d.addrSame,
    isFresher: d.fresher,
    onboardingStatus: "Pending",
    employmentStatus: "Active",
    emergencyContact: {
      name: d.ec_name,
      relationship: d.ec_rel,
      mobile: d.ec_mobile,
    },
    nominee: {
      name: d.nom_name,
      relationship: d.nom_rel,
      contact: d.nom_mobile,
    },
    bankDetails: {
      accountHolderName: d.holder,
      accountNumber: d.acc,
      ifscCode: d.ifsc.toUpperCase(),
      bankName: d.bankname,
      branchName: d.branch,
    },
    salaryDetails: {
      salaryType: d.stype,
      basicSalary: Number(d.salary) || 0,
      allowances: Number(d.allowances) || 0,
      deductions: Number(d.deductions) || 0,
    },
    documents: [],
  },
  createLoginAccount: true,
  account: {
    username: d.username.trim(),
    password: d.password,
    roleId: d.roleId,
  },
});

// Draft rows live only in the browser until the employee is completed
const draftRow = (id, data, prev = {}) => ({
  days: 0, gross: 0, advance: 0,
  ...prev,
  id,
  employeeName: data.employeeName || prev.employeeName || "New employee",
  role: data.desig || prev.role || "—",
  payType: data.stype || prev.payType || "Daily",
  rate: Number(data.salary) || prev.rate || 0,
  status: "Pending",
  employmentStatus: "Active",
});

function StatCard({ label, value, tone }) {
  return (
    <div className={`sp-stat ${tone ? `sp-stat--${tone}` : ""}`}>
      <div className="sp-stat__label">{label}</div>
      <div className="sp-stat__value">{value}</div>
    </div>
  );
}

export default function StaffPay() {
  const dispatch = useDispatch();
  // "staff" / "roles" must match the keys used in your configureStore reducer map
  const { employee: apiEmployees, employeeDetails, loading, saving } = useSelector((s) => s.employee);
  const { roles } = useSelector((s) => s.roles);

  const errMsg = (err, fallback) => (typeof err === "string" ? err : err?.message || fallback);

  const [drafts, setDrafts] = useState([]);          // local draft rows
  const [draftProfiles, setDraftProfiles] = useState({}); // draft id -> form data
  const [payOverrides, setPayOverrides] = useState({});   // id -> { days, gross, advance }
  const [onb, setOnb] = useState(null);              // null = closed, { id? } = open
  const [profileId, setProfileId] = useState(null);
  const [payId, setPayId] = useState(null);
  const [, setVouchers] = useState([]);

  useEffect(() => {
    dispatch(getAllEmployees());
    dispatch(getAllRoles());
  }, [dispatch]);

  // Server employees (with local pay figures applied) + local drafts
  const staff = useMemo(() => {
    const fromApi = (apiEmployees || []).map((e) => {
      const row = rowFromApi(e);
      return { ...row, ...(payOverrides[row.id] || {}) };
    });
    return [...fromApi, ...drafts];
  }, [apiEmployees, drafts, payOverrides]);

  const profiles = useMemo(() => {
    const map = { ...draftProfiles };
    (apiEmployees || []).forEach((e) => {
      map[e._id] = profileFromApi(e);
    });
    return map;
  }, [apiEmployees, draftProfiles]);

  const stats = useMemo(() => {
    const net = (e) => e.gross - e.advance;
    return {
      headcount: staff.length,
      payroll: staff.reduce((s, e) => s + net(e), 0),
      pending: staff.filter((e) => e.status === "Pending").length,
      advances: staff.reduce((s, e) => s + e.advance, 0),
    };
  }, [staff]);

  const newDraftId = () => `draft-${Date.now()}`;

  // Draft = local only
  const handleSaveDraft = (data) => {
    const id = onb?.id ?? newDraftId();
    setDraftProfiles((p) => ({ ...p, [id]: data }));
    setDrafts((list) =>
      list.some((e) => e.id === id)
        ? list.map((e) => (e.id === id ? draftRow(id, data, e) : e))
        : [...list, draftRow(id, data)]
    );
    setOnb({ id }); // keep the modal tied to this draft for later saves
    toast.info("Draft saved on this device");
  };

  // Complete = POST to /employees, then refetch
  const handleComplete = async (data) => {
    if (!data.roleId || !roles.some((r) => r._id === data.roleId)) {
      toast.error("Select a role in the Account step before completing.");
      return;
    }
    try {
      await dispatch(addEmployees(buildPayload(data))).unwrap();
      const draftId = onb?.id;
      if (draftId && String(draftId).startsWith("draft-")) {
        setDrafts((list) => list.filter((e) => e.id !== draftId));
        setDraftProfiles((p) => {
          const { [draftId]: _removed, ...rest } = p;
          return rest;
        });
      }
      await dispatch(getAllEmployees());
      setOnb(null);
      toast.success("Employee onboarded");
    } catch (err) {
      // err is whatever handleApiError returned
      toast.error(errMsg(err, "Could not save employee. Please try again."));
    }
  };

  // Profile = fetch the full record with getEmployeeById, then show employeeDetails
  const openProfile = (id) => {
    setProfileId(id);
    if (String(id).startsWith("draft-")) return; // drafts have no server record
    dispatch(getEmployeeById(id))
      .unwrap()
      .catch((err) => toast.error(errMsg(err, "Could not load employee profile")));
  };

  const detailsReady = employeeDetails && employeeDetails._id === profileId;

  const handlePay = (p) => {
    setPayOverrides((o) => ({ ...o, [p.id]: { days: p.days, gross: p.gross, advance: p.advance } }));
    setVouchers((v) => [...v, { ...p, date: new Date().toISOString() }]);
    setPayId(null);
  };

  return (
    <section className="sp-panel">
      <header className="sp-header">
        <h2 className="sp-header__title">
          <span aria-hidden="true">👥</span> Staff &amp; pay
          <span className="sp-header__badge">onboarding · weekly / daily / monthly</span>
        </h2>
        <button
          className="sp-btn sp-btn--primary"
          onClick={() => setOnb({})}
        >
          <Plus size={16} className="sp-icon" />
          Add employee
        </button>
      </header>

      <div className="sp-body">
        <div className="sp-stats">
          <StatCard label="Headcount" value={stats.headcount} />
          <StatCard label="Payroll this cycle" value={inr(stats.payroll)} tone="blue" />
          <StatCard label="Onboarding pending" value={stats.pending} tone="amber" />
          <StatCard label="Advances to recover" value={inr(stats.advances)} tone="red" />
        </div>

        <div className="sp-table-wrap">
          <table className="sp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Pay type</th>
                <th className="sp-right">Rate</th>
                <th className="sp-right">Days</th>
                <th className="sp-right">Gross</th>
                <th className="sp-right">Advance</th>
                <th className="sp-right">Net</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading && staff.length === 0 && (
                <tr>
                  <td colSpan={10}>Loading employees…</td>
                </tr>
              )}
              {!loading && staff.length === 0 && (
                <tr>
                  <td colSpan={10}>No employees yet. Use “Add employee” to onboard the first one.</td>
                </tr>
              )}
              {staff.map((e) => {
                const isOnboarding = e.status === "Pending";
                return (
                  <tr key={e.id}>
                    <td>{e.employeeName}</td>
                    <td>{e.role}</td>
                    <td>{e.payType}</td>
                    <td className="sp-right sp-mono">{inr(e.rate)}</td>
                    <td className="sp-right sp-mono">{e.days}</td>
                    <td className="sp-right sp-mono">{inr(e.gross)}</td>
                    <td className="sp-right sp-mono">{inr(e.advance)}</td>
                    <td className="sp-right sp-mono">
                      <strong>{inr(e.gross - e.advance)}</strong>
                    </td>
                    <td>
                      <span className={`sp-pill ${isOnboarding ? "sp-pill--pending" : "sp-pill--active"}`}>
                        {isOnboarding ? "Onboarding" : e.employmentStatus || "Active"}
                      </span>
                    </td>
                    <td>
                      {isOnboarding ? (
                        <button className="sp-btn sp-btn--outline" onClick={() => setOnb({ id: e.id })}>
                          Onboard
                        </button>
                      ) : (
                        <button className="sp-btn sp-btn--success" onClick={() => setPayId(e.id)}>
                          <CreditCard size={16} className="sp-icon" />
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="sp-card">
          <div className="sp-card__title">Employee Master</div>
          <div className="sp-table-wrap sp-table-wrap--inner">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Outlet</th>
                  <th>Mobile</th>
                  <th>Joined</th>
                  <th>Aadhaar</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {staff.map((e) => {
                  const p = profiles[e.id];
                  return (
                    <tr key={e.id}>
                      <td className="sp-mono">{e.employeeCode || "—"}</td>
                      <td>{e.employeeName}</td>
                      <td>{p?.dept || "—"}</td>
                      <td>{p?.outlet || "—"}</td>
                      <td>{p?.mobile || "—"}</td>
                      <td>{p?.joining || "—"}</td>
                      <td className="sp-mono">{p?.files?.aadhaar ? "Uploaded" : "—"}</td>
                      <td>
                        {e.status === "Pending" ? (
                          <button className="sp-btn sp-btn--primary" onClick={() => setOnb({ id: e.id })}>
                            Resume
                          </button>
                        ) : (
                          <button className="sp-btn sp-btn--outline" onClick={() => openProfile(e.id)}>
                            Profile
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {profileId !== null && (
        <ProfileModal
          employee={staff.find((e) => e.id === profileId)}
          profile={detailsReady ? profileFromApi(employeeDetails) : profiles[profileId]}
          loading={!detailsReady && !String(profileId).startsWith("draft-")}
          roles={roles}
          onClose={() => setProfileId(null)}
        />
      )}

      {payId !== null && (
        <PayModal
          key={payId}
          employee={staff.find((e) => e.id === payId)}
          onClose={() => setPayId(null)}
          onPay={handlePay}
        />
      )}

      {onb && (
        <OnboardingModal
          key={onb.id ?? "new"}
          initial={onb.id !== undefined ? draftProfiles[onb.id] : undefined}
          roles={roles}
          saving={saving}
          onClose={() => setOnb(null)}
          onSaveDraft={handleSaveDraft}
          onComplete={handleComplete}
        />
      )}
    </section>
  );
}
