/* eslint-disable react/jsx-no-undef */
"use client"

import { Menu, Bell, Search, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export  function Header({ onToggleSidebar }) {
  const [query, setQuery] = useState("")

  return (
    <header
      className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
      role="banner"
    >
      <div className="mx-auto flex h-14 items-center gap-3 px-4">
        <Button variant="ghost" size="icon" aria-label="Toggle sidebar" className="md:hidden" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 ring-1 ring-accent/30 flex items-center justify-center">
            <span className="sr-only">Brand</span>
            <span className="text-primary font-semibold">A</span>
          </div>
          <span className="font-semibold">Admin</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-xl bg-card border border-border px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-accent/40">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              aria-label="Search"
              className="bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
            />
          </div>

          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">1 unread notification</span>
            <span aria-hidden className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent ring-2 ring-card"></span>
          </Button>

          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-xl border border-border bg-card shadow-sm"
            aria-label="Account menu"
          >
            <div
              aria-hidden
              className="h-6 w-6 rounded-full bg-primary/15 text-primary grid place-items-center text-[10px] font-semibold"
            >
              U
            </div>
            <span className="hidden sm:inline text-sm">You</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  )
}
