/*
  Content for the item workspace modal, keyed by item id.
  columns: two arrays of sections (left column, right column).
  tone: "red" | "green" colours a value. Replace with API data later.
*/
export const WORKSPACE_DATA = {
  chicken: {
    icon: "📦",
    title: "Chicken · ₹210.00/kg",
    columns: [
      [
        {
          heading: "Live position",
          rows: [
            { label: "Stock", value: "22.0 kg" },
            { label: "Today's requirement", value: "31.0 kg" },
            { label: "Tomorrow forecast", value: "30.5 kg" },
            { label: "Open PO", value: "0 pending" },
          ],
        },
        {
          heading: "Cost",
          rows: [
            { label: "Current", value: "₹210.00" },
            { label: "30-day average", value: "₹194.81" },
            { label: "Change", value: "+7.8%", tone: "red" },
          ],
        },
      ],
      [
        {
          heading: "Consumption",
          rows: [
            { label: "Expected", value: "28.9" },
            { label: "Actual", value: "31.7" },
            { label: "Variance", value: "+2.0 (7.1%)", tone: "red" },
          ],
        },
        {
          heading: "Suppliers",
          rows: [
            { label: "Fresh Poultry Co.", value: "₹210.00" },
            { label: "Local trader", value: "₹203.70" },
            { label: "Wholesale mart", value: "₹216.30" },
          ],
        },
      ],
    ],
    ai: "Variance is above the 7% tolerance — recount, then audit portion weights. Best rate: Local trader at ₹203.70 (3% below current).",
  },
};
