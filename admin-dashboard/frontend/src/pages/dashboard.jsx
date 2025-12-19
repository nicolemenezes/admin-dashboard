import React, { useEffect, useState } from "react";
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import api from "../lib/api";
import RevenueChart from "../components/dashboard/RevenueChart";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then(res => {
        setStats(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const statsConfig = [
    {
      title: "Total Users",
      key: "totalUsers",
      change: "+12% from last week",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Revenue",
      key: "totalRevenue",
      change: "+8% from last month",
      icon: DollarSign,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      prefix: "$",
    },
    {
      title: "Active Sessions",
      key: "totalSessions",
      change: "+5.4% today",
      icon: Activity,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Growth",
      key: "growth",
      value: "23%",
      change: "Since last quarter",
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const recentActivity = [
    { user: "Alex", action: "signed up", time: "2 hours ago" },
    { user: "Payment of $250", action: "received", time: "5 hours ago" },
    { user: 'New project "Portfolio Redesign"', action: "added", time: "1 day ago" },
  ];

  // Original chart data - matching your screenshot
  const originalChartData = [
    { month: "Jan", revenue: 85, revenue2: 85, costs: 85, baseline: 85 },
    { month: "Feb", revenue: 130, revenue2: 130, costs: 100, baseline: 85 },
    { month: "Mar", revenue: 180, revenue2: 180, costs: 120, baseline: 85 },
    { month: "Apr", revenue: 150, revenue2: 150, costs: 140, baseline: 85 },
    { month: "May", revenue: 200, revenue2: 200, costs: 150, baseline: 85 },
    { month: "Jun", revenue: 240, revenue2: 240, costs: 160, baseline: 85 },
    { month: "Jul", revenue: 220, revenue2: 220, costs: 165, baseline: 85 },
    { month: "Aug", revenue: 260, revenue2: 260, costs: 170, baseline: 85 },
    { month: "Sep", revenue: 290, revenue2: 290, costs: 180, baseline: 85 },
    { month: "Oct", revenue: 310, revenue2: 310, costs: 200, baseline: 85 },
    { month: "Nov", revenue: 280, revenue2: 280, costs: 220, baseline: 85 },
    { month: "Dec", revenue: 340, revenue2: 340, costs: 255, baseline: 85 },
  ];

  // Traffic Sources Pie Chart Data
  const trafficData = [
    { name: "Direct", value: 35, color: "#3B82F6" },
    { name: "Social", value: 25, color: "#8B5CF6" },
    { name: "Email", value: 20, color: "#10B981" },
    { name: "Referral", value: 12, color: "#F59E0B" },
    { name: "Search", value: 8, color: "#EF4444" },
  ];

  // User Distribution by Region
  const regionData = [
    { name: "North America", value: 40, color: "#3B82F6" },
    { name: "Europe", value: 30, color: "#8B5CF6" },
    { name: "Asia", value: 20, color: "#10B981" },
    { name: "Others", value: 10, color: "#F59E0B" },
  ];

  // Category Sales Data
  const categoryData = [
    { category: "Electronics", value: 4200 },
    { category: "Clothing", value: 3800 },
    { category: "Food", value: 3200 },
    { category: "Books", value: 2800 },
    { category: "Sports", value: 2400 },
    { category: "Home", value: 2000 },
  ];

  // Custom Tooltip for main chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-xs mb-2">{payload[0].payload.month}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          + Add New
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          const value = stat.value || (stats && stats[stat.key]) || 0;
          const displayValue = stat.prefix ? `${stat.prefix}${value.toLocaleString()}` : value.toLocaleString();
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.iconColor} size={24} />
                </div>
              </div>
              <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{displayValue}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm text-gray-900">
                    User <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Original Chart - Revenue Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
        </div>
        <div className="p-6">
          <div className="bg-black rounded-xl overflow-hidden" style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={originalChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{
                    paddingBottom: "10px",
                    fontSize: "12px",
                    color: "#FFFFFF",
                  }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#EC4899"
                  strokeWidth={2.5}
                  dot={{ fill: "#EC4899", r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="revenue2"
                  stroke="#A855F7"
                  strokeWidth={2.5}
                  dot={{ fill: "#A855F7", r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="costs"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  dot={{ fill: "#06B6D4", r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Costs"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#6B7280"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Baseline"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Revenue Chart Component */}
      <div className="mb-6">
        <RevenueChart />
      </div>

      {/* Charts Grid - Pie Charts and Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Traffic Sources Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trafficData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {trafficData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Distribution by Region */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {regionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Sales Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{item.category}</span>
                <span className="font-medium text-gray-900">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}