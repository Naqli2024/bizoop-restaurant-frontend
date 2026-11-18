import "../../../assets/styles/landing/rolesection.css";
import {
  FaCashRegister,
  FaConciergeBell,
  FaDesktop,
  FaCrown,
  FaClipboardList
} from "react-icons/fa";

const ROLES = [
  {
    icon: FaCashRegister,
    title: "Cashier",
    text: "Sales, billing, returns, payments and day-end settlement."
  },
  {
    icon: FaConciergeBell,
    title: "Captain",
    text: "Manage floor tables, take orders and follow service status."
  },
  {
    icon: FaDesktop,
    title: "KOT Display",
    text: "Kitchen order display, printer routing and kitchen performance."
  },
  {
    icon: FaCrown,
    title: "Owner / Admin",
    text: "Monitor restaurant performance, teams, customers and decisions."
  },
  {
    icon: FaClipboardList,
    title: "Back Office",
    text: "Manage purchases, inventory, expenses, accounts and compliance."
  },
];



export default function RolesSection() {
  return (
    <section className="bz-section bz-roles-section" id="roles">
      <div className="bz-section-heading">
        <span className="bz-section-kicker">Made For Your Team</span>
        <h2>One platform. The right workspace for every role.</h2>
        <p>Each team gets a focused workspace for its daily restaurant responsibilities.</p>
      </div>

      <div className="bz-role-grid">
        {ROLES.map(({ icon:Icon, title, text }) => (
          <article className="bz-role-card" key={title}>
            <span className="bz-role-icon" aria-hidden="true"><Icon size={16}/></span>
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="bz-card-line" />
          </article>
        ))}
      </div>
    </section>
  );
}
