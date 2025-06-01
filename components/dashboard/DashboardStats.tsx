import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, BarChart3, Database, Sheet, Users } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Rows
          </CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,245</div>
          <p className="text-xs text-muted-foreground flex items-center pt-1">
            <span className="text-emerald-500 flex items-center mr-1">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              12%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Sheets
          </CardTitle>
          <Sheet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground flex items-center pt-1">
            <span className="text-emerald-500 flex items-center mr-1">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              2
            </span>
            from last week
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            User Accounts
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground flex items-center pt-1">
            <span className="text-emerald-500 flex items-center mr-1">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              3
            </span>
            new this month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            API Requests
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,543</div>
          <p className="text-xs text-muted-foreground flex items-center pt-1">
            <span className="text-rose-500 flex items-center mr-1">
              <ArrowDownIcon className="h-3 w-3 mr-1" />
              5%
            </span>
            from yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  );
}