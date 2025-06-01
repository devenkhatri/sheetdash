import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { AgeDistributionChart } from '@/components/dashboard/AgeDistributionChart';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics | SheetDash',
  description: 'Analyze your sheet data',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and visualizations of your sheet data
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>
              Number of employees per department
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DepartmentChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Status</CardTitle>
            <CardDescription>
              Active vs inactive employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatusChart />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>
              Distribution of employees by age
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AgeDistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}