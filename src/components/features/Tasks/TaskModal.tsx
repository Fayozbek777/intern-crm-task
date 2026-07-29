import React, { useState, useEffect, useRef } from "react";
import {
  X,
  AlertCircle,
  User,
  Calendar,
  Flag,
  ListTodo,
  AlignLeft,
  Users,
} from "lucide-react";
import {
  tasksApi,
  CreateTaskData,
  Task,
} from "../../../api/endpoints/tasks.api";
import { employeesApi, Employee } from "../../../api/endpoints/employees.api";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task?: Task | null;
}

const TaskModal = ({ isOpen, onClose, onSuccess, task }: TaskModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    assignedToId: null,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeesApi.getAll({ page: 1, pageSize: 100 });
        setEmployees(response.data);
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }
    };
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.split("T")[0],
        assignedToId: task.assignedTo?.id || null,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        dueDate: "",
        assignedToId: null,
      });
    }
    setError("");
    setFieldErrors({});
  }, [task, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: [] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      if (task) {
        await tasksApi.update(task.id, formData);
      } else {
        await tasksApi.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const response = err.response?.data;
      if (response?.error?.fieldErrors) {
        setFieldErrors(response.error.fieldErrors);
        setError("Please correct the errors below.");
      } else {
        setError(response?.error?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses = (fieldName: string) => `
    w-full px-3.5 py-2.5 
    border rounded-lg 
    focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] 
    outline-none transition-all duration-200
    bg-gray-50/50 hover:bg-white
    ${fieldErrors[fieldName] ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200"}
    text-sm text-gray-900 placeholder-gray-400
  `;

  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  const priorityColors = {
    LOW: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-red-100 text-red-700",
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0f172b] rounded-xl flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {task ? "Edit Task" : "Create Task"}
              </h2>
              <p className="text-xs text-gray-400">
                {task ? "Update task details" : "Add a new task"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm flex items-start gap-2.5 border border-red-100 animate-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-gray-400" />
                Title <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClasses("title")}
              placeholder="Enter task title"
              required
            />
            {fieldErrors.title && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.title[0]}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-gray-400" />
                Description
              </span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm text-gray-900 placeholder-gray-400 resize-y"
              placeholder="Describe the task..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-gray-400" />
                  Priority
                </span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm text-gray-900"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🔴 High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-gray-400" />
                  Status
                </span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm text-gray-900"
              >
                <option value="TODO">📋 To Do</option>
                <option value="IN_PROGRESS">🔄 In Progress</option>
                <option value="DONE">✅ Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Due Date <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={inputClasses("dueDate")}
              required
            />
            {fieldErrors.dueDate && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.dueDate[0]}
              </p>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                Assign to
              </span>
            </label>
            <select
              name="assignedToId"
              value={formData.assignedToId || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm text-gray-900"
            >
              <option value="">👤 Unassigned</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.position})
                </option>
              ))}
            </select>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#0f172b] text-white px-6 py-2.5 rounded-xl hover:bg-[#1a2744] transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : task ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
