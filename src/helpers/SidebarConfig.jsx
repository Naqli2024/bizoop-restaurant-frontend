
import {
  ConciergeBell,
  Monitor,
  Building2,
  CreditCard,
  ChartNoAxesCombined,
} from "lucide-react";

export const SidebarConfig = [
  {
    keyNumber: 1,
    name: "Cashier",
    path: "/cashier/sales-iq",
    icon: CreditCard,
  },
  {
    keyNumber: 2,
    name: "Captain",
    path: "/captain/floor",
    icon: ConciergeBell,
  },
  {
    keyNumber: 3,
    name: "KOT Display",
    path: "/kot-display/display",
    icon: Monitor,
  },
  {
    keyNumber: 4,
    name: "Owner / Admin",
    path: "/admin",
    icon: ChartNoAxesCombined,
  },
  {
    keyNumber: 5,
    name: "Back Office",
    path: "/back-office",
    icon: Building2,
  },
];
