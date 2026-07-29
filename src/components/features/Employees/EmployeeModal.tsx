import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Mail,
  Lock,
  Briefcase,
  Phone,
  Shield,
  UserCheck,
  Image,
} from "lucide-react";
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
  const [avatarPreview, setAvatarPreview] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

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
      setAvatarPreview(employee.avatar || "");
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
      setAvatarPreview("");
    }
    setError("");
    setFieldErrors({});
  }, [employee, isOpen]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: [] });
    }
    if (name === "avatar") {
      setAvatarPreview(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      if (employee) {
        const { password, ...rest } = formData;
        const updateData = password ? { ...rest, password } : rest;
        await employeesApi.update(employee.id, updateData);
      } else {
        await employeesApi.create(formData);
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
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {employee ? "Edit Employee" : "Add Employee"}
              </h2>
              <p className="text-xs text-gray-400">
                {employee
                  ? "Update employee information"
                  : "Create a new employee"}
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

          {/* Avatar Preview */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#0f172b]/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#0f172b]/30" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-400" />
                  Avatar URL
                </span>
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className={inputClasses("avatar")}
                placeholder="https://i.pravatar.cc/150?u=1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  First name <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={inputClasses("firstName")}
                placeholder="John"
                required
              />
              {fieldErrors.firstName && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.firstName[0]}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  Last name <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={inputClasses("lastName")}
                placeholder="Doe"
                required
              />
              {fieldErrors.lastName && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.lastName[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses("email")}
              placeholder="john.doe@company.com"
              required
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                {employee ? "New Password" : "Password"}
                {!employee && <span className="text-red-500">*</span>}
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses("password")}
                required={!employee}
                placeholder={
                  employee
                    ? "Leave blank to keep current"
                    : "Minimum 8 characters"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.password[0]}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              At least 8 characters, uppercase, lowercase and number
            </p>
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                Position <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={inputClasses("position")}
              placeholder="Software Engineer"
              required
            />
            {fieldErrors.position && (
              <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {fieldErrors.position[0]}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Phone
              </span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClasses("phone")}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Role <span className="text-red-500">*</span>
                </span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm text-gray-900"
              >
                <option value="EMPLOYEE">👤 Employee</option>
                <option value="ADMIN">👑 Admin</option>
              </select>
              <p className="text-xs text-gray-400 mt-1.5">
                Admins can manage employees and tasks
              </p>
            </div>

            <div>
              <label className={labelClasses}>
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-gray-400" />
                  Status <span className="text-red-500">*</span>
                </span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] outline-none transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm text-gray-900"
              >
                <option value="ACTIVE">🟢 Active</option>
                <option value="INACTIVE">🔴 Inactive</option>
                <option value="ON_LEAVE">🟡 On Leave</option>
              </select>
              <p className="text-xs text-gray-400 mt-1.5">
                Inactive employees cannot sign in
              </p>
            </div>
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
              ) : employee ? (
                "Save Changes"
              ) : (
                "Create Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
