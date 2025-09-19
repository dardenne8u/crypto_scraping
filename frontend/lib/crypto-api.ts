import type { CryptoData, CryptoCurrency, MarketData } from "@/types/crypto"
import data from "@/app/data.json"
const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"


export async function fetchCryptoData(): Promise<CryptoData[]> {
  try {
    const response = await fetch("/api/crypto-data")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return []
  }
}




export async function fetchCryptocurrencies(page = 1, perPage = 100): Promise<CryptoCurrency[]> {
  try {
    const response = await fetch(`/api/crypto?page=${page}&per_page=${perPage}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error)
    return []
  }
}

export async function fetchGlobalMarketData(): Promise<MarketData | null> {
  try {
    const response = await fetch("/api/global")

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching global market data:", error)
    return null
  }
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || isNaN(value)) {
    return "$0.00"
  }

  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  } else {
    return `$${value.toFixed(2)}`
  }
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null || isNaN(value)) {
    return "0"
  }

  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`
  } else {
    return value.toLocaleString()
  }
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null || isNaN(value)) {
    return "0.00%"
  }
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}
