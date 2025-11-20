"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { IconGripVertical } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"
import { CryptoData } from '@/types/crypto'

// ============================================================================
// 🔹 Schema
// ============================================================================
export const schema = z.object({
  name: z.string(),
  price: z.number(),
  hourly_variance: z.number(),
  daily_variance: z.number(),
  weekly_variance: z.number(),
  date: z.number(),
})

// ============================================================================
// 🔹 Columns
// ============================================================================
const columns: ColumnDef<CryptoData>[] = [
  {
    accessorKey: "name",
    header: "Token",
    cell: ({ row }) => <div className="pl-2">{row.original.name}</div>,
  },
  {
    accessorKey: "price",
    header: "Price (USD)",
    cell: ({ row }) => (
      <div className="text-left">${row.original.price.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "hourly_variance",
    header: "1h %",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.hourly_variance >= 0 ? "text-green-600" : "text-red-600"
        }
      >
        {row.original.hourly_variance}%
      </Badge>
    ),
  },
  {
    accessorKey: "daily_variance",
    header: "24h %",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.daily_variance >= 0 ? "text-green-600" : "text-red-600"
        }
      >
        {row.original.daily_variance}%
      </Badge>
    ),
  },
  {
    accessorKey: "weekly_variance",
    header: "7d %",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={
          row.original.weekly_variance >= 0 ? "text-green-600" : "text-red-600"
        }
      >
        {row.original.weekly_variance}%
      </Badge>
    ),
  },
]

// ============================================================================
// 🔹 Draggable Row
// ============================================================================
function DraggableRow({
  row,
  onSelectName,
}: {
  row: Row<CryptoData>
  onSelectName?: (name: string) => void
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.name,
  })
  const [isClicked, setIsClicked] = React.useState(false)

  function handleClick() {
    setIsClicked(true)
    onSelectName?.(row.original.name)
    setTimeout(() => setIsClicked(false), 150)
  }

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      onClick={handleClick}
      className={`
        relative z-0 cursor-pointer transition-all
        data-[dragging=true]:z-10 data-[dragging=true]:opacity-80
        hover:bg-muted/60 active:scale-[0.99]
        ${isClicked ? "bg-muted/80" : ""}
      `}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// ============================================================================
// 🔹 DataTable Component
// ============================================================================
export function DataTable({ data: initialData,  onSelectName}: { data: CryptoData[] ,  onSelectName?: (name: string) => void }) {
  const data = Array.isArray(initialData) ? initialData : [];


  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const sortableId = React.useId()

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ name }) => name) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            id={sortableId}
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow
                        key={row.id}
                        row={row}
                        onSelectName={onSelectName} // ✅ Passé ici
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </TabsContent>
    </Tabs>
  )
}
