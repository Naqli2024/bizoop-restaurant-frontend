export const AMBIENT = 28;

export const seedHistory = (base) =>
  Array.from({ length: 24 }, () => +(base + (Math.random() - 0.5) * 0.8).toFixed(1));

export const INITIAL_UNITS = [
  { id: "t1", name: "Walk-in chiller", zone: "Main kitchen", kind: "Fridge", protocol: "MQTT", address: "cold/walkin-1", now: 3.3, setpoint: 3, min: 0, max: 5, online: true, power: true },
  { id: "t2", name: "Walk-in freezer", zone: "Store", kind: "Freezer", protocol: "MQTT", address: "cold/freezer-1", now: -19.9, setpoint: -20, min: -25, max: -18, online: true, power: true },
  { id: "t3", name: "Bar reach-in fridge", zone: "Bar", kind: "Fridge", protocol: "Modbus TCP", address: "192.168.1.60:502 unit 1", now: null, setpoint: 3, min: 0, max: 5, online: false, power: false },
  { id: "t4", name: "Dessert display chiller", zone: "Dessert counter", kind: "Fridge", protocol: "BLE gateway", address: "AA:BB:CC:11:22:33", now: 3.9, setpoint: 3.5, min: 0, max: 5, online: true, power: true },
].map((u) => ({ ...u, history: seedHistory(u.now ?? u.setpoint) }));

export const INITIAL_CAMERAS = [
  { id: "c1", name: "Kitchen pass", zone: "Kitchen", address: "rtsp://192.168.1.71/stream1", online: true, streamUrl: "" },
  { id: "c2", name: "Cash counter", zone: "Billing", address: "rtsp://192.168.1.72/stream1", online: true, streamUrl: "" },
  { id: "c3", name: "Store room", zone: "Store", address: "rtsp://192.168.1.73/stream1", online: false, streamUrl: "" },
  { id: "c4", name: "Dining hall", zone: "Floor", address: "rtsp://192.168.1.74/stream1", online: true, streamUrl: "" },
];

export const INITIAL_ALERTS = [
  { id: 1, text: "Dessert display chiller above 5 °C for 22 min", time: "11:31 am", acked: false },
];

export const INITIAL_RULES = [
  { id: "temp", label: "Temperature outside limits for longer than the unit delay", on: true },
  { id: "offline", label: "Offline for more than 10 minutes", on: true },
  { id: "power", label: "Power failure at a cold room", on: true },
  { id: "motion", label: "Motion on store or kitchen cameras after closing", on: false },
  { id: "void", label: "Bookmark camera clip when a bill is voided or the drawer opens", on: false },
];

export const INITIAL_NOTIFY = { whatsapp: true, sms: false, email: true, push: true, escalateMin: 30 };
export const INITIAL_GATEWAY = { host: "", port: 8883, user: "", prefix: "bizoop/outlet-1", tls: false };

export const TABS = [
  ["ov", "Overview"],
  ["cold", "Cold chain"],
  ["cam", "Cameras"],
  ["dev", "Devices & gateway"],
  ["rules", "Alerts & rules"],
];