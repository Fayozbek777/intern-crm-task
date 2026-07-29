import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Briefcase,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { tasksApi, Task } from "../../../api/endpoints/tasks.api";
import { useAuth } from "../../../ctx/AuthContext";
import TaskModal from "./TaskModal";

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const data = await tasksApi.getById(id);
        setTask(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Task not found");
        } else {
          setError(err.response?.data?.error?.message || "Xatolik yuz berdi");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!task) return;
    if (!window.confirm(`"${task.title}" ni o'chirmoqchimisiz?`)) return;
    try {
      await tasksApi.delete(task.id);
      navigate("/tasks");
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "O'chirishda xatolik");
    }
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

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tasks
        </Link>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error || "Task not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to tasks
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${isOverdue(task.dueDate) && task.status !== "DONE" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
              >
                {formatDate(task.dueDate)}
                {isOverdue(task.dueDate) &&
                  task.status !== "DONE" &&
                  " (overdue)"}
              </span>
            </div>
          </div>

          {/* Actions menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                  View details
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setIsModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Edit className="w-4 h-4 text-blue-500" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
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
        </div>

        {/* Description */}
        {task.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Due</p>
                <p
                  className={`text-sm ${isOverdue(task.dueDate) && task.status !== "DONE" ? "text-red-600 font-medium" : "text-gray-800"}`}
                >
                  {formatDate(task.dueDate)}
                  {isOverdue(task.dueDate) &&
                    task.status !== "DONE" &&
                    " (overdue)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-gray-800">
                  {formatDateTime(task.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="text-sm text-gray-800">
                  {formatDateTime(task.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignee & Created by */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">People</h2>

          {/* Assignee */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Assignee</p>
            {task.assignedTo ? (
              <div className="flex items-center gap-3">
                <img
                  src={
                    task.assignedTo.avatar ||
                    `https://ui-avatars.com/api/?name=${task.assignedTo.firstName}+${task.assignedTo.lastName}&background=0f172b&color=fff`
                  }
                  alt={task.assignedTo.firstName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {task.assignedTo.firstName} {task.assignedTo.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.assignedTo.position}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Unassigned</p>
            )}
          </div>

          {/* Created by */}
          {task.createdBy && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Created by</p>
              <div className="flex items-center gap-3">
                <img
                  src={
                    task.createdBy.avatar ||
                    `https://ui-avatars.com/api/?name=${task.createdBy.firstName}+${task.createdBy.lastName}&background=0f172b&color=fff`
                  }
                  alt={task.createdBy.firstName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {task.createdBy.firstName} {task.createdBy.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.createdBy.position}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowMenu(false);
        }}
        onSuccess={() => {
          window.location.reload();
        }}
        task={task}
      />
    </div>
  );
};

export default TaskDetail;
