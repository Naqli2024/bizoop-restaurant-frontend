import {
  LayoutGrid,
  Monitor,
  AlignJustify,
  Book,
  Hexagon,
  File,
  Users,
  MessageSquare,
  Tag,
  Layers,
  Shield,
  Activity,
} from "lucide-react";

export const AdminSidebarData = [
  {
    group: "admin", 
    items: [
      {
        path: "command",
        icon: <LayoutGrid size={15} />,
        label: "Command",
      },
      {
        path: "sales",
        icon: <Monitor size={15} />,
        label: "Sales",
      },
      {
        path: "ops",
        icon: <AlignJustify size={15} />,
        label: "Ops",
      },
      {
        path: "kitchen",
        icon: <Book size={15} />,
        label: "Kitchen",
      },
      {
        path: "store",
        icon: <Hexagon size={15} />,
        label: "Store",
      },
      {
        path: "procure",
        icon: <File size={15} />,
        label: "Procure",
      },
      {
        path: "people",
        icon: <Users size={15} />,
        label: "People",
      },
      {
        path: "customers",
        icon: <MessageSquare size={15} />,
        label: "Customers",
      },
      {
        path: "finance",
        icon: <Tag size={15} />,
        label: "Finance",
      },
      {
        path: "assets",
        icon: <Layers size={15} />,
        label: "Assets",
      },
      {
        path: "comply",
        icon: <Shield size={15} />,
        label: "Comply",
      },
      {
        path: "intel",
        icon: <Activity size={15} />,
        label: "Intel",
      },
    ],
  },
];