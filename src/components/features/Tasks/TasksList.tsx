import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";

// Statik ma'lumotlar
const tasksData = [
  {
    id: 1,
    title: "Triage flaky tests",
    description: "Three integration tests fail intermittently on CI.",
    priority: "Low",
    status: "Done",
    dueDate: "15 Jul 2026",
    assignee: "Fiona Grant",
    isOverdue: false,
  },
  {
    id: 2,
    title: "Write canned responses",
    description: "Templates for the ten most common support questions.",
    priority: "Low",
    status: "Done",
    dueDate: "18 Jul 2026",
    assignee: null,
    isOverdue: false,
  },
  {
    id: 3,
    title: "Write onboarding docs",
    description:
      "Document the local setup steps for new engineers joining the team.",
    priority: "Low",
    status: "Done",
    dueDate: "20 Jul 2026",
    assignee: null,
    isOverdue: false,
  },
  {
    id: 4,
    title: "Icon set consistency pass",
    description:
      "Replace the remaining mismatched icons with the lucide equivalents.",
    priority: "Low",
    status: "Done",
    dueDate: "22 Jul 2026",
    assignee: null,
    isOverdue: false,
  },
  {
    id: 5,
    title: "Design system audit",
    description:
      "Catalogue every button and input variant currently in production.",
    priority: "Medium",
    status: "Done",
    dueDate: "24 Jul 2026",
    assignee: null,
    isOverdue: false,
  },
  {
    id: 6,
    title: "Clear the support backlog",
    description: "Forty-two tickets are older than a week.",
    priority: "High",
    status: "In Progress",
    dueDate: "25 Jul 2026",
    assignee: null,
    isOverdue: true,
  },
  {
    id: 7,
    title: "Provision staging database",
    description:
      "Spin up a managed Postgres instance and wire it to the staging deploy.",
    priority: "High",
    status: "Done",
    dueDate: "26 Jul 2026",
    assignee: null,
    isOverdue: false,
  },
  {
    id: 8,
    title: "Fix session expiry bug",
    description:
      "JWT sessions expire an hour early for users in non-UTC timezones.",
    priority: "High",
    status: "To Do",
    dueDate: "27 Jul 2026",
    assignee: null,
    isOverdue: true,
  },
  {
    id: 9,
    title: "Optimise employee list query",
    description:
      "The list endpoint does a full table scan when a search term is present.",
    priority: "High",
    status: "To Do",
    dueDate: "28 Jul 2026",
    assignee: null,
    isOverdue: true,
  },
  {
    id: 10,
    title: "Regression suite for auth",
    description: "Cover login, logout, role guards and session refresh.",
    priority: "High",
    status: "In Progress",
    dueDate: "30 Jul 2026",
    assignee: null,
    isOverdue: false,
  },
];

const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tasksData.length / itemsPerPage);

  // Filter qilish
  const filteredTasks = tasksData.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All statuses" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All priorities" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Done: "bg-green-100 text-green-700",
      "To Do": "bg-gray-100 text-gray-700",
      "In Progress": "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Low: "bg-gray-100 text-gray-700",
      Medium: "bg-yellow-100 text-yellow-700",
      High: "bg-red-100 text-red-700",
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My tasks</h1>
          <p className="text-gray-500 text-sm">
            Everything currently assigned to you.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks by title or description…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4 text-gray-400" />
              {statusFilter}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isStatusOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px] z-10">
                {["All statuses", "To Do", "In Progress", "Done"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                        statusFilter === status
                          ? "text-[#0f172b] font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => setIsPriorityOpen(!isPriorityOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4 text-gray-400" />
              {priorityFilter}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isPriorityOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px] z-10">
                {["All priorities", "Low", "Medium", "High"].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setPriorityFilter(priority);
                      setIsPriorityOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      priorityFilter === priority
                        ? "text-[#0f172b] font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due date
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {task.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span
                        className={`text-sm ${task.isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}
                      >
                        {task.dueDate}
                        {task.isOverdue && " (overdue)"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded transition">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredTasks.length)} of{" "}
            {filteredTasks.length} tasks
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
