import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit3, Bell, Trash2, X } from "lucide-react";
import api from "../lib/axios";

export default function Profile() {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    bio: "",
    phone: "",
    location: "",
    company: "",
    projectsCount: 0,
    totalHours: 0,
    email: "",
  });

  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    phone: "",
    location: "",
    company: "",
    projectsCount: 0,
    totalHours: 0,
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/users/me");
      const userData = res.data?.data ?? res.data?.user ?? res.data ?? {};
      setProfile({
        fullName: userData.fullName || "",
        bio: userData.bio || "",
        phone: userData.phone || "",
        location: userData.location || "",
        company: userData.company || "",
        projectsCount: Number(userData.projectsCount || 0),
        totalHours: Number(userData.totalHours || 0),
        email: userData.email || "",
      });
    } catch (err) {
      console.error("[API Error]:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load profile");
      setProfile({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openEdit = () => {
    setForm({
      fullName: profile.fullName,
      bio: profile.bio,
      phone: profile.phone,
      location: profile.location,
      company: profile.company,
      projectsCount: profile.projectsCount,
      totalHours: profile.totalHours,
    });
    setShowEdit(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${base}/api/users/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const data = res.data?.data;
      setProfile({
        ...profile,
        fullName: data.fullName,
        bio: data.bio,
        phone: data.phone,
        location: data.location,
        company: data.company,
        projectsCount: data.projectsCount,
        totalHours: data.totalHours,
      });
      setShowEdit(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const formatNumber = (n) => Number(n || 0).toLocaleString();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.fullName || "Profile"}
          </h1>
          <p className="text-sm text-gray-600">{profile.email}</p>
        </div>
        <button
          onClick={openEdit}
          className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Edit3 size={18} />
          Edit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Projects</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(profile.projectsCount)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Total Hours</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(profile.totalHours)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Company</p>
          <p className="text-2xl font-bold text-gray-900">
            {profile.company || "-"}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>
          <button
            onClick={openEdit}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="text-sm text-gray-900">{profile.fullName || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="text-sm text-gray-900">{profile.phone || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm text-gray-900">{profile.location || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500">Bio</p>
            <p className="text-sm text-gray-900">{profile.bio || "-"}</p>
          </div>
        </div>
      </div>

      {/* Settings (simplified) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-gray-600" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Email notifications for updates
                </p>
              </div>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full transition-colors"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 className="text-red-600" size={18} />
              <div>
                <p className="text-sm font-medium text-red-700">Delete Account</p>
                <p className="text-xs text-red-600">
                  This action is irreversible
                </p>
              </div>
            </div>
            <button className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={saveEdit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700">Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Projects</label>
                <input
                  type="number"
                  min="0"
                  value={form.projectsCount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      projectsCount: Number(e.target.value),
                    })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Total Hours</label>
                <input
                  type="number"
                  min="0"
                  value={form.totalHours}
                  onChange={(e) =>
                    setForm({ ...form, totalHours: Number(e.target.value) })
                  }
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="md:col-span-2 flex gap-2 mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
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