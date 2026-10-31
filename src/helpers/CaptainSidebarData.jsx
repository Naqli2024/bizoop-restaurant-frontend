import { 
  LayoutGrid, 
  Menu, 
  PencilLineIcon
} from "lucide-react";

export const CaptainSidebarData = [
  {
    group: "Captain", // Updated group name
    items: [
      {
        path: "floor",
        icon: <LayoutGrid size={15} />,
        label: "Floor",
      },
      {
        path: "order",
        icon: <PencilLineIcon size={15} />,
        label: "Order",
      },
      {
        path: "orders",
        icon: <Menu size={15} />,
        label: "Orders",
      },
    ],
  },
];