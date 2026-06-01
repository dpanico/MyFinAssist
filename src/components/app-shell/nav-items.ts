import {
  ArrowLeftRight,
  BarChart3,
  CircleDollarSign,
  FileText,
  Gauge,
  Landmark,
  LineChart,
  PlugZap,
  Settings,
  WalletCards
} from "lucide-react";

export const primaryNavItems = [
  { href: "/mri", label: "MRI", icon: Gauge },
  { href: "/investments", label: "Investments", icon: LineChart },
  { href: "/cash-flow", label: "Cash Flow", icon: CircleDollarSign },
  { href: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { href: "/leaks", label: "Leaks", icon: BarChart3 },
  { href: "/monthly-report", label: "Monthly Report", icon: FileText },
  { href: "/connector-lab", label: "Connector Lab", icon: PlugZap },
  { href: "/settings/accounts", label: "Settings", icon: Settings }
];

export const settingsNavItems = [
  { href: "/settings/accounts", label: "Accounts", icon: WalletCards },
  { href: "/settings/categories", label: "Categories", icon: Landmark },
  { href: "/settings/rules", label: "Rules", icon: Settings },
  { href: "/settings/imports", label: "Imports", icon: FileText },
  { href: "/settings/statements", label: "Statements", icon: FileText }
];
