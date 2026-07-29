import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  employeesApi,
  CreateEmployeeData,
  Employee,
} from "../../../api/endpoints/employees.api";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}

const EmployeeModal = ({
  isOpen,
  onClose,
  onSuccess,
  employee,
}: EmployeeModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<CreateEmployeeData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    phone: "",
    avatar: "",
    role: "EMPLOYEE",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        password: "",
        position: employee.position,
        phone: employee.phone || "",
        avatar: employee.avatar || "",
        role: employee.role,
        status: employee.status,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        position: "",
        phone: "",
        avatar: "",
        role: "EMPLOYEE",
        status: "ACTIVE",
      });
    }
    setError("");
    setFieldErrors({});
  }, [employee, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Field xatolikni tozalash
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
      if (employee) {
        // Update - password ni alohida tekshiramiz
        const { password, ...rest } = formData;
        const updateData = password ? { ...rest, password } : rest;
        await employeesApi.update(employee.id, updateData);
      } else {
        // Create
        await employeesApi.create(formData);
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
            {employee ? "Edit employee" : "Add employee"}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none ${
                  fieldErrors.firstName ? "border-red-500" : "border-gray-200"
                }`}
                required
              />
              {fieldErrors.firstName && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.firstName[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none ${
                  fieldErrors.lastName ? "border-red-500" : "border-gray-200"
                }`}
                required
              />
              {fieldErrors.lastName && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.lastName[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none ${
                fieldErrors.email ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {employee ? "New password" : "Password"}{" "}
              {!employee && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none ${
                  fieldErrors.password ? "border-red-500" : "border-gray-200"
                }`}
                required={!employee}
                placeholder={
                  employee ? "Leave blank to keep current" : "••••••••"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.password[0]}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              At least 8 characters, with an uppercase letter, a lowercase
              letter and a number.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none ${
                fieldErrors.position ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {fieldErrors.position && (
              <p className="text-xs text-red-500 mt-1">
                {fieldErrors.position[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Admins can manage employees and tasks.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Inactive employees cannot sign in.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
              placeholder="https://i.pravatar.cc/150?u=1"
            />
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
              {loading
                ? "Saving..."
                : employee
                  ? "Save changes"
                  : "Create employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
