
import {
  ConciergeBell,
  Monitor,
  Building2,
  CreditCard,
  ChartNoAxesCombined,
} from "lucide-react";

export const SidebarConfig = [
  {
    id:1,
    name: "Cashier",
    path: "/cashier/sales-iq",
    icon: CreditCard,
  },
  {
    id:2,
    name: "Captain",
    path: "/captain/floor",
    icon: ConciergeBell,
  },
  {
    id:3,
    name: "KOT Display",
    path: "/kot-display/display",
    icon: Monitor,
  },
  {
    id:4,
    name: "Owner / Admin",
    path: "/admin/command",
    icon: ChartNoAxesCombined,
  },
  {
    id:5,
    name: "Back Office",
    path: "/back-office/overview",
    icon: Building2,
  },
];
