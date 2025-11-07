"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// 🎨 Configuration des couleurs pour le graphique
const chartConfig = {
  price: {
    label: "Price",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  selectedName: string | null
}

export function ChartAreaInteractive({ selectedName }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  // Ajuster la période par défaut sur mobile
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // 🧠 Simule un appel API pour récupérer les données historiques
  React.useEffect(() => {
    if (!selectedName) return

    const fetchFakeData = async () => {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800)) // Simule un délai réseau

      // 🎯 Crée 90 jours de données factices
      let basePrice = 100 + Math.random() * 100
      const fakeData = Array.from({ length: 90 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (90 - i))
        basePrice += (Math.random() - 0.5) * 5 // légère variation
        return {
          date: date.toISOString().split("T")[0],
          price: +basePrice.toFixed(2),
        }
      })

      setChartData(fakeData)
      setLoading(false)
    }

    fetchFakeData()
  }, [selectedName])


  // React.useEffect(() => {
  //   if (!selectedName) return

  //   const fetchData = async () => {
  //     try {
  //       setLoading(true)

  //       const res = await fetch(`/history/${selectedName}`)
  //       if (!res.ok) throw new Error("Failed to fetch history")
  //       const data = await res.json()

  //       // Assurez-vous que la date est en format timestamp pour Recharts
  //       const formattedData = data.map((item: any) => ({
  //         ...item,
  //         date: new Date(item.date).getTime(),
  //       }))

  //       setChartData(formattedData)
  //     } catch (err) {
  //       console.error(err)
  //       setChartData([])
  //     } finally {
  //       setLoading(false)
  //     } // React.useEffect(() => {
  //   if (!selectedName) return

  //   const fetchData = async () => {
  //     try {
  //       setLoading(true)

  //       const res = await fetch(`/history/${selectedName}`)
  //       if (!res.ok) throw new Error("Failed to fetch history")
  //       const data = await res.json()

  //       // Assurez-vous que la date est en format timestamp pour Recharts
  //       const formattedData = data.map((item: any) => ({
  //         ...item,
  //         date: new Date(item.date).getTime(),
  //       }))

  //       setChartData(formattedData)
  //     } catch (err) {
  //       console.error(err)
  //       setChartData([])
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [selectedName])
  //   }

  //   fetchData()
  // }, [selectedName])

  // 🧮 Filtrer selon la période choisie
  const filteredData = React.useMemo(() => {
    if (!chartData.length) return []
    let days = 90
    if (timeRange === "30d") days = 30
    if (timeRange === "7d") days = 7
    return chartData.slice(-days)
  }, [chartData, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          {selectedName ? `${selectedName} Price History` : "No selection"}
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {selectedName
              ? "Data for the last 3 months"
              : "Select a cryptocurrency to view history"}
          </span>
          <span className="@[540px]/card:hidden">
            {selectedName ? "Last 3 months" : ""}
          </span>
        </CardDescription>
        {selectedName && (
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d">Last 3 months</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Loading fake data for {selectedName}...
          </div>
        ) : selectedName ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="price"
                type="natural"
                fill="url(#fillPrice)"
                stroke="var(--color-price)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Select a cryptocurrency from the table to see its chart
          </div>
        )}
      </CardContent>
    </Card>
  )
}
