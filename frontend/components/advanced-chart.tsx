"use client"

import { useState, useEffect } from "react"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import type { CryptoCurrency } from "@/types/crypto"

interface AdvancedChartProps {
  crypto: CryptoCurrency
  timeframe: string
}

interface ChartData {
  time: string
  price: number
  volume: number
  high: number
  low: number
  open: number
  close: number
}

export function AdvancedChart({ crypto, timeframe }: AdvancedChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateChartData = () => {
      // Provide fallback values if crypto data is missing
      const basePrice = crypto?.current_price || 50000
      const sparklineData = crypto?.sparkline_in_7d?.price || []
      const dataPoints = Math.min(sparklineData.length || 24, 168) // Default to 24 hours if no sparkline

      const data: ChartData[] = []
      const now = new Date()

      // Generate fallback data if no sparkline data exists
      const priceData =
        sparklineData.length > 0
          ? sparklineData
          : Array.from({ length: 24 }, (_, i) => {
              const variation = (Math.random() - 0.5) * 0.1 // 10% variation
              return basePrice * (1 + variation)
            })

      for (let i = 0; i < Math.max(dataPoints, 24); i++) {
        const time = new Date(now.getTime() - (Math.max(dataPoints, 24) - i) * 60 * 60 * 1000)
        const price = priceData[i] || basePrice
        const volatility = price * 0.02 // 2% volatility

        data.push({
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          price: price,
          volume: Math.random() * 1000000000, // Mock volume data
          high: price + Math.random() * volatility,
          low: price - Math.random() * volatility,
          open: price + (Math.random() - 0.5) * volatility,
          close: price,
        })
      }

      return data
    }

    if (crypto) {
      setChartData(generateChartData())
    }
    setLoading(false)
  }, [crypto, timeframe])

  if (!crypto) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-muted-foreground">No cryptocurrency data available</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-96 w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} interval="preserveStartEnd" />
          <YAxis
            domain={["dataMin - 100", "dataMax + 100"]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-3 shadow-lg border">
                    <div className="space-y-1">
                      <p className="font-medium">{label}</p>
                      <p className="text-sm">
                        Price: <span className="font-mono">${payload[0]?.value?.toLocaleString()}</span>
                      </p>
                      <p className="text-sm">
                        Volume: <span className="font-mono">${payload[1]?.value?.toLocaleString()}</span>
                      </p>
                    </div>
                  </Card>
                )
              }
              return null
            }}
          />
          <Bar dataKey="volume" fill="hsl(var(--muted))" opacity={0.3} yAxisId="volume" />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
