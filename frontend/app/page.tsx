"use client"

import { useEffect, useState } from "react"
import type { CryptoCurrency, MarketData } from "@/types/crypto"
import { fetchCryptocurrencies, fetchGlobalMarketData } from "@/lib/crypto-api"
import { MarketOverview } from "@/components/market-overview"
import { CryptoTable } from "@/components/crypto-table"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp } from "lucide-react"

export default function CryptoDashboard() {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([])
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      const [cryptoData, globalData] = await Promise.all([fetchCryptocurrencies(1, 100), fetchGlobalMarketData()])

      setCryptocurrencies(cryptoData)
      setMarketData(globalData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
  }

  useEffect(() => {
    loadData()

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
              <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-24 bg-muted rounded animate-pulse"></div>
              <ThemeToggle />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-card rounded-lg border animate-pulse"></div>
            ))}
          </div>

          <div className="h-96 bg-card rounded-lg border animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Cryptocurrency Dashboard</h1>
              <p className="text-muted-foreground">Real-time market data and analytics</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Market Overview */}
        <MarketOverview marketData={marketData} />

        {/* Crypto Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Market Overview</h2>
            <div className="text-sm text-muted-foreground">Showing top {cryptocurrencies.length} cryptocurrencies</div>
          </div>

          <CryptoTable cryptocurrencies={cryptocurrencies} />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Data provided by CoinGecko API • Updates every 60 seconds</p>
          <p className="mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  )
}
