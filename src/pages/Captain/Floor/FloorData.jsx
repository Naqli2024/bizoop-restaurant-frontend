
export const SECTIONS = ["All", "AC Hall", "Family Hall", "Terrace"];

export const STATUS_LABELS = {
    free: "Free",
    res: "Reserved",
    ordering: "Ordering",
    kitchen: "In kitchen",
    ready: "Food ready",
    served: "Dining",
    bill: "Bill requested",
};

export const STATUS_COLORS = {
    free: "var(--green)",
    res: "var(--muted)",
    ordering: "var(--blue)",
    kitchen: "var(--a2)",
    ready: "#22c55e",
    served: "var(--purple)",
    bill: "var(--red)",
};


export const INITIAL_ORDERS = {
  "ORD-01": {
    id: "ORD-01",
    label: "T1",
    table: "T1",
    type: "dine",
    captain: "Ravi K.",
    pax: 3,
    status: "served",
    created: Date.now() - 18 * 60000,
    items: [
      { name: "Chicken Biryani", price: 280, qty: 2 },
      { name: "Chicken 65", price: 220, qty: 1 },
      { name: "Fresh Lime Soda", price: 80, qty: 2 },
    ],
  },

  "ORD-02": {
    id: "ORD-02",
    label: "T2",
    table: "T2",
    type: "dine",
    captain: "Priya S.",
    pax: 2,
    status: "ordering",
    created: Date.now() - 5 * 60000,
    items: [
      { name: "Paneer Tikka", price: 240, qty: 1 },
      { name: "Veg Fried Rice", price: 190, qty: 2 },
    ],
  },

  "ORD-03": {
    id: "ORD-03",
    label: "F1",
    table: "F1",
    type: "dine",
    captain: "Karthik M.",
    pax: 4,
    status: "kitchen",
    created: Date.now() - 25 * 60000,
    items: [
      { name: "Mutton Biryani", price: 350, qty: 2 },
      { name: "Chicken 65", price: 220, qty: 1 },
      { name: "Gulab Jamun", price: 90, qty: 4 },
    ],
  },

  "ORD-04": {
    id: "ORD-04",
    label: "R1",
    table: "R1",
    type: "dine",
    captain: "Divya R.",
    pax: 2,
    status: "bill",
    created: Date.now() - 8 * 60000,
    items: [
      { name: "Masala Dosa", price: 120, qty: 2 },
      { name: "Filter Coffee", price: 50, qty: 2 },
    ],
  },

  "ORD-05": {
    id: "ORD-05",
    label: "T3",
    table: "T3",
    type: "dine",
    captain: "Ravi K.",
    pax: 2,
    status: "bill",
    created: Date.now() - 15 * 60000,
    items: [
      { name: "Chicken Biryani", price: 280, qty: 2 },
      { name: "Fresh Lime Soda", price: 80, qty: 2 },
    ],
  },

  "ORD-06": {
    id: "ORD-06",
    label: "F2",
    table: "F2",
    type: "dine",
    captain: "Priya S.",
    pax: 5,
    status: "kitchen",
    prio:true,
    created: Date.now() - 22 * 60000,
    items: [
      { name: "Paneer Tikka", price: 240, qty: 2 },
      { name: "Veg Fried Rice", price: 190, qty: 2 },
      { name: "Gulab Jamun", price: 90, qty: 3 },
    ],
  },

  "ORD-07": {
    id: "ORD-07",
    label: "F3",
    table: "F3",
    type: "dine",
    captain: "Karthik M.",
    pax: 3,
    status: "ready",
    created: Date.now() - 10 * 60000,
    items: [
      { name: "Chicken Biryani", price: 280, qty: 1 },
      { name: "Paneer Tikka", price: 240, qty: 1 },
      { name: "Fresh Lime Soda", price: 80, qty: 2 },
    ],
  },
  "ORD-08":
  {
    id: "ORD-08",
    label: "TA-01",
    table: null,
    type: "take",
    captain: "Ravi K.",
    pax: 1,
    status: "ready",
    cust: {
      name: "Suresh Rajan",
      mobile: "9841022334",
    },
    items: [
      { name: "Chicken Biryani", qty: 1, price:280},
      { name: "Gulab Jamun", qty: 2, price:180,},
    ],
  },
  "ORD-09":{
    id: "ORD-09",
    label: "DEL-01",
    table: null,
    type: "del",
    captain: "Priya S.",
    pax: 1,
    status: "ready",
    platform: "Swiggy",
    items: [
      { name: "Butter Chicken", qty: 1, price:300 },
      { name: "Garlic Naan", qty: 3, price:75 },
    ],
  },
};

export const INITIAL_TABLES = [
  { id: "T1", sec: "AC Hall", seats: 4, res: null, order: "ORD-01" },
  { id: "T2", sec: "AC Hall", seats: 4, res: null, order: "ORD-02" },
  { id: "T3", sec: "AC Hall", seats: 6, res: null, order: "ORD-05" },
  { id: "T4", sec: "AC Hall", seats: 4, res: null, order: null },

  { id: "F1", sec: "Family Hall", seats: 4, res: null, order: "ORD-03" },
  { id: "F2", sec: "Family Hall", seats: 6, res: null, order: "ORD-06" },
  { id: "F3", sec: "Family Hall", seats: 4, res: null, order: "ORD-07" },
  {
    id: "F4",
    sec: "Family Hall",
    seats: 6,
    res: { n: "Mr. Anand", t: "20:30", p: 6 },
    order: null,
  },

  { id: "R1", sec: "Terrace", seats: 2, res: null, order: "ORD-04" },
  { id: "R2", sec: "Terrace", seats: 4, res: null, order: null },
  { id: "R3", sec: "Terrace", seats: 4, res: null, order: null },
  { id: "R4", sec: "Terrace", seats: 6, res: null, order: null },
];

export const tb = (id) =>
  INITIAL_TABLES.find((table) => table.id === id);