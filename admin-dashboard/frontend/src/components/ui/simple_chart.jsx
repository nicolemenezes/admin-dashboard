"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"

const data = [
  { name: "Jan", pink: 120, teal: 90, gray: 35 },
  { name: "Feb", pink: 180, teal: 110, gray: 45 },
  { name: "Mar", pink: 130, teal: 150, gray: 55 },
  { name: "Apr", pink: 220, teal: 140, gray: 60 },
  { name: "May", pink: 175, teal: 170, gray: 65 },
  { name: "Jun", pink: 260, teal: 160, gray: 70 },
  { name: "Jul", pink: 210, teal: 200, gray: 80 },
  { name: "Aug", pink: 290, teal: 180, gray: 75 },
  { name: "Sep", pink: 240, teal: 210, gray: 85 },
  { name: "Oct", pink: 300, teal: 190, gray: 90 },
  { name: "Nov", pink: 260, teal: 220, gray: 95 },
  { name: "Dec", pink: 330, teal: 230, gray: 100 },
]

const NEON_PINK = "#ff2bd1"
const TEAL = "#22d3ee" // cyan/teal accent
const GRAY = "#9ca3af" // neutral companion
const AXIS = "rgba(255,255,255,0.75)"
const GRID = "rgba(255,255,255,0.10)"

export default function SimpleLineChart() {
  return (
    <div className="h-80 w-full rounded-2xl bg-black p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="4 4" />
          <XAxis dataKey="name" stroke={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis stroke={AXIS} tickLine={false} axisLine={{ stroke: GRID }} />
          <Tooltip
            contentStyle={{
              background: "rgba(0,0,0,0.95)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ color: "rgba(255,255,255,0.85)", paddingBottom: 8 }}
          />

          <Line
            type="monotone"
            dataKey="pink"
            name="Revenue"
            stroke={NEON_PINK}
            strokeOpacity={0.25}
            strokeWidth={8}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="pink"
            name="Revenue"
            stroke={NEON_PINK}
            strokeWidth={2.5}
            dot={{ r: 4, stroke: NEON_PINK, strokeWidth: 2, fill: "rgba(255,43,209,0.18)" }}
            activeDot={{ r: 6, stroke: NEON_PINK, strokeWidth: 2, fill: "rgba(255,43,209,0.28)" }}
          />

          <Line
            type="monotone"
            dataKey="teal"
            name="Costs"
            stroke={TEAL}
            strokeWidth={2}
            dot={{ r: 3, stroke: TEAL, strokeWidth: 1.5, fill: "rgba(34,211,238,0.15)" }}
          />
          <Line
            type="monotone"
            dataKey="gray"
            name="Baseline"
            stroke={GRAY}
            strokeDasharray="6 6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
