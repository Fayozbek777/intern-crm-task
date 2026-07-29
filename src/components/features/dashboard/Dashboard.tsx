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
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          Yuklanmoqda...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center gap-2 bg-red-50 text-red-600 p-4 rounded-lg text-center text-sm">
        <AlertCircle className="w-4 h-4 shrink-0" />
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
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-0">
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Here is what is happening across your organisation today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="bg-white rounded-lg shadow-sm p-3.5 sm:p-4 border border-gray-100 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Total employees
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {stats.totalEmployees}
                </p>
              </div>
              <div className="bg-blue-500 p-2 rounded-lg text-white shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3.5 sm:p-4 border border-gray-100 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Active tasks
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {stats.activeTasks}
                </p>
              </div>
              <div className="bg-green-500 p-2 rounded-lg text-white shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3.5 sm:p-4 border border-gray-100 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Completed tasks
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {stats.completedTasks}
                </p>
              </div>
              <div className="bg-purple-500 p-2 rounded-lg text-white shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3.5 sm:p-4 border border-gray-100 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Pending tasks
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-800">
                  {stats.pendingTasks}
                </p>
                {stats.overdueTasks > 0 && (
                  <p className="text-[11px] sm:text-xs text-red-600 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {stats.overdueTasks} overdue
                  </p>
                )}
              </div>
              <div className="bg-yellow-500 p-2 rounded-lg text-white shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Task Activity Chart + Recent Employees */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Task Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Task Activity
              </h2>
              <span className="text-xs sm:text-sm text-gray-500">
                Over the last seven days, {totalTasks} tasks were created and{" "}
                {stats.completedTasks} were completed.
              </span>
            </div>
            <div className="h-56 sm:h-64 lg:h-72">
              <Bar data={chartData} />
            </div>
          </div>

          {/* Recent Employees */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Recent employees
              </h2>
              <button
                onClick={() => navigate("/employees")}
                className="text-xs sm:text-sm text-[#0f172b] hover:underline font-medium flex items-center gap-1 shrink-0"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              {recentEmployees.map((emp: any) => (
                <div
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="flex items-center justify-between gap-2 p-2 hover:bg-[#f1f5f9] rounded-lg transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        emp.avatar ||
                        `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=0f172b&color=fff`
                      }
                      alt={emp.firstName}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {emp.position}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs px-2 py-1 rounded-full shrink-0 whitespace-nowrap ${
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
        </div>

        {/* Recent Tasks (full width) */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Recent tasks
            </h2>
            <button
              onClick={() => navigate("/tasks")}
              className="text-xs sm:text-sm text-[#0f172b] hover:underline font-medium flex items-center gap-1 shrink-0"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1.5 sm:gap-2">
            {recentTasks.map((task: any) => (
              <div
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="p-2 hover:bg-[#f1f5f9] rounded-lg transition cursor-pointer border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      {task.assignedTo && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full shrink-0" />
                          <span className="truncate">
                            {task.assignedTo.firstName}{" "}
                            {task.assignedTo.lastName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs px-2 py-1 rounded-full shrink-0 whitespace-nowrap ${
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
    );
  }

  // Employee dashboard
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        My Dashboard
      </h1>
      <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
        Employee view coming soon...
      </p>
    </div>
  );
};

export default Dashboard;
