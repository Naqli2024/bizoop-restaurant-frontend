export const COUNTRIES = {
  IN: { name: "India", tax: "GST", rate: 5, fy: "April", tz: "Asia/Kolkata", cur: "₹", idLabel: "GSTIN" },
  AE: { name: "UAE", tax: "VAT", rate: 5, fy: "January", tz: "Asia/Dubai", cur: "AED ", idLabel: "TRN" },
  SA: { name: "Saudi Arabia", tax: "VAT", rate: 15, fy: "January", tz: "Asia/Riyadh", cur: "SAR ", idLabel: "VAT number" },
  OM: { name: "Oman", tax: "VAT", rate: 5, fy: "January", tz: "Asia/Muscat", cur: "OMR ", idLabel: "VAT number" },
  BH: { name: "Bahrain", tax: "VAT", rate: 10, fy: "January", tz: "Asia/Bahrain", cur: "BHD ", idLabel: "VAT number" },
  QA: { name: "Qatar", tax: "NONE", rate: 0, fy: "January", tz: "Asia/Qatar", cur: "QAR ", idLabel: "Tax ID" },
  KW: { name: "Kuwait", tax: "NONE", rate: 0, fy: "January", tz: "Asia/Kuwait", cur: "KWD ", idLabel: "Tax ID" },
};

export const ENTITY_TYPES = ["Proprietorship", "Partnership", "LLP", "Private limited", "Public limited", "Other"];
export const MONTHS = ["January", "April", "July", "October"];
export const ROLES = ["Owner", "Manager", "Accountant", "Cashier", "Captain", "Chef", "Storekeeper"];
export const FONTS = ["Inter", "DM Sans", "Manrope", "Poppins", "Plus Jakarta Sans", "Roboto", "System UI"];
export const SWATCHES = ["#1B96FF", "#0176D3", "#00A67E", "#7C3AED", "#E11D48", "#F59E0B", "#111827"];
export const STEPS = ["Business", "Location & tax", "Outlets", "Team", "Review"];

export const TABS = [
  { id: "org", label: "Organisation" },
  { id: "tax", label: "Tax" },
  { id: "brand", label: "Brand & layout" },
  { id: "print", label: "Printing" },
];

export const STORAGE_KEY = "bizoop.settings.v1";

export const INITIAL = {
  tab: "org",
  org: {
    step: 0, done: false, country: "IN",
    legal: "", trade: "Spice Route", entity: "Private limited",
    phone: "", email: "", web: "",
    taxId: "33ABCDE1234F1Z5", addr: "Anna Nagar, Chennai 600040",
    fssai: "12420001000123", fy: "April", tz: "Asia/Kolkata",
    outlets: [{ name: "Anna Nagar", city: "Chennai", seats: 60 }],
    team: [{ name: "Rajesh Iyer", role: "Owner", mobile: "" }],
  },
  tax: { type: "GST", rate: 5 },
  brand: { name: "", logo: "", color: "#1B96FF", theme: "dark", font: "Inter", radius: 8 },
  receipt: {
    paper: "80", hdr: "", ftr: "Thank you · Visit again",
    showLogo: true, showTaxId: true, autoPrint: false,
    printer: "p1", conn: "LAN", copies: 1, cut: "partial",
    provPrinter: "p1", zPrinter: "p1", drawer: true, qr: true,
  },
  kot: {
    mode: "station", paper: "80", fontSize: "normal", copies: 1,
    auto: true, notes: true, beep: true,
  },
  printers: [
    { id: "p1", name: "Main Kitchen Printer", model: "Epson TM-T82II", station: "Main Kitchen", ip: "192.168.1.41", on: true },
    { id: "p2", name: "Tandoor Printer", model: "Epson TM-T82II", station: "Tandoor", ip: "192.168.1.42", on: true },
    { id: "p3", name: "Bar Printer", model: "Xprinter XP-N160II", station: "Bar", ip: "192.168.1.43", on: true },
    { id: "p4", name: "Dessert Counter Printer", model: "Xprinter XP-N160II", station: "Dessert", ip: "192.168.1.44", on: true },
    { id: "p5", name: "Billing Counter (80mm)", model: "Epson TM-T88VI", station: "Bill", ip: "192.168.1.40", on: true },
  ],
};
