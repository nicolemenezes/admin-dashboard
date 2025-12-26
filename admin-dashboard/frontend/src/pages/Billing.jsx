import React, { useEffect, useState } from "react";
import axios from "axios";
import { CreditCard, Download, Calendar, DollarSign, TrendingUp, CheckCircle2, Loader2, AlertCircle, X } from "lucide-react";

export default function Billing() {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const userId = localStorage.getItem("userId"); // set on auth

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [cards, setCards] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalSpentThisYear: 0,
    nextBillingDate: null,
    monthlySubscription: 0,
  });
  const [subscription, setSubscription] = useState({
    planName: "",
    monthlyPrice: 0,
    devHoursAllowed: 0,
    devHoursUsed: 0,
    nextBillingDate: null,
  });

  // Add Card modal
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardBrand: "Visa",
    last4: "",
    expiryDate: "",
    isDefault: false,
  });

  const overage = Number(subscription.devHoursUsed) > Number(subscription.devHoursAllowed);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [summaryRes, invoicesRes, cardsRes] = await Promise.all([
          axios.get(`${base}/api/billing/summary`, { params: { userId } }),
          axios.get(`${base}/api/billing/invoices`, { params: { userId } }),
          axios.get(`${base}/api/billing/payment-methods`, { params: { userId } }),
        ]);

        const summary = summaryRes.data?.data || {};
        setStats({
          totalSpentThisYear: summary.totalSpentThisYear || 0,
          nextBillingDate: summary.nextBillingDate || null,
          monthlySubscription: summary.monthlySubscription || 0,
        });
        if (summary.subscription) {
          setSubscription({
            planName: summary.subscription.planName,
            monthlyPrice: summary.subscription.monthlyPrice,
            devHoursAllowed: summary.subscription.devHoursAllowed,
            devHoursUsed: summary.subscription.devHoursUsed,
            nextBillingDate: summary.subscription.nextBillingDate,
          });
        }

        setInvoices(invoicesRes.data?.data || []);
        setCards(cardsRes.data?.data || []);
      } catch (err) {
        console.error("Billing fetch failed:", err);
        setError(err.response?.data?.message || "Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [base, userId]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";
  const formatCurrency = (amount) => `$${Number(amount || 0).toFixed(2)}`;

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${base}/api/billing/payment-methods`, { ...cardForm, userId });
      setCards([res.data.data, ...cards]);
      setShowCardModal(false);
      setCardForm({ cardBrand: "Visa", last4: "", expiryDate: "", isDefault: false });
    } catch (err) {
      console.error("Add card failed:", err);
      alert(err.response?.data?.message || "Failed to add card");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600">Manage your billing information and payment methods</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-red-800 font-medium">Error loading billing data</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <TrendingUp size={14} />
              0%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.totalSpentThisYear)}</h3>
          <p className="text-sm text-gray-600">Total Spent This Year</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatDate(stats.nextBillingDate || subscription.nextBillingDate)}</h3>
          <p className="text-sm text-gray-600">Next Billing Date</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="text-purple-600" size={24} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(subscription.monthlyPrice || stats.monthlySubscription)}</h3>
          <p className="text-sm text-gray-600">Monthly Subscription</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                <button
                  onClick={() => setShowCardModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Add Card
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {cards.map((card) => (
                <div key={card._id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                        <CreditCard className="text-white" size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {card.cardBrand} •••• {card.last4}
                          </p>
                          {card.isDefault && <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">Default</span>}
                        </div>
                        <p className="text-sm text-gray-600">Expires {card.expiryDate}</p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                  </div>
                </div>
              ))}
              {cards.length === 0 && <p className="text-sm text-gray-500">No payment methods</p>}
            </div>
          </div>
        </div>

        {/* Current Plan with overage alert */}
        <div className={`bg-white rounded-xl shadow-sm border ${overage ? "border-red-400" : "border-gray-200"}`}>
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            {overage && <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Overage detected</span>}
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <CheckCircle2 className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{subscription.planName || "Plan"}</h3>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {formatCurrency(subscription.monthlyPrice || stats.monthlySubscription)}
                <span className="text-sm text-gray-600 font-normal">/month</span>
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-700">Unlimited projects</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-700">Advanced analytics</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className={`${overage ? "text-red-500" : "text-green-500"} flex-shrink-0 mt-0.5`} size={18} />
                <p className={`text-sm ${overage ? "text-red-700" : "text-gray-700"}`}>
                  {subscription.devHoursUsed} of {subscription.devHoursAllowed} Dedicated Dev Hours
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-gray-700">24h Critical Bug Response</p>
              </div>
            </div>

            <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              Manage Plan
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions (mapped from invoices) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.slice(0, 10).map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{inv.projectRef || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(inv.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{inv.status}</span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-gray-500" colSpan={5}>
                    No transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Download className="text-gray-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <span className="text-sm text-gray-500">•</span>
                      <p className="text-sm text-gray-600">{invoice.projectRef || "-"}</p>
                    </div>
                    <p className="text-sm text-gray-600">{formatDate(invoice.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</p>
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">{invoice.status}</span>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                    <Download className="text-gray-600" size={18} />
                  </button>
                </div>
              </div>
            ))}
            {invoices.length === 0 && <p className="text-sm text-gray-500">No invoices</p>}
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Card</h3>
              <button onClick={() => setShowCardModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Brand</label>
                <select
                  value={cardForm.cardBrand}
                  onChange={(e) => setCardForm({ ...cardForm, cardBrand: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                >
                  <option>Visa</option>
                  <option>Mastercard</option>
                  <option>Amex</option>
                  <option>Discover</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700">Last 4 digits</label>
                <input
                  type="text"
                  maxLength={4}
                  value={cardForm.last4}
                  onChange={(e) => setCardForm({ ...cardForm, last4: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Expiry (MM/YY)</label>
                <input
                  type="text"
                  placeholder="12/25"
                  value={cardForm.expiryDate}
                  onChange={(e) => setCardForm({ ...cardForm, expiryDate: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isDefault"
                  type="checkbox"
                  checked={cardForm.isDefault}
                  onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default
                </label>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save
                </button>
                <button type="button" onClick={() => setShowCardModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
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