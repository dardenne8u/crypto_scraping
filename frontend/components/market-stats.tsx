"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/crypto-api"
import type { CryptoCurrency } from "@/types/crypto"
import { TrendingUp, TrendingDown, Clock, Globe } from "lucide-react"

interface MarketStatsProps {
  crypto: CryptoCurrency
}

export function MarketStats({ crypto }: MarketStatsProps) {
  return (
    <div className="space-y-4">
      {/* Price Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Price Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Price</span>
              <span className="font-mono font-medium">{formatCurrency(crypto.current_price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h High</span>
              <span className="font-mono">{formatCurrency(crypto.high_24h)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h Low</span>
              <span className="font-mono">{formatCurrency(crypto.low_24h)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">All Time High</span>
              <span className="font-mono">{formatCurrency(crypto.ath)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ATH Date</span>
              <span className="text-xs">{new Date(crypto.ath_date).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Market Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Market Cap</span>
            <span className="font-mono">{formatCurrency(crypto.market_cap)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Market Cap Rank</span>
            <Badge variant="outline">#{crypto.market_cap_rank}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">24h Volume</span>
            <span className="font-mono">{formatCurrency(crypto.total_volume)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Circulating Supply</span>
            <span className="font-mono text-xs">
              {formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
            </span>
          </div>
          {crypto.max_supply && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Max Supply</span>
              <span className="font-mono text-xs">
                {formatNumber(crypto.max_supply)} {crypto.symbol.toUpperCase()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Changes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Price Changes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">1 Hour</span>
            <span
              className={`font-medium flex items-center ${
                crypto.price_change_percentage_1h_in_currency >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {crypto.price_change_percentage_1h_in_currency >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPercentage(crypto.price_change_percentage_1h_in_currency || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">24 Hours</span>
            <span
              className={`font-medium flex items-center ${
                crypto.price_change_percentage_24h >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {crypto.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPercentage(crypto.price_change_percentage_24h)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">7 Days</span>
            <span
              className={`font-medium flex items-center ${
                crypto.price_change_percentage_7d_in_currency >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {crypto.price_change_percentage_7d_in_currency >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {formatPercentage(crypto.price_change_percentage_7d_in_currency || 0)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {new Date(crypto.last_updated).toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
