'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { sheetsClient } from '@/lib/google-sheets/client';
import { SheetConfig } from '@/lib/google-sheets/types';

export function AddRowForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<SheetConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configs = await sheetsClient.getConfigs();
      if (configs.length > 0) {
        setConfig(configs[0]); // For now, use the first config
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      toast.error('Failed to load sheet configuration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!config) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No sheet configuration found. Please configure a sheet first.</p>
        <Button className="mt-4" onClick={() => router.push('/dashboard/config')}>
          Configure Sheet
        </Button>
      </div>
    );
  }

  // Dynamically create the form schema based on the column configuration
  const getValidator = (column: SheetConfig['columns'][number]) => {
    let validator;
    if (column.type === 'text') {
      validator = z.string();
      if (column.required) {
        validator = validator.min(1, { message: `${column.header} is required.` });
      }
    } else if (column.type === 'number') {
      validator = z.coerce.number();
      if (column.required) {
        validator = validator.min(1, { message: `${column.header} is required.` });
      }
    } else if (column.type === 'boolean') {
      validator = z.boolean();
    } else {
      validator = z.any();
    }
    return validator;
  };

  const formSchema = z.object(
    config.columns.reduce((acc, column) => {
      return { ...acc, [column.id]: getValidator(column) };
    }, {})
  );

  type FormData = z.infer<typeof formSchema>;

  // Set default values for the form
  const defaultValues = config.columns.reduce((acc, column) => {
    let defaultValue;
    switch (column.type) {
      case 'boolean':
        defaultValue = false;
        break;
      case 'date':
        defaultValue = new Date().toISOString().split('T')[0];
        break;
      case 'number':
        defaultValue = 0;
        break;
      default:
        defaultValue = '';
    }
    return { ...acc, [column.id]: defaultValue };
  }, {});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await sheetsClient.addRow(config.id, data);
      toast.success('Row added successfully');
      form.reset(defaultValues);
      router.push('/dashboard/data');
    } catch (error) {
      toast.error('Failed to add row');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {config.columns.map((column) => (
            <FormField
              key={column.id}
              control={form.control}
              name={column.id as keyof z.infer<typeof formSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{column.header}</FormLabel>
                  <FormControl>
                    {column.type === 'boolean' ? (
                      <div className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>{column.header}</FormLabel>
                          <FormDescription>
                            Toggle {column.header.toLowerCase()}
                          </FormDescription>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    ) : column.type === 'date' ? (
                      <Input {...field} type="date" />
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

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/data')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Row'}
          </Button>
        </div>
      </form>
    </Form>
  );
}