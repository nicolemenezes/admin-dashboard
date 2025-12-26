import React, { useState } from "react";
import { Menu, Bell, Search, ChevronDown } from "lucide-react";

export function Header({ onToggleSidebar }) {
  const [query, setQuery] = useState("");

  return (
    <header
      className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200"
      role="banner"
    >
      <div className="mx-auto flex h-14 items-center gap-3 px-4">
        <button
          onClick={() => onToggleSidebar?.()}
          className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/40">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search"
              className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-64"
            />
          </div>

          <button
            className="relative p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="sr-only">1 unread notification</span>
            <span
              aria-hidden
              className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
            ></span>
          </button>

          <button
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white shadow-sm px-3 py-1.5 hover:bg-gray-50"
            aria-label="Account menu"
          >
            <div
              aria-hidden
              className="h-6 w-6 rounded-full bg-blue-600 text-white grid place-items-center text-[10px] font-semibold"
            >
              A
            </div>
            <span className="hidden sm:inline text-sm font-medium">You</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}