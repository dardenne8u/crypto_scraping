"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CryptoCurrency } from "@/types/crypto"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/crypto-api"
import { PriceChart } from "./price-chart"
import { ChevronUp, ChevronDown, Search } from "lucide-react"

interface CryptoTableProps {
  cryptocurrencies: CryptoCurrency[]
}

type SortField = "market_cap_rank" | "current_price" | "price_change_percentage_24h" | "market_cap" | "total_volume"
type SortDirection = "asc" | "desc"

export function CryptoTable({ cryptocurrencies }: CryptoTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("market_cap_rank")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const filteredAndSortedData = useMemo(() => {
    const filtered = cryptocurrencies.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (aValue === null || aValue === undefined) aValue = 0
      if (bValue === null || bValue === undefined) bValue = 0

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [cryptocurrencies, searchTerm, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-4 ">
      <div className="flex items-center space-x-2 ">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 " />
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border bg-card dark:border-gray-700 dark:bg-zinc-900 border-gray-400">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 ">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("current_price")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Price
                  <SortIcon field="current_price" />
                </Button>
              </TableHead>
              <TableHead>1h %</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("price_change_percentage_24h")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  24h %
                  <SortIcon field="price_change_percentage_24h" />
                </Button>
              </TableHead>
              <TableHead>7d %</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("market_cap")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Market Cap
                  <SortIcon field="market_cap" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("total_volume")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Volume(24h)
                  <SortIcon field="total_volume" />
                </Button>
              </TableHead>
              <TableHead>Circulating Supply</TableHead>
              <TableHead>Last 7 Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((crypto) => (
              <TableRow key={crypto.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-muted-foreground">{crypto.market_cap_rank}</TableCell>
                <TableCell>
                  <Link href={`/crypto/${crypto.id}`} className="block">
                    <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                      <Image
                        src={crypto.image || "/placeholder.svg"}
                        alt={crypto.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground uppercase">{crypto.symbol}</div>
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="font-mono">{formatCurrency(crypto.current_price)}</TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      crypto.price_change_percentage_1h_in_currency >= 0
                        ? "text-emerald-500 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {formatPercentage(crypto.price_change_percentage_1h_in_currency || 0)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      crypto.price_change_percentage_24h >= 0
                        ? "text-emerald-500 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${
                      crypto.price_change_percentage_7d_in_currency >= 0
                        ? "text-emerald-500 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {formatPercentage(crypto.price_change_percentage_7d_in_currency || 0)}
                  </span>
                </TableCell>
                <TableCell className="font-mono">{formatCurrency(crypto.market_cap)}</TableCell>
                <TableCell className="font-mono">{formatCurrency(crypto.total_volume)}</TableCell>
                <TableCell className="font-mono">
                  <div>
                    {formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
                  </div>
                  {crypto.max_supply && (
                    <div className="text-xs text-muted-foreground">Max: {formatNumber(crypto.max_supply)}</div>
                  )}
                </TableCell>
                <TableCell>
                  <PriceChart
                    data={crypto.sparkline_in_7d.price}
                    isPositive={crypto.price_change_percentage_7d_in_currency >= 0}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
