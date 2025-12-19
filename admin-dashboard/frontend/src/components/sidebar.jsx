import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Table2,
  CreditCard,
  MonitorSmartphone,
  User,
  LogIn,
  UserPlus,
} from "lucide-react";

const mainNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/tables", label: "Tables", icon: Table2 },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/virtual-reality", label: "Live Sessions", icon: MonitorSmartphone },
  { href: "/profile", label: "Profile", icon: User },
];

const authNavItems = [
  { href: "/signin", label: "Sign In", icon: LogIn },
  { href: "/signup", label: "Sign Up", icon: UserPlus },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white h-screen p-4 border-r">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="font-semibold text-gray-800">Admin</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {mainNavItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 p-2 rounded-xl 
                         font-medium transition-all duration-200 
                         ${
                           active
                             ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-md shadow-purple-100"
                             : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 hover:shadow-md hover:shadow-purple-100"
                         }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-200 space-y-2">
        {authNavItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 p-2 rounded-xl 
                         font-medium transition-all duration-200 
                         ${
                           active
                             ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-md shadow-purple-100"
                             : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 hover:shadow-md hover:shadow-purple-100"
                         }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}