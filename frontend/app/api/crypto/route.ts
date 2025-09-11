import { NextResponse } from "next/server"

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

let cryptoDataCache: { data: any; timestamp: number; key: string } | null = null
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes for crypto data

const MOCK_CRYPTO_DATA = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 43250.67,
    market_cap: 847234567890,
    market_cap_rank: 1,
    fully_diluted_valuation: 908765432109,
    total_volume: 23456789012,
    high_24h: 44100.23,
    low_24h: 42800.45,
    price_change_24h: 1234.56,
    price_change_percentage_24h: 2.94,
    market_cap_change_24h: 12345678901,
    market_cap_change_percentage_24h: 1.48,
    circulating_supply: 19587234.567,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69045.22,
    ath_change_percentage: -37.42,
    ath_date: "2021-11-10T14:24:11.849Z",
    atl: 67.81,
    atl_change_percentage: 63654.89,
    atl_date: "2013-07-06T00:00:00.000Z",
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: [42000, 42500, 43000, 42800, 43200, 43500, 43250],
    },
    price_change_percentage_1h_in_currency: 0.45,
    price_change_percentage_24h_in_currency: 2.94,
    price_change_percentage_7d_in_currency: 5.67,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 2567.89,
    market_cap: 308765432109,
    market_cap_rank: 2,
    fully_diluted_valuation: 308765432109,
    total_volume: 15678901234,
    high_24h: 2634.12,
    low_24h: 2498.76,
    price_change_24h: 89.45,
    price_change_percentage_24h: 3.61,
    market_cap_change_24h: 10765432109,
    market_cap_change_percentage_24h: 3.61,
    circulating_supply: 120234567.89,
    total_supply: 120234567.89,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -47.36,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 592876.45,
    atl_date: "2015-10-20T00:00:00.000Z",
    roi: {
      times: 89.23,
      currency: "btc",
      percentage: 8923.45,
    },
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: [2400, 2450, 2500, 2480, 2520, 2580, 2567],
    },
    price_change_percentage_1h_in_currency: 0.23,
    price_change_percentage_24h_in_currency: 3.61,
    price_change_percentage_7d_in_currency: 7.12,
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1.001,
    market_cap: 91234567890,
    market_cap_rank: 3,
    fully_diluted_valuation: 91234567890,
    total_volume: 45678901234,
    high_24h: 1.002,
    low_24h: 0.999,
    price_change_24h: 0.001,
    price_change_percentage_24h: 0.1,
    market_cap_change_24h: 91234567,
    market_cap_change_percentage_24h: 0.1,
    circulating_supply: 91123456789,
    total_supply: 91123456789,
    max_supply: null,
    ath: 1.32,
    ath_change_percentage: -24.12,
    ath_date: "2018-07-24T00:00:00.000Z",
    atl: 0.572521,
    atl_change_percentage: 74.89,
    atl_date: "2015-03-02T00:00:00.000Z",
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: [1.0, 1.001, 0.999, 1.0, 1.001, 1.0, 1.001],
    },
    price_change_percentage_1h_in_currency: 0.01,
    price_change_percentage_24h_in_currency: 0.1,
    price_change_percentage_7d_in_currency: 0.05,
  },
]

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      })

      if (response.status === 429) {
        // Rate limited, wait before retry
        const delay = Math.pow(2, i) * 1000 // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      return response
    } catch (error) {
      if (i === retries - 1) throw error
      // Wait before retry
      const delay = Math.pow(2, i) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw new Error("Max retries exceeded")
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") || "1"
  const perPage = searchParams.get("per_page") || "100"

  const cacheKey = `${page}-${perPage}`

  try {
    const now = Date.now()
    if (cryptoDataCache && cryptoDataCache.key === cacheKey && now - cryptoDataCache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cryptoDataCache.data)
    }

    const response = await fetchWithRetry(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    cryptoDataCache = {
      data,
      timestamp: now,
      key: cacheKey,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.log("API failed, using fallback data:", error instanceof Error ? error.message : "Unknown error")

    // Return cached data if available
    if (cryptoDataCache && cryptoDataCache.key === cacheKey) {
      console.log("Returning cached crypto data due to API error")
      return NextResponse.json(cryptoDataCache.data)
    }

    // Return mock data as last resort
    console.log("Returning mock crypto data due to API failure")
    return NextResponse.json(MOCK_CRYPTO_DATA)
  }
}
