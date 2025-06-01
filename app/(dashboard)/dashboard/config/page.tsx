import { Metadata } from 'next';
import { SheetConfigForm } from '@/components/sheets/SheetConfigForm';
import { SheetConfigList } from '@/components/sheets/SheetConfigList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Sheet Configuration | SheetDash',
  description: 'Configure your Google Sheets connections',
};

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sheet Configuration</h1>
        <p className="text-muted-foreground">
          Manage your Google Sheets connections
        </p>
      </div>
      
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Configured Sheets</TabsTrigger>
          <TabsTrigger value="add">Add New Sheet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <SheetConfigList />
        </TabsContent>
        
        <TabsContent value="add">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New Sheet</CardTitle>
                <CardDescription>
                  Connect a new Google Sheet to SheetDash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SheetConfigForm />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Setup Guide</CardTitle>
                <CardDescription>
                  Follow these steps to set up your Google Sheets integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 ml-4 list-decimal">
                  <li className="text-sm">
                    <span className="font-medium">Create a Service Account:</span> Go to the
                    <a
                      href="https://console.cloud.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    > Google Cloud Console</a> and create a service account.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Generate Credentials:</span> Create a JSON key for your service account.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Enable Google Sheets API:</span> Enable the Google Sheets API for your project.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Share your Sheet:</span> Share your Google Sheet with the service account email.
                  </li>
                  <li className="text-sm">
                    <span className="font-medium">Configure SheetDash:</span> Enter your Sheet ID, tab name, and credentials below.
                  </li>
                </ol>
                <div className="mt-6 rounded-md bg-muted p-4 text-xs">
                  <p className="font-medium">Need help?</p>
                  <p className="mt-1 text-muted-foreground">
                    Check out our <a href="#" className="text-primary hover:underline">detailed setup guide</a> for step-by-step instructions with screenshots.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}