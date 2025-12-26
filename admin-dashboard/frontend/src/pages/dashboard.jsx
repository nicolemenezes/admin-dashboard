import React, { useEffect, useState } from "react";
import axios from "axios";
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

export default function Dashboard() {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Stats from backend
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Transactions and chart data
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Other UI data (initialized empty)
  const [recentActivity, setRecentActivity] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Create Transaction modal state
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    source: "",
    date: "",
  });

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${base}/api/dashboard/stats`);
        setStats(res.data.data);
      } catch (err) {
        console.error("Stats fetch failed:", err);
        alert("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [base]);

  // Fetch transactions and map to chart
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${base}/api/transactions`);
        const items = res.data.data || [];
        setTransactions(items);

        // Map transactions → chart format
        const formatted = items.map((t) => ({
          name: new Date(t.date).toLocaleString("en", { month: "short", year: "numeric" }),
          revenue: t.amount || 0,
        }));
        setChartData(formatted);
      } catch (err) {
        console.error("Transactions fetch failed:", err);
        alert("Failed to load transactions");
        setTransactions([]);
        setChartData([]);
      }
    };
    fetchTransactions();
  }, [base]);

  // Stats card config
  const statsConfig = [
    { title: "Total Users", key: "totalUsers", change: "+12% from last week", icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { title: "Revenue", key: "totalRevenue", change: "+8% from last month", icon: DollarSign, iconBg: "bg-green-100", iconColor: "text-green-600", prefix: "$" },
    { title: "Active Sessions", key: "totalSessions", change: "+5.4% today", icon: Activity, iconBg: "bg-orange-100", iconColor: "text-orange-600" },
    { title: "Growth", key: "growth", value: "23%", change: "Since last quarter", icon: TrendingUp, iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  ];

  // Tooltip for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-xs mb-2">{payload[0].payload.name}</p>
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

  // Create transaction handler
  const handleCreateTransaction = async (e) => {
    e?.preventDefault?.();
    try {
      const payload = {
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        source: form.source,
        date: form.date,
      };

      const res = await axios.post(`${base}/api/transactions`, payload);
      const newTx = res.data.data;

      // Update local state
      const nextTransactions = [...transactions, newTx];
      setTransactions(nextTransactions);

      const nextChart = [
        ...chartData,
        {
          name: new Date(newTx.date).toLocaleString("en", { month: "short", year: "numeric" }),
          revenue: newTx.amount || 0,
        },
      ];
      setChartData(nextChart);

      setShowCreate(false);
      setForm({ amount: "", category: "", description: "", source: "", date: "" });
    } catch (err) {
      console.error("Create transaction failed:", err);
      alert(err.response?.data?.message || "Failed to create transaction");
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Add New
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          const value = stat.value || (stats && stats[stat.key]) || 0;
          const displayValue = stat.prefix ? `${stat.prefix}${Number(value).toLocaleString()}` : Number(value).toLocaleString();
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

      {/* Revenue Overview (live from transactions) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
        </div>
        <div className="p-6">
          <div className="bg-black rounded-xl overflow-hidden" style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: "10px", fontSize: "12px", color: "#FFFFFF" }}
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Simple Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Source</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(-10).map((t) => (
                  <tr key={t._id} className="border-t border-gray-100">
                    <td className="py-2 pr-4">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="py-2 pr-4">{t.category || "-"}</td>
                    <td className="py-2 pr-4">{t.description || "-"}</td>
                    <td className="py-2 pr-4">${Number(t.amount).toLocaleString()}</td>
                    <td className="py-2 pr-4">{t.source || "-"}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td className="py-4 text-gray-500" colSpan={5}>No transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Transaction Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Create Transaction</h3>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Amount</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Source</label>
                <input
                  type="text"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}