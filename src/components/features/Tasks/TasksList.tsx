import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { tasksApi, Task, TaskFilters } from "../../../api/endpoints/tasks.api";
import { useAuth } from "../../../ctx/AuthContext";
import TaskModal from "./TaskModal";

const TasksList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    pageSize: 10,
    search: "",
    status: "ALL",
    priority: "ALL",
    sortBy: "dueDate",
    sortOrder: "asc",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => tasksApi.getAll(filters),
    staleTime: 1000 * 60 * 5,
  });

  const tasks = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "TODO" | "IN_PROGRESS" | "DONE";
    }) => tasksApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const handleStatusChange = (
    id: string,
    status: "TODO" | "IN_PROGRESS" | "DONE",
  ) => {
    statusMutation.mutate({ id, status });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu taskni o'chirmoqchimisiz?")) return;
    deleteMutation.mutate(id);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/tasks/${id}`);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DONE: "bg-green-100 text-green-700",
      TODO: "bg-gray-100 text-gray-700",
      IN_PROGRESS: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-gray-100 text-gray-700",
      MEDIUM: "bg-yellow-100 text-yellow-700",
      HIGH: "bg-red-100 text-red-700",
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            My tasks
          </h1>
          <p className="text-sm text-gray-500">
            Everything currently assigned to you.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="bg-[#0f172b] text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a2744] transition text-sm font-medium whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Add task</span>
            <span className="xs:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          <div className="flex-1 min-w-[180px] sm:min-w-[200px]">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none bg-white min-w-[120px]"
            >
              <option value="ALL">All statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none bg-white min-w-[120px]"
            >
              <option value="ALL">All priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {(error as any)?.response?.data?.error?.message ||
            "Xatolik yuz berdi"}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Priority
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Due date
                </th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && (
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Assigned to
                  </th>
                )}
                <th className="text-right px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 5}
                    className="text-center py-8 text-gray-500"
                  >
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task: Task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition">
                    <td
                      className="px-4 sm:px-6 py-3 sm:py-4 cursor-pointer"
                      onClick={() => handleViewDetails(task.id)}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[180px] sm:max-w-[250px]">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[180px] sm:max-w-[250px]">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <span
                        className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span
                          className={`text-sm ${isOverdue(task.dueDate) && task.status !== "DONE" ? "text-red-600 font-medium" : "text-gray-600"}`}
                        >
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                      {isOverdue(task.dueDate) && task.status !== "DONE" && (
                        <span className="text-xs text-red-600 block">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value as any)
                        }
                        className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-[#0f172b] ${getStatusColor(task.status)} w-full min-w-[90px] sm:w-auto`}
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>
                    {isAdmin && (
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                task.assignedTo.avatar ||
                                `https://ui-avatars.com/api/?name=${task.assignedTo.firstName}+${task.assignedTo.lastName}&background=0f172b&color=fff&size=24`
                              }
                              alt={task.assignedTo.firstName}
                              className="w-6 h-6 rounded-full flex-shrink-0"
                            />
                            <span className="truncate max-w-[100px]">
                              {task.assignedTo.firstName}{" "}
                              {task.assignedTo.lastName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>
                    )}
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === task.id ? null : task.id,
                            );
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {openMenuId === task.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 text-left">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(task.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                              View details
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTask(task);
                                    setIsModalOpen(true);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                                >
                                  <Edit className="w-4 h-4 text-blue-500" />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(task.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {tasks.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left order-2 sm:order-1">
              Showing{" "}
              {Math.min(
                (filters.page! - 1) * filters.pageSize! + 1,
                meta.total,
              )}
              –{Math.min(filters.page! * filters.pageSize!, meta.total)} of{" "}
              {meta.total} tasks
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => handlePageChange(filters.page! - 1)}
                disabled={!meta.hasPreviousPage}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Page {filters.page} of {meta.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(filters.page! + 1)}
                disabled={!meta.hasNextPage}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }}
        task={editingTask}
      />
    </div>
  );
};

export default TasksList;
