import React, { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
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

  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    assignedToId: null,
  });

  // Employees yuklash (assignee dropdown uchun)
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
        setError("Iltimos, xatoliklarni to'g'irlang.");
      } else {
        setError(response?.error?.message || "Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {task ? "Edit task" : "Create task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none ${
                fieldErrors.title ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {fieldErrors.title && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.title[0]}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none ${
                fieldErrors.dueDate ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {fieldErrors.dueDate && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.dueDate[0]}
              </p>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to
            </label>
            <select
              name="assignedToId"
              value={formData.assignedToId || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
            >
              <option value="">Unassigned</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.position})
                </option>
              ))}
            </select>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0f172b] text-white px-4 py-2 rounded-lg hover:bg-[#1a2744] transition text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : task ? "Update task" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
