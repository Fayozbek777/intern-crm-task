import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { employeesApi } from "../../../api/endpoints/employees.api";
import { Employee } from "../../../types/Employee/employee.types";
import { useAuth } from "../../../ctx/AuthContext";
import EmployeeModal from "./EmployeeModal";

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;
      setLoading(true);
      setError("");
      try {
        const data = await employeesApi.getById(id);
        setEmployee(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Employee not found");
        } else {
          setError(err.response?.data?.error?.message || "Xatolik yuz berdi");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    if (!employee) return;
    if (
      !window.confirm(
        `"${employee.firstName} ${employee.lastName}" ni ochirmoqchimisiz?`,
      )
    )
      return;
    try {
      await employeesApi.delete(employee.id);
      navigate("/employees");
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Ochirishda xatolik");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-gray-100 text-gray-700",
      ON_LEAVE: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getRoleColor = (role: string) => {
    return role === "ADMIN"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link
          to="/employees"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to employees
        </Link>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error || "Employee not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        to="/employees"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to employees
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={
                employee.avatar ||
                `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=0f172b&color=fff&size=80`
              }
              alt={employee.firstName}
              className="w-20 h-20 rounded-full border-2 border-gray-200"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-gray-500">{employee.position}</p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRoleColor(employee.role)}`}
                >
                  {employee.role}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(employee.status)}`}
                >
                  {employee.status}
                </span>
              </div>
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
                  onClick={() => {
                    setShowMenu(false);
                  }}
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
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-800">{employee.email}</p>
              </div>
            </div>
            {employee.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-800">{employee.phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm text-gray-800">
                  {formatDate(employee.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Last updated</p>
                <p className="text-sm text-gray-800">
                  {formatDate(employee.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Task stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Task load
          </h2>
          {employee.taskStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {employee.taskStats.total}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {employee.taskStats.todo}
                </p>
                <p className="text-xs text-gray-500">To do</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {employee.taskStats.inProgress}
                </p>
                <p className="text-xs text-gray-500">In progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {employee.taskStats.done}
                </p>
                <p className="text-xs text-gray-500">Done</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No task data available</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShowMenu(false);
        }}
        onSuccess={() => {
          window.location.reload();
        }}
        employee={employee}
      />
    </div>
  );
};

export default EmployeeDetail;
