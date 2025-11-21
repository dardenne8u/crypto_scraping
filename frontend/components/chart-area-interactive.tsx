"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

  React.useEffect(() => {
    try {
      fetch(`http://localhost:9000/history/${selectedName}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Données historiques récupérées:", data);
          const formattedData = data.map((item: any) => ({
            date: new Date(item.date * 1000).toISOString(), 
            price: item.price,
          }))
          setChartData(formattedData)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données historiques:", error);
          setLoading(false)
        });
    }
    catch (error) {
      console.error("Erreur inattendue:", error);
      setLoading(false)
    }
  }, [selectedName])


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
            Loading for {selectedName}...
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
              <YAxis 
                domain={['dataMin', 'dataMax']} 
                hide 
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  // Si vous avez un mélange de jours, utilisez une logique conditionnelle ici
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
                        hour: "numeric",
                        minute: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="price"
                type="monotone" // "monotone" peut être une autre option
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
