
import { MENU } from "./OrderData";

export const inr = (n) =>
  `₹${Math.round(n).toLocaleString("en-IN")}`;

export const inr2 = (n) => `₹${n.toFixed(2)}`;

export const pad4 = (n) => String(n).padStart(4, "0");

export const noteOf = (item) =>
  [
    item.spice,
    ...(item.addons || []),
    item.note && `“${item.note}”`,
  ]
    .filter(Boolean)
    .join(" · ");

export const normalizeOrderItems = (orderItems = []) =>
  orderItems.map((item, index) => {
    const menuItem = MENU.find(
      (menu) =>
        menu.id === item.id || menu.name === item.name
    );

    const sent =
      item.sent ??
      ["new", "prep", "ready", "served"].includes(item.state);

    return {
      uid: item.uid ?? 6000 + index,
      id: item.id ?? menuItem?.id,
      name: item.name ?? menuItem?.name ?? "Unknown item",
      price: Number(item.price ?? menuItem?.price ?? 0),
      qty: Number(item.qty) || 1,
      station: item.station ?? menuItem?.station ?? "kitchen",
      sent,
      state: item.state ?? (sent ? "new" : "draft"),
      hold: Boolean(item.hold),
      spice: item.spice ?? "",
      addons: Array.isArray(item.addons) ? item.addons : [],
      note: item.note ?? "",
      kot: item.kot ?? null,
    };
  });
