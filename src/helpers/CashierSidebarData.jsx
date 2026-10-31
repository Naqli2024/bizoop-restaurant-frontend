import { 
  Activity, 
  Tv, 
  FileText, 
  MessageSquare, 
  Clock, 
  Hexagon, 
  PencilLineIcon
} from "lucide-react";

export const CashierSidebarData= [
  {
    group: "Cashier",
    items: [
      {
        path: "sales-iq",
        icon: <Activity size={15} />,
        label: "Sales IQ",
      },
      {
        path: "billing",
        icon: <Tv size={15} />, 
        label: "Billing",
      },
      {
        path: "returns",
        icon: <Activity size={15} />,
        label: "Returns",
      },
      {
        path: "bills",
        icon: <FileText size={15} />,
        label: "Bills",
      },
      {
        path: "whatsapp",
        icon: <MessageSquare size={15} />,
        label: "WhatsApp",
      },
      {
        path: "day-end",
        icon: <Clock size={15} />,
        label: "Day-end",
      },
      {
        path: "store",
        icon: <Hexagon size={15} />,
        label: "Store",
      },
      {
        path: "self-order",
        icon: <PencilLineIcon size={15} />,
        label: "Self-order",
      },
    ],
  },
];