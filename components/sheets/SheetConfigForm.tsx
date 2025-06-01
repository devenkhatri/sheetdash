'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { sheetsClient } from '@/lib/google-sheets/client';
import { SheetConfig, GoogleSheetsAuth } from '@/lib/google-sheets/types';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Sheet name is required' }),
  sheetId: z.string().min(1, { message: 'Sheet ID is required' }),
  tabName: z.string().min(1, { message: 'Tab name is required' }),
  credentials: z.string().min(10, { message: 'Valid JSON credentials are required' }),
});

type FormData = z.infer<typeof formSchema>;

interface SheetConfigFormProps {
  onConfigSaved?: (config: SheetConfig) => void;
}

export function SheetConfigForm({ onConfigSaved }: SheetConfigFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sheetId: '',
      tabName: 'Sheet1',
      credentials: '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let credentials: GoogleSheetsAuth;
      try {
        credentials = JSON.parse(data.credentials);
        
        // Validate required credential fields
        const requiredFields = [
          'type',
          'project_id',
          'private_key_id',
          'private_key',
          'client_email',
        ];
        
        for (const field of requiredFields) {
          if (!credentials[field as keyof GoogleSheetsAuth]) {
            throw new Error(`Missing required credential field: ${field}`);
          }
        }
      } catch (error) {
        throw new Error(
          error instanceof Error 
            ? `Invalid credentials format: ${error.message}`
            : 'Invalid JSON credentials format'
        );
      }
      
      // First set the authentication
      await sheetsClient.setAuth(credentials);
      
      // Then add the configuration
      const config = await sheetsClient.addConfig({
        name: data.name,
        sheetId: data.sheetId,
        tabName: data.tabName,
      });
      
      toast.success('Sheet configuration saved successfully');
      form.reset();
      
      if (onConfigSaved) {
        onConfigSaved(config);
      }
      
      // Redirect to the data page
      router.push('/dashboard/data');
    } catch (error) {
      let message = 'Failed to save sheet configuration';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
      console.error('Configuration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sheet Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Employee Data" />
              </FormControl>
              <FormDescription>
                A friendly name to identify this sheet configuration
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sheetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Sheet ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" />
              </FormControl>
              <FormDescription>
                The ID from your Google Sheet URL: https://docs.google.com/spreadsheets/d/[Sheet ID]/edit
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tabName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sheet Tab Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Sheet1" />
              </FormControl>
              <FormDescription>
                The name of the tab in your Google Sheet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="credentials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Service Account Credentials</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...",...}'
                  className="font-mono text-xs"
                  rows={6}
                />
              </FormControl>
              <FormDescription>
                Paste your service account credentials JSON here
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </form>
    </Form>
  );
}