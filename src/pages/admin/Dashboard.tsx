import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  activeUsers: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/admin/dashboard-stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-display">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {stats?.totalUsers ?? "—"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {stats?.activeUsers ?? "—"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {stats?.totalProducts ?? "—"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
