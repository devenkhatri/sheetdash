'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { EditRowDialog } from './EditRowDialog';
import { DeleteRowDialog } from './DeleteRowDialog';
import { sheetsClient } from '@/lib/google-sheets/client';
import { SheetConfig } from '@/lib/google-sheets/types';
import { toast } from 'sonner';
import { FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowToEdit, setRowToEdit] = useState<any | null>(null);
  const [rowToDelete, setRowToDelete] = useState<any | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<SheetConfig | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // First get the configurations
      const configs = await sheetsClient.getConfigs();
      if (configs.length === 0) {
        setLoading(false);
        return;
      }

      const activeConfig = configs[0]; // For now, use the first config
      setConfig(activeConfig);

      // Then get the rows for the active config
      const rows = await sheetsClient.getRows(activeConfig.id);
      setData(rows);
    } catch (error) {
      console.error('Failed to load data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load sheet data');
      toast.error('Failed to load sheet data');
    } finally {
      setLoading(false);
    }
  };

  const getColumns = (): ColumnDef<any>[] => {
    if (!config) return [];

    return [
      ...config.columns.map(column => ({
        accessorKey: column.id,
        header: column.header,
        cell: ({ row }: { row: Row<Record<string, unknown>> }) => {
          const value = row.getValue(column.id);
          
          switch (column.type) {
            case 'boolean':
              return (
                <div className="text-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    value ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                  }`}>
                    {value ? 'Yes' : 'No'}
                  </span>
                </div>
              );
            case 'date':
              return value && (typeof value === 'string' || typeof value === 'number') ? new Date(value).toLocaleDateString() : '';
            default:
              return value;
          }
        },
      })),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: Row<Record<string, unknown>> }) => (
          <div className="flex justify-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setRowToEdit(row.original)}
            >
              <span className="sr-only">Edit</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setRowToDelete(row.original)}
            >
              <span className="sr-only">Delete</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
        ),
      },
    ];
  };

  const handleSaveRow = async (row: any) => {
    if (!config) return;

    try {
      await sheetsClient.updateRow(config.id, row.id, row.data);
      await loadData(); // Reload the data
      setRowToEdit(null);
      toast.success('Row updated successfully');
    } catch (error) {
      console.error('Failed to update row:', error);
      toast.error('Failed to update row');
    }
  };

  const handleDeleteRow = async (row: any) => {
    if (!config) return;

    try {
      await sheetsClient.deleteRow(config.id, row.id);
      await loadData(); // Reload the data
      setRowToDelete(null);
      toast.success('Row deleted successfully');
    } catch (error) {
      console.error('Failed to delete row:', error);
      toast.error('Failed to delete row');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Data</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => loadData()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle>No Sheet Configuration Found</CardTitle>
          <CardDescription>
            You need to configure a Google Sheet before you can view and manage data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <FileSpreadsheet className="h-16 w-16 text-muted-foreground" />
          <Button onClick={() => router.push('/dashboard/config')}>
            Configure Google Sheet
          </Button>
        </CardContent>
      </Card>
    );
  }

  const columns = getColumns();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <strong>
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </strong>{" "}
          of{" "}
          <strong>{table.getFilteredRowModel().rows.length}</strong> rows
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      
      {rowToEdit && config && (
        <EditRowDialog
          row={rowToEdit}
          config={config}
          open={!!rowToEdit}
          onSave={handleSaveRow}
          onCancel={() => setRowToEdit(null)}
        />
      )}
      
      {rowToDelete && (
        <DeleteRowDialog
          row={rowToDelete}
          open={!!rowToDelete}
          onDelete={handleDeleteRow}
          onCancel={() => setRowToDelete(null)}
        />
      )}
    </div>
  );
}