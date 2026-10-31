import {
  LayoutDashboard,
  FileText,
  Hexagon,
  Activity,
  Tag,
  Menu,
  Users,
  Shield,
  Cpu,
  SlidersHorizontal,
  ChefHat,
  Book,
} from "lucide-react";

export const BackOfficeSidebarData = [
  {
    group: "back-office", 
    items: [
      {
        path: "overview",
        icon: <LayoutDashboard size={15} />,
        label: "Overview",
      },
      {
        path: "purchase",
        icon: <FileText size={15} />,
        label: "Purchase",
      },
      {
        path: "inventory",
        icon: <Hexagon size={15} />,
        label: "Inventory",
      },
      {
        path: "production",
        icon: <ChefHat size={15} />,
        label: "Production",
      },
      {
        path: "recon",
        icon: <Activity size={15} />,
        label: "Recon",
      },
      {
        path: "expenses",
        icon: <Tag size={15} />,
        label: "Expenses",
      },
      {
        path: "vouchers",
        icon: <Menu size={15} />,
        label: "Vouchers",
      },
      {
        path: "staff",
        icon: <Users size={15} />,
        label: "Staff & Pay",
      },
      {
        path: "p&l",
        icon: <Activity size={15} />,
        label: "P&L",
      },
      {
        path: "compliance",
        icon: <Shield size={15} />,
        label: "Compliance",
      },
      {
        path: "menu",
        icon: <Book size={15} />,
        label: "Menu & QR",
      },
      {
        path: "IoT",
        icon: <Cpu size={15} />,
        label: "IoT",
      },
      {
        path: "settings",
        icon: <SlidersHorizontal size={15} />,
        label: "Settings",
      },
    ],
  },
];