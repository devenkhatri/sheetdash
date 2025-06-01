import { Metadata } from 'next';
import { DataTable } from '@/components/sheets/DataTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data | SheetDash',
  description: 'View and manage your sheet data',
};

export default function DataPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sheet Data</h1>
          <p className="text-muted-foreground">
            View and manage your Google Sheets data
          </p>
        </div>
        <Link href="/dashboard/data/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Row
          </Button>
        </Link>
      </div>
      
      <DataTable />
    </div>
  );
}