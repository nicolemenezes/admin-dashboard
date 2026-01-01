import React, { useState } from "react";
import { Bell, User } from "lucide-react";

export function Header({ onToggleSidebar, onLogout }) {
  const [query, setQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title / Breadcrumb */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome back! 
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user.role || "Member"}
              </p>
            </div>
            <div className="relative">
              <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-shadow">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : <User className="h-5 w-5" />}
              </button>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-2 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;