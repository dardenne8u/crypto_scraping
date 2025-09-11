"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Target,
  Layers,
  MousePointer,
  Minus,
  Square,
  Triangle,
} from "lucide-react"

export function TradingToolbar() {
  const drawingTools = [
    { icon: MousePointer, label: "Select", active: true },
    { icon: Minus, label: "Trend Line" },
    { icon: Square, label: "Rectangle" },
    { icon: Triangle, label: "Triangle" },
    { icon: Target, label: "Fibonacci" },
  ]

  const indicators = [
    { name: "RSI", active: false },
    { name: "MACD", active: true },
    { name: "Bollinger Bands", active: false },
    { name: "Moving Average", active: true },
    { name: "Volume", active: true },
  ]

  return (
    <div className="space-y-4">
      {/* Drawing Tools */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Drawing Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {drawingTools.map((tool, index) => (
            <Button key={index} variant={tool.active ? "default" : "ghost"} size="sm" className="w-full justify-start">
              <tool.icon className="h-4 w-4 mr-2" />
              {tool.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Technical Indicators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{indicator.name}</span>
              <div className={`w-3 h-3 rounded-full ${indicator.active ? "bg-emerald-500" : "bg-muted"}`} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Fear & Greed</span>
            <span className="text-sm font-medium text-emerald-500">72 (Greed)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "72%" }}></div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
                Bullish
              </span>
              <span>68%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center">
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                Bearish
              </span>
              <span>32%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
