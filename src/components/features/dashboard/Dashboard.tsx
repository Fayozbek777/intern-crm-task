import React from "react";
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    { label: "Total Employees", value: 13, icon: Users, color: "bg-blue-500" },
    {
      label: "Active Tasks",
      value: 8,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Completed Tasks",
      value: 6,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    { label: "Pending Tasks", value: 14, icon: Clock, color: "bg-yellow-500" },
    {
      label: "Overdue Tasks",
      value: 3,
      icon: AlertCircle,
      color: "bg-red-500",
    },
  ];

  const recentEmployees = [
    { name: "Marcus Reed", position: "Mobile Developer", status: "Inactive" },
    { name: "Laura Bianchi", position: "Marketing Manager", status: "Active" },
    { name: "Kevin Osei", position: "Support Specialist", status: "Active" },
    { name: "Julia Novak", position: "Data Analyst", status: "On Leave" },
    { name: "Ivan Petrov", position: "DevOps Engineer", status: "Active" },
  ];

  const recentTasks = [
    {
      title: "Triage flaky tests",
      due: "15 Jul 2026",
      assignee: "Fiona Grant",
      status: "Done",
    },
    {
      title: "Plan the next hiring round",
      due: "13 Aug 2026",
      assignee: null,
      status: "To Do",
    },
    {
      title: "Security review for the release",
      due: "10 Aug 2026",
      assignee: null,
      status: "To Do",
    },
    {
      title: "Ship push notifications",
      due: "18 Aug 2026",
      assignee: "Marcus Reed",
      status: "To Do",
    },
    {
      title: "Prepare Q4 budget",
      due: "7 Aug 2026",
      assignee: "Laura Bianchi",
      status: "To Do",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Done: "bg-green-100 text-green-700",
      "To Do": "bg-gray-100 text-gray-700",
      "In Progress": "bg-blue-100 text-blue-700",
      Active: "bg-green-100 text-green-700",
      Inactive: "bg-gray-100 text-gray-700",
      "On Leave": "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Here is what is happening across your organisation today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2 rounded-lg text-white`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Task Activity</h2>
          <span className="text-sm text-gray-500">
            Over the last seven days, 28 tasks were created and 6 were
            completed.
          </span>
        </div>
        <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400">Chart coming soon...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Employees
            </h2>
            <button className="text-sm text-[#0f172b] hover:underline font-medium">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recentEmployees.map((emp, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-[#f5f8fb] rounded-lg transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                    {emp.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {emp.name}
                    </p>
                    <p className="text-xs text-gray-500">{emp.position}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(emp.status)}`}
                >
                  {emp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Tasks
            </h2>
            <button className="text-sm text-[#0f172b] hover:underline font-medium">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task, index) => (
              <div
                key={index}
                className="p-2 hover:bg-[#f5f8fb] rounded-lg transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{task.due}</span>
                      {task.assignee && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{task.assignee}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
