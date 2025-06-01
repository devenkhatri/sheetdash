import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
  const activities = [
    {
      user: { name: "John Doe", initials: "JD", image: "" },
      action: "added a new row",
      target: "Customers sheet",
      timestamp: "2 minutes ago",
    },
    {
      user: { name: "Jane Smith", initials: "JS", image: "" },
      action: "updated",
      target: "Product #1242",
      timestamp: "40 minutes ago",
    },
    {
      user: { name: "Bob Johnson", initials: "BJ", image: "" },
      action: "deleted",
      target: "Order #9854",
      timestamp: "2 hours ago",
    },
    {
      user: { name: "Alice Williams", initials: "AW", image: "" },
      action: "updated sheet configuration",
      target: "Inventory",
      timestamp: "5 hours ago",
    },
    {
      user: { name: "System", initials: "SY", image: "" },
      action: "performed data backup",
      target: "All sheets",
      timestamp: "1 day ago",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest actions performed in your sheets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.image} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
                  <span className="font-semibold">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}