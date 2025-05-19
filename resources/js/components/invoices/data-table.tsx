'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    Header,
    RowSelectionState,
    useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceColumn } from './columns';

/**
 * Props for the DataTable component.
 */
interface DataTableProps {
    columns: ColumnDef<InvoiceColumn>[];
    data: InvoiceColumn[];
    onSort: (field: string) => void;
    sort_field: string;
    sort_direction: string;
    selectedInvoices: Invoice[];
    onSelectedInvoicesChange: (selected: Invoice[]) => void;
}

/**
 * Renders a sortable table header cell with sort direction indicator.
 */
function SortableHeaderCell({
    header,
    isSorted,
    sortDirection,
    onSort,
    canSort,
}: {
    header: Header<InvoiceColumn, unknown>;
    isSorted: boolean;
    sortDirection: string;
    onSort: () => void;
    canSort: boolean;
}) {
    return (
        <TableHead
            key={header.id}
            className={canSort ? 'cursor-pointer select-none' : ''}
            onClick={canSort ? onSort : undefined}
            onKeyDown={
                canSort
                    ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onSort();
                          }
                      }
                    : undefined
            }
            tabIndex={canSort ? 0 : -1}
            role={canSort ? 'button' : undefined}
            aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
            <div className="flex items-center gap-1">
                {flexRender(header.column.columnDef.header, header.getContext())}
                {canSort && (
                    <span className="ml-1 flex items-center">
                        <ArrowUpDown className={isSorted ? 'text-primary h-4 w-4' : 'text-muted-foreground/50 h-4 w-4'} aria-hidden="true" />
                        {isSorted && (
                            <span className="ml-0.5 text-xs" aria-hidden="true">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                        )}
                    </span>
                )}
            </div>
        </TableHead>
    );
}

/**
 * DataTable component for displaying tabular data with sorting and selection.
 */
export const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    onSort,
    sort_field,
    sort_direction,
    selectedInvoices,
    onSelectedInvoicesChange,
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    // Map selectedInvoices to rowSelection object
    const rowSelection = useMemo<RowSelectionState>(() => {
        const map: RowSelectionState = {};
        selectedInvoices.forEach((inv) => {
            // TanStack Table uses row index as id by default, but you can use a custom getRowId
            map[inv.id] = true;
        });
        return map;
    }, [selectedInvoices]);

    // Find Invoice by rowId
    const getInvoiceById = (id: string | number) => data.find((inv) => String(inv.id) === String(id));

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: (updater) => {
            // updater can be a function or a value
            const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
            // Convert rowSelection object to Invoice[]
            const selected = Object.keys(newSelection)
                .map((id) => getInvoiceById(id))
                .filter(Boolean) as Invoice[];
            onSelectedInvoicesChange(selected);
        },
        getRowId: (row) => String(row.id),
    });

    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border">
            <Table aria-label="Invoices table">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <SortableHeaderCell
                                    key={header.id}
                                    header={header}
                                    isSorted={sort_field === header.column.id}
                                    sortDirection={sort_direction}
                                    onSort={() => onSort(header.column.id)}
                                    canSort={header.column.getCanSort()}
                                />
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
