/*
  ctas: one or more primary buttons shown in the modal footer.
  Content for the WHY modal, keyed by the KPI `key` used in CommandCentre.
  tone: "red" | "green" colours the breakdown value (same colours as the original UI).
  Replace with API data when real feeds exist.
*/
export const WHY_DATA = {
  sales: {
    title: "Sales pace",
    stats: [
      { label: "Sales pace", value: "8.1% vs normal" },
      { label: "Target", value: "normal pace" },
    ],
    breakdown: [
      { label: "Dinner demand", value: "+3.1%", tone: "red" },
      { label: "Average bill", value: "+1.6%", tone: "red" },
      { label: "Customer count", value: "+1.5%", tone: "red" },
      { label: "Discounts", value: "-0.4%", tone: "green" },
    ],
    rootCause: "Higher dinner covers (illustrative split until history builds).",
    ctas: [{ label: "Sales IQ", path: "/admin/sales-iq" }],
  },
  fc: {
    title: "Food cost",
    stats: [
      { label: "Food cost", value: "32.0%" },
      { label: "Target", value: "30%" },
    ],
    breakdown: [
      { label: "Chicken variance", value: "+0.4%", tone: "red" },
      { label: "Vegetable wastage", value: "+0.1%", tone: "red" },
      { label: "Supplier price increase (illustr.)", value: "+0.8%", tone: "red" },
      { label: "Staff consumption (illustr.)", value: "+0.6%", tone: "red" },
      { label: "Menu mix improvement (illustr.)", value: "-0.5%", tone: "green" },
      { label: "Other / unexplained", value: "+0.6%", tone: "red" },
    ],
    rootCause: "Primary issue: chicken portion variance — recipe vs actual weight at the pass.",
    ctas: [
      { label: "Review recipe", path: "/admin/sop-recipes" },
      { label: "Check waste", path: "/back-office/recon" },
      { label: "Open kitchen", path: "/admin/kitchen" },
    ],
  },
  lab: {
    title: "Labour",
    stats: [
      { label: "Labour", value: "11.9%" },
      { label: "Target", value: "12%" },
    ],
    breakdown: [
      { label: "Kitchen roster", value: "-0.2%", tone: "green" },
      { label: "Service roster", value: "+0.1%", tone: "red" },
      { label: "Overtime", value: "0.0%", tone: "green" },
    ],
    rootCause: "Roster matches forecast demand (illustrative).",
    ctas: [{ label: "Open roster", path: "/admin/people" }],
  },
  waste: {
    title: "Waste",
    stats: [
      { label: "Waste", value: "₹339" },
      { label: "Target", value: "₹5,000" },
    ],
    breakdown: [
      { label: "Curdled", value: "+0.1%", tone: "red" },
      { label: "Over-prep", value: "+0.1%", tone: "red" },
      { label: "Returned by customer", value: "+0.1%", tone: "red" },
      { label: "Spoiled", value: "+0.1%", tone: "red" },
    ],
    rootCause: "Largest reason: Curdled",
    ctas: [{ label: "Open waste log", path: "/back-office/recon" }],
  },
  cash: {
    title: "Cash variance",
    stats: [
      { label: "Cash variance", value: "₹800" },
      { label: "Target", value: "₹0" },
    ],
    breakdown: [
      { label: "Counter 1 · Evening shift", value: "₹600", tone: "red" },
      { label: "Cash refunds not logged", value: "₹200", tone: "red" },
    ],
    rootCause: "Check the evening shift counter close.",
    ctas: [{ label: "Day-end", path: "/cashier/day-end" }],
  },
  orders: {
    title: "Orders",
    stats: [
      { label: "Cash variance", value: "₹800" },
      { label: "Target", value: "₹0" },
    ],
    breakdown: [
      { label: "Counter 1 · Evening shift", value: "₹600", tone: "red" },
      { label: "Cash refunds not logged", value: "₹200", tone: "red" },
    ],
    rootCause: "Check the evening shift counter close.",
    ctas: [{ label: "Day End", path: "/cashier/day-end" }],
  },
  bill: {
    title: "Average bill",
    stats: [
      { label: "Cash variance", value: "₹800" },
      { label: "Target", value: "₹0" },
    ],
    breakdown: [
      { label: "Counter 1 · Evening shift", value: "₹600", tone: "red" },
      { label: "Cash refunds not logged", value: "₹200", tone: "red" },
    ],
    rootCause: "Check the evening shift counter close.",
    ctas: [{ label: "Day End", path: "/cashier/day-end" }],
  },
};