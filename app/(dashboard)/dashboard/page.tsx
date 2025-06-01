'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  BarChart3,
  Database,
  FilePlus,
  LineChart,
  Sheet,
  Users,
  TableProperties,
} from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your sheets and recent activity
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Configure Google Sheet
            </CardTitle>
            <Sheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Connect Sheet</div>
            <p className="text-xs text-muted-foreground pt-1">
              Set up your Google Sheets connection
            </p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link href="/dashboard/config" className="w-full">
              <Button className="w-full" size="sm">
                Configure
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              View Data
            </CardTitle>
            <TableProperties className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sheet Data</div>
            <p className="text-xs text-muted-foreground pt-1">
              View and manage your sheet data
            </p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link href="/dashboard/data" className="w-full">
              <Button className="w-full" size="sm">
                View Data
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Analytics
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View Reports</div>
            <p className="text-xs text-muted-foreground pt-1">
              Analyze your sheet data
            </p>
          </CardContent>
          <CardFooter className="mt-auto">
            <Link href="/dashboard/analytics" className="w-full">
              <Button className="w-full" size="sm">
                View Analytics
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <RecentActivity />
    </div>
  );
}