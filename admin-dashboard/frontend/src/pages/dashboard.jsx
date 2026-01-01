import React, { useEffect, useState } from 'react';
import api from '../lib/axios';

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[Dashboard] Fetching stats...');
      const statsRes = await api.get('/api/dashboard/stats');
      console.log('[Dashboard] Stats response:', statsRes.data);
      
      if (statsRes.data.success) {
        const statsData = statsRes.data.data.stats || [];
        // Ensure growth values are valid numbers
        const sanitizedStats = statsData.map(stat => ({
          ...stat,
          change: stat.change || '+0%',
          trend: stat.trend || 'up'
        }));
        setStats(sanitizedStats);
      }

      console.log('[Dashboard] Fetching transactions...');
      const transactionsRes = await api.get('/api/transactions');
      console.log('[Dashboard] Transactions response:', transactionsRes.data);
      
      if (transactionsRes.data.success) {
        const txData = transactionsRes.data.data || [];
        setTransactions(Array.isArray(txData) ? txData : []);
      }

    } catch (error) {
      console.error('[Dashboard] Fetch error:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async (transactionData) => {
    try {
      console.log('[Dashboard] Saving transaction:', transactionData);
      
      const response = await api.post('/api/transactions', transactionData);
      
      console.log('[Dashboard] Transaction save response:', response.data);
      
      if (response.data.success) {
        alert('Transaction saved successfully!');
        await fetchDashboardData();
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      console.error('[Dashboard] Save transaction error:', error);
      const message = error.response?.data?.message || 'Failed to save transaction';
      alert(`Error: ${message}`);
      return { success: false, error: message };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => handleSaveTransaction({
            amount: 100,
            description: 'Test transaction',
            status: 'pending',
            type: 'credit'
          })}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Test Save Transaction
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">ID</th>
                  <th className="text-left py-2 px-4">User</th>
                  <th className="text-left py-2 px-4">Amount</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{tx._id.slice(-6)}</td>
                    <td className="py-2 px-4">{tx.user?.name || 'N/A'}</td>
                    <td className="py-2 px-4">${tx.amount}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}