"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, TrendingUp, TrendingDown, Volume2, DollarSign, BarChart3, Clock } from "lucide-react"
import { AdvancedChart } from "@/components/advanced-chart"
import type { CryptoCurrency } from "@/types/crypto"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/crypto-api"

// Mock data for demonstration - in a real app, this would come from an API
const getMockCryptoData = (id: string): CryptoCurrency => ({
  id,
  symbol: id === "bitcoin" ? "btc" : id === "ethereum" ? "eth" : id.slice(0, 3),
  name: id === "bitcoin" ? "Bitcoin" : id === "ethereum" ? "Ethereum" : id.charAt(0).toUpperCase() + id.slice(1),
  image: `https://assets.coingecko.com/coins/images/${id === "bitcoin" ? "1" : id === "ethereum" ? "279" : "1"}/large/${id}.png`,
  current_price: id === "bitcoin" ? 43250.67 : id === "ethereum" ? 2650.43 : 1.25,
  market_cap: id === "bitcoin" ? 847000000000 : id === "ethereum" ? 318000000000 : 125000000,
  market_cap_rank: id === "bitcoin" ? 1 : id === "ethereum" ? 2 : 50,
  fully_diluted_valuation: null,
  total_volume: id === "bitcoin" ? 28500000000 : id === "ethereum" ? 15200000000 : 5000000,
  high_24h: id === "bitcoin" ? 44100.25 : id === "ethereum" ? 2720.15 : 1.35,
  low_24h: id === "bitcoin" ? 42800.5 : id === "ethereum" ? 2580.3 : 1.18,
  price_change_24h: id === "bitcoin" ? 850.25 : id === "ethereum" ? -45.67 : 0.08,
  price_change_percentage_24h: id === "bitcoin" ? 2.01 : id === "ethereum" ? -1.69 : 6.84,
  price_change_percentage_7d_in_currency: id === "bitcoin" ? 5.23 : id === "ethereum" ? -2.15 : 12.45,
  price_change_percentage_1h_in_currency: id === "bitcoin" ? 0.45 : id === "ethereum" ? -0.23 : 1.25,
  market_cap_change_24h: 16500000000,
  market_cap_change_percentage_24h: 1.98,
  circulating_supply: id === "bitcoin" ? 19580000 : id === "ethereum" ? 120000000 : 100000000,
  total_supply: id === "bitcoin" ? 21000000 : id === "ethereum" ? null : 100000000,
  max_supply: id === "bitcoin" ? 21000000 : id === "ethereum" ? null : 100000000,
  ath: id === "bitcoin" ? 69045 : id === "ethereum" ? 4878.26 : 2.45,
  ath_change_percentage: id === "bitcoin" ? -37.35 : id === "ethereum" ? -45.67 : -48.98,
  ath_date: "2021-11-10T14:24:11.849Z",
  atl: id === "bitcoin" ? 67.81 : id === "ethereum" ? 0.432979 : 0.001,
  atl_change_percentage: id === "bitcoin" ? 63650.45 : id === "ethereum" ? 612045.67 : 124900.0,
  atl_date: "2013-07-06T00:00:00.000Z",
  roi: null,
  last_updated: new Date().toISOString(),
  sparkline_in_7d: {
    price: Array.from({ length: 168 }, (_, i) => {
      const basePrice = id === "bitcoin" ? 43000 : id === "ethereum" ? 2600 : 1.2
      return basePrice + Math.sin(i / 10) * (basePrice * 0.05) + (Math.random() - 0.5) * (basePrice * 0.02)
    }),
  },
})

export default function CryptoDetailPage() {
  const params = useParams()
  const [crypto, setCrypto] = useState<CryptoCurrency | null>(null)
  const [timeframe, setTimeframe] = useState("1D")

  useEffect(() => {
    if (params.id) {
      // In a real app, you would fetch from your API
      setCrypto(getMockCryptoData(params.id as string))
    }
  }, [params.id])

  if (!crypto) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading crypto data...</p>
        </div>
      </div>
    )
  }

  const isPositive = crypto.price_change_percentage_24h >= 0
  const timeframes = ["1H", "4H", "1D", "1W", "1M", "3M", "1Y", "ALL"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6 dark:border-gray-700 dark:bg-zinc-900 border-gray-400" />
              <div className="flex items-center space-x-3">
                <Image
                  src={crypto.image || "/placeholder.svg"}
                  alt={crypto.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-xl font-bold">{crypto.name}</h1>
                  <p className="text-sm text-muted-foreground uppercase">{crypto.symbol}</p>
                </div>
                <Badge variant="secondary">#{crypto.market_cap_rank}</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(crypto.current_price)}</div>
                <div className={`flex items-center text-sm ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {formatPercentage(crypto.price_change_percentage_24h)} (24h)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-lg font-semibold">Price Chart</h2>
                      <div className="flex items-center space-x-1">
                        {timeframes.map((tf) => (
                          <Button
                            key={tf}
                            variant={timeframe === tf ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setTimeframe(tf)}
                            className="h-8 px-3"
                          >
                            {tf}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <div className="h-[520px] p-4">
                  <AdvancedChart data={crypto.sparkline_in_7d.price} isPositive={isPositive} timeframe={timeframe} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Price Stats */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h High</span>
                    <span className="font-mono">{formatCurrency(crypto.high_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h Low</span>
                    <span className="font-mono">{formatCurrency(crypto.low_24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">All-Time High</span>
                    <span className="font-mono">{formatCurrency(crypto.ath)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">1h Change</span>
                    <span
                      className={`font-mono ${crypto.price_change_percentage_1h_in_currency >= 0 ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">7d Change</span>
                    <span
                      className={`font-mono ${crypto.price_change_percentage_7d_in_currency >= 0 ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Stats */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Market Data
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="font-mono">{formatCurrency(crypto.market_cap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volume (24h)</span>
                    <span className="font-mono">{formatCurrency(crypto.total_volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Circulating Supply</span>
                    <span className="font-mono">{formatNumber(crypto.circulating_supply)}</span>
                  </div>
                  {crypto.max_supply && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Supply</span>
                      <span className="font-mono">{formatNumber(crypto.max_supply)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Volume Indicator */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Trading Activity
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Volume/Market Cap</span>
                    <span>{((crypto.total_volume / crypto.market_cap) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${Math.min((crypto.total_volume / crypto.market_cap) * 100 * 10, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Higher volume indicates more trading activity</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
