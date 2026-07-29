import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  dashboardApi,
  DashboardAdmin,
} from "../../../api/endpoints/dashboard.api";

// Chart.js ni sozlash
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
);

const Dashboard = () => {
  const navigate = useNavigate();

  // Dashboard ma'lumotlarini olish
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.get(),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {(error as any)?.response?.data?.error?.message || "Xatolik yuz berdi"}
      </div>
    );
  }

  // Admin dashboard
  if (data.scope === "ADMIN") {
    const { stats, chart, recentTasks, recentEmployees } =
      data as DashboardAdmin;

    // Chart ma'lumotlari
    const chartData = {
      labels: chart.map((item: { label: string }) => item.label),
      datasets: [
        {
          label: "Completed",
          data: chart.map((item: { completed: number }) => item.completed),
          backgroundColor: "#94a3b8",
          borderColor: "#94a3b8",
          borderWidth: 2,
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        },
        {
          label: "Created",
          data: chart.map((item: { created: number }) => item.created),
          backgroundColor: "#0f172a",
          borderColor: "#0f172a",
          borderWidth: 2,
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            boxWidth: 8,
            boxHeight: 8,
            font: {
              size: 12,
              weight: "500" as const,
            },
            color: "#64748b",
          },
        },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#ffffff",
          bodyColor: "#94a3b8",
          cornerRadius: 8,
          padding: 12,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: "#f1f5f9",
            drawBorder: false,
          },
          ticks: {
            color: "#94a3b8",
            font: {
              size: 12,
              weight: "500" as const,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: "#f1f5f9",
            drawBorder: false,
          },
          ticks: {
            color: "#94a3b8",
            font: {
              size: 11,
            },
            stepSize: 1,
          },
        },
      },
      hover: {
        mode: "index" as const,
        intersect: false,
      },
    };

    const totalTasks =
      stats.activeTasks + stats.completedTasks + stats.pendingTasks;

    return (
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Here is what is happening across your organisation today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total employees</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalEmployees}
                </p>
              </div>
              <div className="bg-blue-500 p-2 rounded-lg text-white">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active tasks</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.activeTasks}
                </p>
              </div>
              <div className="bg-green-500 p-2 rounded-lg text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed tasks</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.completedTasks}
                </p>
              </div>
              <div className="bg-purple-500 p-2 rounded-lg text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending tasks</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.pendingTasks}
                </p>
                {stats.overdueTasks > 0 && (
                  <p className="text-xs text-red-600">
                    {stats.overdueTasks} overdue
                  </p>
                )}
              </div>
              <div className="bg-yellow-500 p-2 rounded-lg text-white">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Task Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Task Activity
            </h2>
            <span className="text-sm text-gray-500">
              Over the last seven days, {totalTasks} tasks were created and{" "}
              {stats.completedTasks} were completed.
            </span>
          </div>
          <div className="h-64">
            <Bar data={chartData} />
          </div>
        </div>

        {/* Recent Employees and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Employees */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent employees
              </h2>
              <button
                onClick={() => navigate("/employees")}
                className="text-sm text-[#0f172b] hover:underline font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {recentEmployees.map((emp: any) => (
                <div
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="flex items-center justify-between p-2 hover:bg-[#f1f5f9] rounded-lg transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        emp.avatar ||
                        `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=0f172b&color=fff`
                      }
                      alt={emp.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{emp.position}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      emp.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : emp.status === "INACTIVE"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent tasks
              </h2>
              <button
                onClick={() => navigate("/tasks")}
                className="text-sm text-[#0f172b] hover:underline font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {recentTasks.map((task: any) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="p-2 hover:bg-[#f1f5f9] rounded-lg transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {task.assignedTo && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>
                              {task.assignedTo.firstName}{" "}
                              {task.assignedTo.lastName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.status === "DONE"
                          ? "bg-green-100 text-green-700"
                          : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
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
  }

  // Employee dashboard
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
      <p className="text-gray-500 text-sm">Employee view coming soon...</p>
    </div>
  );
};

export default Dashboard;
