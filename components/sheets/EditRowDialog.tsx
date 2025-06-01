'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { SheetConfig } from '@/lib/google-sheets/types';

interface EditRowDialogProps {
  row: any;
  config: SheetConfig;
  open: boolean;
  onSave: (row: any) => void;
  onCancel: () => void;
}

export function EditRowDialog({ row, config, open, onSave, onCancel }: EditRowDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamically create the form schema based on the column configuration
  const formSchema = z.object(
    config.columns.reduce((acc, column) => {
      let validator: z.ZodType<any, any, any>;
      
      // Initialize validator with a default value
      validator = z.any();

      if (column.type === 'text') {
        validator = z.string();
        if (column.required) {
          validator = z.string().min(1, { message: `${column.header} is required.` });
        }
      } else if (column.type === 'number') {
        validator = z.coerce.number();
        if (column.required) {
          validator = z.coerce.number().min(1, { message: `${column.header} is required.` });
        }
      } else if (column.type === 'boolean') { // Assuming boolean type doesn't have min requirement
        validator = z.boolean();
      }
      return { ...acc, [column.id]: validator };
    }, {})
  );
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: row.data,
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSave({ id: row.id, data });
      toast.success('Row updated successfully');
    } catch (error) {
      toast.error('Failed to update row');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Row</DialogTitle>
          <DialogDescription>
            Make changes to the row data. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4">
              {config.columns.map((column) => (
                <FormField
                  key={column.id}
                  control={form.control}
                  name={column.id as keyof FormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{column.header}</FormLabel>
                      <FormControl>
                        {column.type === 'boolean' ? (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        ) : column.type === 'date' ? (
                          <Input
                            {...field}
                            type="date"
                            value={(field.value as string)?.split('T')[0] || ''}
                          />
                        ) : column.type === 'number' ? (
                          <Input {...field} type="number" />
                        ) : (
                          <Input {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}