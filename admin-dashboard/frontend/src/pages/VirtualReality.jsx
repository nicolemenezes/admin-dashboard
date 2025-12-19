import React, { useState } from "react";
import {
  Glasses,
  Play,
  Pause,
  Users,
  Clock,
  TrendingUp,
  Eye,
  Headphones,
  Gamepad2,
  BarChart3,
} from "lucide-react";

export default function VirtualReality() {
  const [activeSession, setActiveSession] = useState(true);

  const vrExperiences = [
    {
      id: 1,
      title: "Ocean Exploration",
      duration: "15 min",
      participants: 24,
      status: "Active",
    },
    {
      id: 2,
      title: "Space Station Tour",
      duration: "20 min",
      participants: 18,
      status: "Active",
    },
    {
      id: 3,
      title: "Ancient Egypt",
      duration: "25 min",
      participants: 32,
      status: "Active",
    },
    {
      id: 4,
      title: "Mountain Climbing",
      duration: "18 min",
      participants: 15,
      status: "Scheduled",
    },
  ];

  const statistics = [
    { label: "Total Sessions", value: "1,248", change: "+12%", icon: Glasses },
    { label: "Active Users", value: "312", change: "+5.4%", icon: Users },
    { label: "Avg Duration", value: "23 min", change: "+2.1%", icon: Clock },
    { label: "Engagement", value: "89%", change: "+3.2%", icon: TrendingUp },
  ];

  const recentSessions = [
    {
      id: 1,
      user: "Alex Johnson",
      experience: "Ocean Exploration",
      duration: "12 min",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Sarah Williams",
      experience: "Space Station Tour",
      duration: "18 min",
      time: "3 hours ago",
    },
    {
      id: 3,
      user: "Mike Brown",
      experience: "Ancient Egypt",
      duration: "22 min",
      time: "5 hours ago",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Live Sessions
        </h1>
        <p className="text-gray-600">
          Monitor and manage your live sessions
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {statistics.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="text-blue-600" size={24} />
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp size={14} />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Active Session Monitor */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg p-8 text-white mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Live Session</h2>
                <p className="text-blue-100">Ocean Exploration Experience</p>
              </div>
              <button
                onClick={() => setActiveSession(!activeSession)}
                className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all backdrop-blur-sm"
              >
                {activeSession ? (
                  <Pause className="text-white" size={28} />
                ) : (
                  <Play className="text-white ml-1" size={28} />
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} />
                  <span className="text-sm text-blue-100">Duration</span>
                </div>
                <p className="text-2xl font-bold">12:34</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={18} />
                  <span className="text-sm text-blue-100">Users</span>
                </div>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={18} />
                  <span className="text-sm text-blue-100">Quality</span>
                </div>
                <p className="text-2xl font-bold">4K</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-100">Audio Quality</span>
                <span className="font-medium">Spatial Audio</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-100">Frame Rate</span>
                <span className="font-medium">90 FPS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-100">Network Latency</span>
                <span className="font-medium">12ms</span>
              </div>
            </div>
          </div>

          {/* VR Experiences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Available Experiences
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vrExperiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{exp.image}</div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          exp.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {exp.status}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {exp.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {exp.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        {exp.participants}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Equipment Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Equipment Status
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Glasses className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">VR Headset</p>
                    <p className="text-xs text-gray-600">Connected</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Controllers</p>
                    <p className="text-xs text-gray-600">100% Battery</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Headphones className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Audio</p>
                    <p className="text-xs text-gray-600">Active</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Sessions
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {session.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {session.user}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        {session.experience}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{session.duration}</span>
                        <span>•</span>
                        <span>{session.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Performance
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">GPU Usage</span>
                  <span className="text-sm font-medium text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Memory</span>
                  <span className="text-sm font-medium text-gray-900">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "62%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}