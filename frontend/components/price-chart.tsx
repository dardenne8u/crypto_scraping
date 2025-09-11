"use client"

import { Line, LineChart, ResponsiveContainer } from "recharts"

interface PriceChartProps {
  data: number[]
  className?: string
  isPositive?: boolean
}

export function PriceChart({ data, className = "", isPositive = true }: PriceChartProps) {
  const chartData = data.map((price, index) => ({
    index,
    price,
  }))

  return (
    <div className={`h-12 w-20 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
