export const TABS = [
  { id: "flow", label: "Process flow" },
  { id: "stock", label: "Stock" },
  { id: "po", label: "Purchase orders" },
  { id: "grn", label: "GRN" },
  { id: "issue", label: "Issue to kitchen" },
  { id: "cons", label: "Consumption" },
  { id: "waste", label: "Wastage" },
];

export const STATIONS = ["Main Kitchen", "Tandoor", "Bar", "Dessert"];

export const ALERT = {
  today: { text: "Order TODAY", tone: "danger" },
  soon: { text: "Order within 2 days", tone: "warn" },
  ok: { text: "Healthy", tone: "ok" },
};

export const STOCK = [
  { id: "rice", name: "Basmati Rice", cat: "Dry", min: "20 kg", unit: "kg", store: "38 kg", kitchen: 8, total: 46, use: 12.3, cover: "3.7", expiry: "08 Apr 2027 (150d)", alert: "soon", canOrder: true },
  { id: "chk", name: "Chicken", cat: "Meat/Fish", min: "15 kg", unit: "kg", store: "22 kg", kitchen: 6, total: 28, use: 36.5, cover: "0.8", expiry: "11 Nov 2026 (2d)", alert: "today", canOrder: true },
  { id: "mut", name: "Mutton", cat: "Meat/Fish", min: "6 kg", unit: "kg", store: "4.2 kg", kitchen: 2.4, total: 6.6, use: 7.7, cover: "0.9", expiry: "11 Nov 2026 (2d)", alert: "today", canOrder: true },
  { id: "pan", name: "Paneer", cat: "Dairy", min: "4 kg", unit: "kg", store: "4.5 kg", kitchen: 3.6, total: 8.1, use: 9.4, cover: "0.9", expiry: "14 Nov 2026 (5d)", alert: "today", canOrder: true },
  { id: "mas", name: "Biryani Masala", cat: "Dry", min: "1.5 kg", unit: "kg", store: "1.1 kg", kitchen: 0.6, total: 1.7, use: 1.2, cover: "1.4", expiry: "08 Apr 2027 (150d)", alert: "today", canOrder: true },
  { id: "oil", name: "Cooking Oil", cat: "Dry", min: "15 L", unit: "L", store: "31 L", kitchen: 6, total: 37, use: 9.2, cover: "4.0", expiry: "08 Apr 2027 (150d)", alert: "ok", canOrder: true },
  { id: "cur", name: "Curd", cat: "Dairy", min: "8 kg", unit: "kg", store: "12 kg", kitchen: 3.2, total: 15.2, use: 8.1, cover: "1.9", expiry: "14 Nov 2026 (5d)", alert: "today", canOrder: true },
  { id: "flr", name: "Wheat Flour (Maida)", cat: "Dry", min: "10 kg", unit: "kg", store: "18 kg", kitchen: 4, total: 22, use: 16.9, cover: "1.3", expiry: "08 Apr 2027 (150d)", alert: "today", canOrder: true },
  { id: "mlk", name: "Milk", cat: "Dairy", min: "15 L", unit: "L", store: "25 L", kitchen: 6, total: 31, use: 11.6, cover: "2.7", expiry: "14 Nov 2026 (5d)", alert: "soon", canOrder: true },
  { id: "cof", name: "Coffee Decoction", cat: "Dry", min: "3 L", unit: "L", store: "6 L", kitchen: 1.2, total: 7.2, use: 2.1, cover: "3.5", expiry: "08 Apr 2027 (150d)", alert: "soon", canOrder: true },
  { id: "onn", name: "Onion", cat: "Veg", min: "20 kg", unit: "kg", store: "40 kg", kitchen: 8, total: 48, use: 6.9, cover: "7.0", expiry: "12 Nov 2026 (3d)", alert: "ok", canOrder: false },
  { id: "tom", name: "Tomato", cat: "Veg", min: "10 kg", unit: "kg", store: "9 kg", kitchen: 4, total: 13, use: 10.5, cover: "1.2", expiry: "12 Nov 2026 (3d)", alert: "today", canOrder: true },
  { id: "fsh", name: "Seer Fish", cat: "Meat/Fish", min: "5 kg", unit: "kg", store: "0 kg", kitchen: 2, total: 2, use: 0.0, cover: "–", expiry: "—", alert: "ok", canOrder: false },
  { id: "btr", name: "Butter", cat: "Dairy", min: "2 kg", unit: "kg", store: "3.4 kg", kitchen: 0.8, total: 4.2, use: 2.5, cover: "1.7", expiry: "14 Nov 2026 (5d)", alert: "today", canOrder: true },
  { id: "egg", name: "Eggs", cat: "Meat/Fish", min: "60 nos", unit: "nos", store: "120 nos", kitchen: 24, total: 144, use: 34.1, cover: "4.2", expiry: "11 Nov 2026 (2d)", alert: "ok", canOrder: true },
  { id: "pkg", name: "Packaging Box", cat: "Dry", min: "100 nos", unit: "nos", store: "140 nos", kitchen: 0, total: 140, use: 0.0, cover: "–", expiry: "08 Apr 2027 (150d)", alert: "ok", canOrder: false },
];

export const KITCHEN_INIT = {
  rice: { "Main Kitchen": 8 },
  chk: { "Main Kitchen": 6 },
  mut: { "Main Kitchen": 2.4 },
  pan: { Tandoor: 3.6 },
  mas: { "Main Kitchen": 0.6 },
  oil: { "Main Kitchen": 6 },
  cur: { "Main Kitchen": 3.2 },
  flr: { Tandoor: 4 },
  mlk: { "Main Kitchen": 6 },
  cof: { Bar: 1.2 },
  onn: { "Main Kitchen": 8 },
  tom: { "Main Kitchen": 4 },
  fsh: { "Main Kitchen": 2 },
  btr: { "Main Kitchen": 0.8 },
  egg: { "Main Kitchen": 24 },
};
export const KITCHEN_ITEMS = STOCK.filter((s) => KITCHEN_INIT[s.id]);

export const PO_INIT = [
  { id: "PO-2109", supplier: "Kasimedu Fish Mkt", expected: "11 Nov 2026", items: "Seer Fish 10 kg", value: 7800, status: "draft" },
  { id: "PO-2108", supplier: "Koyambedu Market", expected: "11 Nov 2026", items: "Tomato 40 kg", value: 1680, status: "draft" },
  { id: "PO-2107", supplier: "Kumbakonam Coffee", expected: "11 Nov 2026", items: "Coffee Decoction 4 L", value: 840, status: "draft" },
  { id: "PO-2106", supplier: "Sakthi Masala", expected: "11 Nov 2026", items: "Biryani Masala 5 kg", value: 2600, status: "draft" },
  { id: "PO-2105", supplier: "Fresh Poultry Co.", expected: "11 Nov 2026", items: "Chicken 155 kg, Mutton 32 kg", value: 56870, status: "draft" },
  { id: "PO-2104", supplier: "Sri Lakshmi Traders", expected: "11 Nov 2026", items: "Basmati Rice 16 kg, Cooking Oil 9 L, Wheat Flour (Maida) 63 kg, Eggs 27 nos", value: 6051, status: "draft" },
  { id: "PO-2101", supplier: "Sri Lakshmi Traders", expected: "10 Nov 2026", items: "Basmati Rice 40 kg, Cooking Oil 30 L, Wheat Flour (Maida) 20 kg", value: 9650, status: "sent" },
  { id: "PO-2102", supplier: "Fresh Poultry Co.", expected: "11 Nov 2026", items: "Chicken 30 kg, Mutton 12 kg", value: 15420, status: "sent" },
  { id: "PO-2103", supplier: "Aavin Dairy", expected: "12 Nov 2026", items: "Paneer 8 kg, Curd 16 kg, Milk 30 L, Butter 9 kg", value: 10560, status: "draft" },
];

export const INDENT_INIT = [
  { id: "IND-1041", station: "Main Kitchen", by: "Chef Murugan", items: "Chicken 6, Basmati Rice 10", status: "requested" },
  { id: "IND-1040", station: "Tandoor", by: "Tandoor lead", items: "Paneer 2", status: "issued" },
];

export const MOVEMENTS = [
  { time: "09:56 am", type: "ISSUE", tone: "info", item: "Paneer", qty: "2 kg", route: "Store → Tandoor", ref: "IND-1040" },
  ...[
    ["Coffee Decoction", "1.2 L", "— → Bar"],
    ["Wheat Flour (Maida)", "4 kg", "— → Tandoor"],
    ["Eggs", "24 nos", "— → Main Kitchen"],
    ["Mutton", "2.4 kg", "— → Main Kitchen"],
    ["Biryani Masala", "0.6 kg", "— → Main Kitchen"],
    ["Basmati Rice", "8 kg", "— → Main Kitchen"],
    ["Onion", "8 kg", "— → Main Kitchen"],
    ["Milk", "6 L", "— → Main Kitchen"],
    ["Tomato", "4 kg", "— → Main Kitchen"],
  ].map(([item, qty, route]) => ({
    time: "09:56 am", type: "OPENING", tone: "muted", item, qty, route, ref: "Opening kitchen float",
  })),
];

export const PROCESS_STEPS = [
  ["1 · Reorder", "Forecast compares days of cover (store plus kitchen) with the supplier lead time and flags what to order.", "Manager"],
  ["2 · Purchase order", "Draft POs are built from low stock, grouped by supplier, then sent.", "Manager / Owner"],
  ["3 · GRN", "Goods are received against a PO or directly. Quantity, quality, chilled temperature, batch, expiry and rate are checked. Accepted goods enter the store and payables; rejected goods are flagged for return.", "Storekeeper"],
  ["4 · Store", "Stock is held by batch. The batch with the earliest expiry is used first.", "Storekeeper"],
  ["5 · Indent and issue", "A kitchen station asks for stock. The storekeeper issues it, stock moves from store to that station, and the kitchen acknowledges.", "Chef / Storekeeper"],
  ["6 · Consumption", "Each sale deducts the recipe quantities from the dish station first. If that station is empty, stock is taken from the store and flagged as having no indent.", "Automatic"],
  ["7 · Wastage and counts", "Wastage reduces the place where it happened. Counts correct on-hand stock and record the variance.", "Kitchen / Storekeeper"],
];

export const WASTAGE = [
  { time: "09:56 am", item: "Cooking Oil", qty: "0.02 L", where: "Store", reason: "Returned by customer", value: 3 },
  { time: "09:56 am", item: "Curd", qty: "0.05 kg", where: "Store", reason: "Returned by customer", value: 4 },
  { time: "09:56 am", item: "Chicken", qty: "0.35 kg", where: "Store", reason: "Returned by customer", value: 74 },
  { time: "11:20 am", item: "Tomato", qty: "1.5 kg", where: "Store", reason: "Spoiled", value: 63 },
  { time: "01:05 pm", item: "Chicken", qty: "0.4 kg", where: "Store", reason: "Over-prep", value: 84 },
  { time: "03:40 pm", item: "Milk", qty: "2 L", where: "Store", reason: "Curdled", value: 112 },
];

export const inr = (n) => "₹" + n.toLocaleString("en-IN");

export const WASTE_LOCATIONS = ["Store", ...STATIONS];

export const WASTE_REASONS = [
  "Prep trim", "Spoilage", "Expired", "Overcooked / burnt",
  "Returned by customer", "Spill / breakage", "Staff meal", "Sample / tasting",
];

/* Cost per unit (₹) used to value wastage. Placeholder rates: replace with your real item cost. */
export const UNIT_COST = {
  rice: 90, chk: 211, mut: 750, pan: 340, mas: 520, oil: 150, cur: 80, flr: 40,
  mlk: 56, cof: 210, onn: 35, tom: 42, fsh: 780, btr: 520, egg: 7, pkg: 5,
};

export const STORE_INIT = Object.fromEntries(STOCK.map((s) => [s.id, parseFloat(s.store)]));

/* "11 Nov 2026 (2d)" -> "11 Nov 2026" */
export const oldestBatch = (item) => item.expiry.replace(/\s*\(.*\)$/, "");

/* Turns an old indent text like "Chicken 6, Basmati Rice 10" into [{ itemId, qty }] */
export const parseIndentItems = (text) =>
  text
    .split(",")
    .map((part) => {
      const m = part.trim().match(/^(.*?)\s+([\d.]+)$/);
      const item = m && STOCK.find((s) => s.name === m[1]);
      return item ? { itemId: item.id, qty: Number(m[2]) } : null;
    })
    .filter(Boolean);

    // Add to InventoryData.js

/* Supplier for each item, used to group draft POs (matches the suppliers in your PO list) */
export const SUPPLIER = {
  rice: "Sri Lakshmi Traders", oil: "Sri Lakshmi Traders", flr: "Sri Lakshmi Traders", egg: "Sri Lakshmi Traders",
  chk: "Fresh Poultry Co.", mut: "Fresh Poultry Co.",
  pan: "Aavin Dairy", cur: "Aavin Dairy", mlk: "Aavin Dairy", btr: "Aavin Dairy",
  tom: "Koyambedu Market", onn: "Koyambedu Market",
  cof: "Kumbakonam Coffee", mas: "Sakthi Masala", fsh: "Kasimedu Fish Mkt",
  pkg: "Sri Lakshmi Traders",
};
// Add to InventoryData.js (STOCK, UNIT_COST and oldestBatch must already be exported there)

export const SUPPLIERS = [
  "Sri Lakshmi Traders", "Fresh Poultry Co.", "Aavin Dairy", "Sakthi Masala", "Kumbakonam Coffee",
  "Koyambedu Market", "Kasimedu Fish Mkt", "PackWell",
  "Sister Concern – Central Kitchen", "Sister Concern – Dairy Unit",
];

/* Purchase rate (₹ per unit) pre-filled in the GRN. Worked out from your PO values; replace with real rates. */
export const RECEIVE_RATE = { ...UNIT_COST, rice: 118, oil: 135, flr: 44, chk: 210, mut: 760, egg: 6.5 };

/* "Basmati Rice 40 kg, Cooking Oil 30 L" -> [{ itemId, qty }] */
export const parsePoItems = (text) =>
  text
    .split(",")
    .map((part) => {
      const m = part.trim().match(/^(.*?)\s+([\d.]+)\s*[A-Za-z]*$/);
      const item = m && STOCK.find((s) => s.name === m[1]);
      return item ? { itemId: item.id, qty: Number(m[2]) } : null;
    })
    .filter(Boolean);

/* Item's current expiry as a yyyy-mm-dd string for <input type="date"> ("" when unknown) */
export const isoExpiry = (item) => {
  const t = Date.parse(`${oldestBatch(item)} 00:00 UTC`);
  return Number.isNaN(t) ? "" : new Date(t).toISOString().slice(0, 10);
};

