import { Metadata } from 'next';
import { AddRowForm } from '@/components/sheets/AddRowForm';

export const metadata: Metadata = {
  title: 'Add Row | SheetDash',
  description: 'Add a new row to your Google Sheet',
};

export default function AddRowPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Row</h1>
        <p className="text-muted-foreground">
          Add a new row to your Google Sheet
        </p>
      </div>
      
      <div className="rounded-lg border p-6">
        <AddRowForm />
      </div>
    </div>
  );
}