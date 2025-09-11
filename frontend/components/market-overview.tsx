"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MarketData } from "@/types/crypto"
import { formatCurrency, formatPercentage } from "@/lib/crypto-api"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"

interface MarketOverviewProps {
  marketData: MarketData | null
}

export function MarketOverview({ marketData }: MarketOverviewProps) {
  if (!marketData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-32 mb-2"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalMarketCap = marketData.total_market_cap.usd
  const totalVolume = marketData.total_volume.usd
  const btcDominance = marketData.market_cap_percentage.btc
  const marketCapChange = marketData.market_cap_change_percentage_24h_usd

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalMarketCap)}</div>
          <div
            className={`text-xs flex items-center ${marketCapChange >= 0 ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}
          >
            {marketCapChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {formatPercentage(marketCapChange)} (24h)
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
          <p className="text-xs text-muted-foreground">Total trading volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">BTC Dominance</CardTitle>
          <div className="h-4 w-4 rounded-full bg-orange-500 dark:bg-orange-400"></div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{btcDominance.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Bitcoin market share</p>
        </CardContent>
      </Card>
    </div>
  )
}
