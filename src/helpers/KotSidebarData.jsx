import { Layers, Printer, Activity, Book, ChefHat } from "lucide-react";

export const KotSidebarData = [
  {
    group: "Kot-display", // Updated group name
    items: [
      {
        path: "display",
        icon: <Layers size={15} />,
        label: "Display",
      },
      {
        path: "printers",
        icon: <Printer size={15} />,
        label: "Printers",
      },
      {
        path: "perf",
        icon: <Activity size={15} />,
        label: "Perf",
      },
      {
        path: "sop",
        icon: <Book size={15} />,
        label: "SOP",
      },
      {
        path: "production",
        icon: <ChefHat size={15} />,
        label: "Production",
      },
    ],
  },
];