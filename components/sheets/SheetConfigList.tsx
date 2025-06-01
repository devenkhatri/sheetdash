'use client';

import { useEffect, useState } from 'react';
import { SheetConfig } from '@/lib/google-sheets/types';
import { sheetsClient } from '@/lib/google-sheets/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { FileSpreadsheet, Trash2 } from 'lucide-react';

export function SheetConfigList() {
  const [configs, setConfigs] = useState<SheetConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [configToDelete, setConfigToDelete] = useState<SheetConfig | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const configs = await sheetsClient.getConfigs();
      setConfigs(configs);
    } catch (error) {
      toast.error('Failed to load sheet configurations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (config: SheetConfig) => {
    try {
      await sheetsClient.deleteConfig(config.id);
      setConfigs(configs.filter(c => c.id !== config.id));
      toast.success('Sheet configuration deleted successfully');
    } catch (error) {
      toast.error('Failed to delete sheet configuration');
      console.error(error);
    }
    setConfigToDelete(null);
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-2/3 bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Sheets Configured</CardTitle>
          <CardDescription>
            You haven't configured any Google Sheets yet. Add your first sheet to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <FileSpreadsheet className="h-16 w-16 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {configs.map((config) => (
          <Card key={config.id}>
            <CardHeader>
              <CardTitle>{config.name}</CardTitle>
              <CardDescription>
                Last updated {new Date(config.updatedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Sheet ID:</span>{' '}
                  <span className="font-mono text-muted-foreground">{config.sheetId}</span>
                </div>
                <div>
                  <span className="font-medium">Tab:</span>{' '}
                  <span className="text-muted-foreground">{config.tabName}</span>
                </div>
                <div>
                  <span className="font-medium">Columns:</span>{' '}
                  <span className="text-muted-foreground">{config.columns.length}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <a href={`https://docs.google.com/spreadsheets/d/${config.sheetId}`} target="_blank" rel="noopener noreferrer">
                  Open in Google Sheets
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setConfigToDelete(config)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!configToDelete} onOpenChange={(open) => !open && setConfigToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sheet Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the configuration for "{configToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => configToDelete && handleDelete(configToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}