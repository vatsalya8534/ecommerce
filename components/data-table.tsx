"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
  type SortingState,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Columns3Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import styles from "./data-table.module.css"

type DataTableProps<TData, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  title?: string
  description?: string
  actions?: React.ReactNode
  searchKey?: keyof TData & string
  searchPlaceholder?: string
  emptyMessage?: string
  columnVisibilityLabel?: string
  enablePagination?: boolean
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  data,
  columns,
  title,
  description,
  actions,
  searchKey,
  searchPlaceholder = "Search records...",
  emptyMessage = "No results found.",
  columnVisibilityLabel = "Columns",
  enablePagination = true,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(enablePagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
  })

  const searchColumn = searchKey ? table.getColumn(searchKey) : null
  const toggleableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide())
  const visibleToggleableColumns = toggleableColumns.filter((column) => column.getIsVisible())

  return (
    <section className="w-full max-w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-white px-6 py-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {title ? <h2 className="text-[1.35rem] font-semibold tracking-tight text-slate-950">{title}</h2> : null}
          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {searchColumn ? (
            <label className="relative block">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={(searchColumn.getFilterValue() as string) ?? ""}
                onChange={(event) => searchColumn.setFilterValue(event.target.value)}
                placeholder={searchPlaceholder}
                className="min-w-[240px] rounded-full border-slate-200 bg-white pl-9 shadow-sm"
              />
            </label>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50">
                <Columns3Icon className="size-4" />
                {columnVisibilityLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>{columnVisibilityLabel}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toggleableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  disabled={column.getIsVisible() && visibleToggleableColumns.length === 1}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                >
                  {formatColumnLabel(column.id, column.columnDef.header)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {actions}
        </div>
      </div>

      <div className={styles.scrollArea}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-0 bg-[#0ea5e9] text-white"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-14 border-0 px-4 text-left text-[13px] font-semibold text-white first:pl-6 last:pr-6"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        suppressHydrationWarning
                        className="flex w-full items-center gap-1.5 text-left text-white transition hover:text-white/90"
                      >
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <span className="inline-flex flex-col leading-none text-[10px] text-white/70">
                          <ChevronUpIcon
                            className={`size-3 transition ${header.column.getIsSorted() === "asc" ? "text-white" : "opacity-40"}`}
                          />
                          <ChevronDownIcon
                            className={`-mt-0.5 size-3 transition ${header.column.getIsSorted() === "desc" ? "text-white" : "opacity-40"}`}
                          />
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onRowClick(row.original);
                          }
                        }
                      : undefined
                  }
                  className={`border-b border-slate-100/80 transition hover:bg-sky-50/50 ${
                    row.index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                  } ${onRowClick ? "cursor-pointer focus:outline-none focus-visible:bg-sky-50/70" : ""}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-middle px-4 py-4 first:pl-6 last:pr-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Math.max(1, table.getVisibleLeafColumns().length)}
                  className="h-24 text-center text-slate-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination ? (
        <div className="flex flex-col gap-3 border-t border-white/35 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {table.getRowModel().rows.length} of {data.length} record(s)
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeftIcon />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon />
            </Button>
            <span className="min-w-24 text-center font-medium text-slate-700">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(Math.max(table.getPageCount() - 1, 0))}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function formatColumnLabel(id: string, header: unknown) {
  if (typeof header === "string") {
    return header
  }

  return id
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase())
}
