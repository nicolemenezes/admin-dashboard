import React from "react"
import Layout from "../components/layout"
import SimpleLineChart  from "../components/ui/simple_chart"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, DollarSign, Activity } from "lucide-react"

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Add New
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,248</p>
              <p className="text-sm text-gray-500">+12% from last week</p>
             
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$8,420</p>
              <p className="text-sm text-gray-500">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Active Sessions</CardTitle>
              <Activity className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">312</p>
              <p className="text-sm text-gray-500">+5.4% today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Growth</CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">23%</p>
              <p className="text-sm text-gray-500">Since last quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span>User <strong>Alex</strong> signed up</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Payment of <strong>$250</strong> received</span>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </li>
              <li className="flex items-center justify-between">
                <span>New project <strong>“Portfolio Redesign”</strong> added</span>
                <span className="text-sm text-gray-500">1 day ago</span>
              </li>
            </ul>
          </CardContent>
          
        </Card>
      </div>
      <div>
        <Card>
        <CardContent>
            <SimpleLineChart />
          </CardContent>
          </Card>
      </div>
     
    </Layout>
  )
}
