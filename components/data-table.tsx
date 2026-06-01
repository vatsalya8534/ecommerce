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
  type SortingState,
} from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DataTableProps<TData, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  title?: string
  description?: string
  actions?: React.ReactNode
  searchKey?: keyof TData & string
  searchPlaceholder?: string
  emptyMessage?: string
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
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const searchColumn = searchKey ? table.getColumn(searchKey) : null

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/45 bg-white/55 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
      <div className="flex flex-col gap-4 border-b border-white/40 px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {title ? <h2 className="text-xl font-semibold text-slate-950">{title}</h2> : null}
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {searchColumn ? (
            <label className="relative block">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={(searchColumn.getFilterValue() as string) ?? ""}
                onChange={(event) => searchColumn.setFilterValue(event.target.value)}
                placeholder={searchPlaceholder}
                className="min-w-[220px] rounded-full border-white/60 bg-white/75 pl-9"
              />
            </label>
          ) : null}
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-white/35">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-12 text-slate-500">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-white/25">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
    </section>
  )
}
