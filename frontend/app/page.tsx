"use client"

import { useEffect, useState } from "react"
import type { CryptoCurrency, MarketData } from "@/types/crypto"
import { fetchCryptocurrencies, fetchGlobalMarketData } from "@/lib/crypto-api"
import { MarketOverview } from "@/components/market-overview"
import { CryptoTable } from "@/components/crypto-table"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp } from "lucide-react"
import { Loader2 } from "lucide-react"

export default function CryptoDashboard() {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([])
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [progress, setProgress] = useState(0)

  const loadData = async () => {
    try {
      const [cryptoData, globalData] = await Promise.all([
        fetchCryptocurrencies(1, 100),
        fetchGlobalMarketData(),
      ])

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
  }, [])

  useEffect(() => {
    if (loading) {
      let interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 5
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [loading])


  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-gray-100 flex flex-col items-center justify-center space-y-6">
        {/* Spinner with shadcn style */}
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <h1 className="text-2xl font-bold tracking-tight">Loading Dashboard...</h1>
        </div>

        {/* Progress bar */}
        <div className="w-3/4 md:w-1/2 h-4 bg-muted rounded-full overflow-hidden shadow-sm">
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Iterative step text */}
        <p className="mt-2 text-muted-foreground text-sm">
          {progress < 30 && "Fetching cryptocurrencies..."}
          {progress >= 30 && progress < 70 && "Fetching global market data..."}
          {progress >= 70 && progress < 100 && "Almost there..."}
          {progress === 100 && "Ready!"}
        </p>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-background bg-gray-100 dark:bg-neutral-900">
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
            <div className="text-sm text-muted-foreground">
              Showing top {cryptocurrencies.length} cryptocurrencies
            </div>
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
