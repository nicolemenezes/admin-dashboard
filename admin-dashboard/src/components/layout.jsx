"use client"

import { useState } from "react"
import {Header} from "./header"
import Sidebar from "./sidebar"

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[18rem_1fr]">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-col">
        <Header onToggleSidebar={() => setOpen((v) => !v)} />
        <main className="p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
