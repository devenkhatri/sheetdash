'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

interface DeleteRowDialogProps {
  row: any;
  open: boolean;
  onDelete: (row: any) => void;
  onCancel: () => void;
}

export function DeleteRowDialog({ row, open, onDelete, onCancel }: DeleteRowDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Here we would typically call the API to delete the row from Google Sheets
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the parent's onDelete with the row
      onDelete(row);
      
      toast.success('Row deleted successfully');
    } catch (error) {
      toast.error('Failed to delete row');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the data
            for <strong>{row.name}</strong> from your Google Sheet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}