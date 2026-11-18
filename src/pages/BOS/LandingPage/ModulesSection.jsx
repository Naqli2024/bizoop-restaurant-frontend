import {
  LayoutDashboard,
  TrendingUp,
  ConciergeBell,
  CookingPot,
  Boxes,
  ShoppingCart,
  Users,
  HeartHandshake,
  IndianRupee,
  Wrench,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import "../../../assets/styles/landing/modulessection.css"

const modules = [
  {
    title: "Command Centre",
    description: "One view of restaurant activity, priorities and actions.",
    Icon: LayoutDashboard,
  },
  {
    title: "Sales",
    description: "Sales tracking, forecasts, billing and contribution insights.",
    Icon: TrendingUp,
  },
  {
    title: "Operations",
    description: "Floor activity, orders, reservations and service flow.",
    Icon: ConciergeBell,
  },
  {
    title: "Kitchen",
    description: "KOTs, recipes, SOPs, production and kitchen performance.",
    Icon: CookingPot,
  },
  {
    title: "Store",
    description: "Stock levels, wastage, reconciliation and inventory control.",
    Icon: Boxes,
  },
  {
    title: "Procurement",
    description: "Purchase planning, vendor orders and approvals.",
    Icon: ShoppingCart,
  },
  {
    title: "People",
    description: "Employee details, staff operations and payroll information.",
    Icon: Users,
  },
  {
    title: "Customers",
    description: "Customer profiles, CRM, feedback and communication.",
    Icon: HeartHandshake,
  },
  {
    title: "Finance",
    description: "Payments, expenses, vouchers, day-end and P&L.",
    Icon: IndianRupee,
  },
  {
    title: "Assets",
    description: "Equipment status, maintenance and cold-chain monitoring.",
    Icon: Wrench,
  },
  {
    title: "Compliance",
    description: "Food safety, licences, checklists and SOP compliance.",
    Icon: ShieldCheck,
  },
  {
    title: "Intelligence",
    description: "Business insights, forecasts and what-if simulations.",
    Icon: Sparkles,
  },
];

export default function ModulesSection() {
  return (
    <section className="bz-section bz-modules-section" id="modules">
      <div className="bz-section-heading">
        <span className="bz-section-kicker">BIZOOP BOS</span>
        <h2>A clear view of your entire restaurant business.</h2>
        <p>
          Explore the management areas included in the Restaurant Business
          Operating System.
        </p>
      </div>

      <div className="bz-module-grid">
        {modules.map(({ title, description, Icon }) => (
          <article className="bz-module-card" key={title}>
            <span className="bz-module-icon">
              <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
