import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/app/lib/api";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Star, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserPlus,
  PackagePlus,
  ShieldCheck,
  UserCog
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { useAuth } from "@/app/auth/AuthContext";

interface DepartmentStat {
  id: number;
  name: string;
  total: number;
  featured: number;
  active: number;
  value: number;
}

interface RecentProduct {
  id: number;
  name: string;
  department: string;
  price: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

interface UserRoleStat {
  name: string;
  value: number;
  role: string;
}

interface UserDepartmentStat {
  name: string;
  value: number;
}

interface Stats {
  // User stats
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  masterAdmins: number;
  sectionHeads: number;
  recentUsers: number;
  userTrend: number;
  usersByRole: UserRoleStat[];
  usersByDepartment: UserDepartmentStat[];
  
  // Product stats
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  featuredProducts: number;
  recentlyAdded: number;
  productTrend: number;
  
  // Department breakdown
  departmentStats: DepartmentStat[];
  
  // Recent activity
  recentProducts: RecentProduct[];
  
  // Period
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadStats = (days: number = 30) => {
    setLoading(true);
    api.get(`/admin/dashboard-stats?days=${days}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard stats:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStats(dateRange);
  }, [dateRange]);

  const handleDateRangeChange = (days: number) => {
    setDateRange(days);
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-display mb-6">Dashboard</h1>
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  const isMasterAdmin = user?.role === "master_admin";

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your store's performance and analytics
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => navigate('/admin/products/create')}
            className="gap-2"
          >
            <PackagePlus className="h-4 w-4" />
            Add Product
          </Button>
          {isMasterAdmin && (
            <Button 
              onClick={() => navigate('/admin/users/create')}
              variant="secondary"
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Time Period:</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={dateRange === 7 ? "default" : "outline"}
            onClick={() => handleDateRangeChange(7)}
          >
            7 Days
          </Button>
          <Button
            size="sm"
            variant={dateRange === 30 ? "default" : "outline"}
            onClick={() => handleDateRangeChange(30)}
          >
            30 Days
          </Button>
          <Button
            size="sm"
            variant={dateRange === 90 ? "default" : "outline"}
            onClick={() => handleDateRangeChange(90)}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* User Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalUsers ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.activeUsers ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently active accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Master Admins</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.masterAdmins ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                System administrators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Section Heads</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats?.sectionHeads ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Department managers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Analytics Charts */}
      {isMasterAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Role Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.usersByRole && stats.usersByRole.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.usersByRole}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => 
                        percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                      }
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.usersByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry: any) => `${entry.payload.name}: ${entry.payload.value}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No user data available</p>
              )}
            </CardContent>
          </Card>

          {/* Users by Department Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Users by Department</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.usersByDepartment && stats.usersByDepartment.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.usersByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground py-12">No department data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Overview with Trends */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Product Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalProducts ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All products in catalog
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats?.activeProducts ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Products</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats?.featuredProducts ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Highlighted on homepage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recently Added</CardTitle>
              {stats?.productTrend && stats.productTrend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats?.recentlyAdded ?? 0}
              </div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {stats?.productTrend !== undefined && stats.productTrend !== 0 && (
                  <>
                    {stats.productTrend > 0 ? (
                      <span className="text-green-600 flex items-center gap-0.5">
                        <TrendingUp className="h-3 w-3" />
                        +{stats.productTrend}%
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-0.5">
                        <TrendingDown className="h-3 w-3" />
                        {stats.productTrend}%
                      </span>
                    )}
                    <span className="text-muted-foreground">vs previous period</span>
                  </>
                )}
                {(stats?.productTrend === undefined || stats.productTrend === 0) && (
                  <span className="text-muted-foreground">Last {stats?.period?.days ?? 30} days</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Department Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.departmentStats && stats.departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.departmentStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => 
                      percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                    }
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => `${entry.payload.name}: ${entry.payload.value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">No department data available</p>
            )}
          </CardContent>
        </Card>

        {/* Department Comparison Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Department Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.departmentStats && stats.departmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" fill="#10b981" name="Active" />
                  <Bar dataKey="featured" fill="#f59e0b" name="Featured" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">No department data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Department Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.departmentStats.map((dept) => (
            <Card key={dept.id}>
              <CardHeader>
                <CardTitle className="text-lg">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Products</span>
                  <span className="text-2xl font-bold">{dept.total}</span>
                </div>
                
                {/* Active Products Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Active
                    </span>
                    <span className="font-semibold">{dept.active} / {dept.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${dept.total > 0 ? (dept.active / dept.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Featured Products Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-600" />
                      Featured
                    </span>
                    <span className="font-semibold">{dept.featured} / {dept.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full transition-all"
                      style={{ width: `${dept.total > 0 ? (dept.featured / dept.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Inactive Products Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <XCircle className="h-4 w-4 text-gray-400" />
                      Inactive
                    </span>
                    <span className="font-semibold">{dept.total - dept.active} / {dept.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-400 h-2 rounded-full transition-all"
                      style={{ width: `${dept.total > 0 ? ((dept.total - dept.active) / dept.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Recently Added Products</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentProducts && stats.recentProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.name}</span>
                        {product.is_featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {!product.is_active && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span>{product.department}</span>
                        <span>•</span>
                        <span>₦{product.price?.toLocaleString() ?? 0}</span>
                        <span>•</span>
                        <span>{new Date(product.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No recent products added
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
