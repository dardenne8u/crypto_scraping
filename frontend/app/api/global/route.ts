import { NextResponse } from "next/server"

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3"

let globalDataCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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

const MOCK_GLOBAL_DATA = {
  active_cryptocurrencies: 10567,
  upcoming_icos: 0,
  ongoing_icos: 49,
  ended_icos: 3376,
  markets: 789,
  total_market_cap: {
    btc: 50234567.89,
    eth: 678901234.56,
    ltc: 12345678901.23,
    bch: 4567890123.45,
    bnb: 3456789012.34,
    eos: 234567890123.45,
    xrp: 2345678901234.56,
    xlm: 9876543210987.65,
    link: 87654321098.76,
    dot: 123456789012.34,
    yfi: 1234567.89,
    usd: 1678901234567.89,
    aed: 6167890123456.78,
    ars: 1456789012345678.9,
    aud: 2456789012345.67,
    bdt: 178901234567890.12,
    bhd: 632456789012.34,
    bmd: 1678901234567.89,
    brl: 8345678901234.56,
    cad: 2234567890123.45,
    chf: 1534567890123.45,
    clp: 1345678901234567.89,
    cny: 11890123456789.01,
    czk: 38901234567890.12,
    dkk: 11234567890123.45,
    eur: 1534567890123.45,
    gbp: 1323456789012.34,
    hkd: 13123456789012.34,
    huf: 58901234567890.12,
    idr: 25678901234567890.12,
    ils: 6123456789012.34,
    inr: 139012345678901.23,
    jpy: 234567890123456.78,
    krw: 2123456789012345.67,
    kwd: 512345678901.23,
    lkr: 534567890123456.78,
    mmk: 3523456789012345.67,
    mxn: 28901234567890.12,
    myr: 7890123456789.01,
    ngn: 1345678901234567.89,
    nok: 17890123456789.01,
    nzd: 2678901234567.89,
    php: 93456789012345.67,
    pkr: 467890123456789.01,
    pln: 6789012345678.9,
    rub: 156789012345678.9,
    sar: 6290123456789.01,
    sek: 17345678901234.56,
    sgd: 2267890123456.78,
    thb: 59012345678901.23,
    try: 45678901234567.89,
    twd: 52345678901234.56,
    uah: 61890123456789.01,
    vef: 16789012345678901.23,
    vnd: 41234567890123456.78,
    zar: 31456789012345.67,
    xdr: 1234567890123.45,
    xag: 67890123456.78,
    xau: 890123456.78,
    bits: 50234567890123456.78,
    sats: 5023456789012345678.9,
  },
  total_volume: {
    btc: 1234567.89,
    eth: 16789012.34,
    ltc: 301234567.89,
    bch: 112345678.9,
    bnb: 84567890.12,
    eos: 5678901234.56,
    xrp: 57890123456.78,
    xlm: 243456789012.34,
    link: 2145678901.23,
    dot: 3012345678.9,
    yfi: 30123.45,
    usd: 41234567890.12,
    aed: 151456789012.34,
    ars: 35789012345678.9,
    aud: 60234567890.12,
    bdt: 4390123456789.01,
    bhd: 15534567890.12,
    bmd: 41234567890.12,
    brl: 204890123456.78,
    cad: 54789012345.67,
    chf: 37678901234.56,
    clp: 33012345678901.23,
    cny: 291890123456.78,
    czk: 954567890123.45,
    dkk: 275678901234.56,
    eur: 37678901234.56,
    gbp: 32456789012.34,
    hkd: 322345678901.23,
    huf: 14456789012345.67,
    idr: 630123456789012.34,
    ils: 150234567890.12,
    inr: 3412345678901.23,
    jpy: 5756789012345.67,
    krw: 52123456789012.34,
    kwd: 12567890123.45,
    lkr: 13123456789012.34,
    mmk: 86456789012345.67,
    mxn: 709012345678.9,
    myr: 193456789012.34,
    ngn: 33012345678901.23,
    nok: 439012345678.9,
    nzd: 65678901234.56,
    php: 2290123456789.01,
    pkr: 11456789012345.67,
    pln: 166789012345.67,
    rub: 3845678901234.56,
    sar: 154567890123.45,
    sek: 425678901234.56,
    sgd: 55678901234.56,
    thb: 1448901234567.89,
    try: 1121234567890.12,
    twd: 1284567890123.45,
    uah: 1519012345678.9,
    vef: 412345678901234.56,
    vnd: 1012345678901234.56,
    zar: 771234567890.12,
    xdr: 30345678901.23,
    xag: 1667890123.45,
    xau: 21890123.45,
    bits: 1234567890123456.78,
    sats: 123456789012345678.9,
  },
  market_cap_percentage: {
    btc: 51.23,
    eth: 18.45,
    usdt: 5.67,
    bnb: 3.21,
    sol: 2.89,
    usdc: 2.34,
    xrp: 1.98,
    steth: 1.45,
    ada: 1.23,
    avax: 0.98,
  },
  market_cap_change_percentage_24h_usd: 2.34,
  updated_at: Math.floor(Date.now() / 1000),
}

export async function GET() {
  try {
    const now = Date.now()
    if (globalDataCache && now - globalDataCache.timestamp < CACHE_DURATION) {
      return NextResponse.json(globalDataCache.data)
    }

    const response = await fetchWithRetry(`${COINGECKO_API_BASE}/global`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    globalDataCache = {
      data: data.data,
      timestamp: now,
    }

    return NextResponse.json(data.data)
  } catch (error) {
    console.log("API unavailable, using fallback data")

    if (globalDataCache) {
      console.log("Returning cached global data due to API error")
      return NextResponse.json(globalDataCache.data)
    }

    console.log("Returning mock global data due to API failure")
    return NextResponse.json(MOCK_GLOBAL_DATA)
  }
}
