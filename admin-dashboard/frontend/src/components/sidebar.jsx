import React from "react";
import {
  Home,
  Table2,
  CreditCard,
  MonitorSmartphone,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";

const navItems = [
  { href: "#dashboard", label: "Dashboard", icon: Home },
  { href: "#tables", label: "Tables", icon: Table2 },
  { href: "#billing", label: "Billing", icon: CreditCard },
  { href: "#virtual", label: "Virtual Reality", icon: MonitorSmartphone },
  { href: "#profile", label: "Profile", icon: User },
  { href: "#sign-in", label: "Sign In", icon: LogIn },
  { href: "#sign-up", label: "Sign Up", icon: UserPlus },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white h-screen p-4 border-r">
      <div className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-3 p-2 rounded-xl 
                       text-gray-700 font-medium transition-all duration-200 
                       hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 
                       hover:text-purple-700 hover:shadow-md hover:shadow-purple-100"
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
