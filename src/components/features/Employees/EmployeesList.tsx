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
} from "lucide-react";
import {
  employeesApi,
  Employee,
  EmployeeFilters,
} from "../../../api/endpoints/employees.api";
import EmployeeModal from "./EmployeeModal";
import { useAuth } from "../../../ctx/AuthContext";

const EmployeesList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filter holati
  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 1,
    pageSize: 10,
    search: "",
    role: "ALL",
    status: "ALL",
  });

  // React Query - Employees olish
  const { data, isLoading, error } = useQuery({
    queryKey: ["employees", filters],
    queryFn: () => employeesApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 daqiqa
  });

  const employees = data?.data || [];
  const meta = data?.meta || {
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  // Qidiruv
  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  // Filter o'zgartirish
  const handleFilterChange = (key: keyof EmployeeFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  // Sahifa o'zgartirish
  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Xodim o'chirish
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu xodimni o'chirmoqchimisiz?")) return;
    deleteMutation.mutate(id);
  };

  // View details
  const handleViewDetails = (id: string) => {
    navigate(`/employees/${id}`);
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

  if (isLoading && employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-500 text-sm">
            Manage your team members, their roles and access.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEmployee(null);
            setIsModalOpen(true);
          }}
          className="bg-[#0f172b] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a2744] transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add employee
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email or position…"
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
          >
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYEE">Employee</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {(error as any)?.response?.data?.error?.message ||
            "Xatolik yuz berdi"}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp: Employee) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleViewDetails(emp.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            emp.avatar ||
                            `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=0f172b&color=fff`
                          }
                          alt={emp.firstName}
                          className="w-9 h-9 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.position}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getRoleColor(emp.role)}`}
                      >
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(emp.status)}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(emp.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === emp.id ? null : emp.id,
                            );
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>

                        {openMenuId === emp.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 text-left">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(emp.id);
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
                                    setEditingEmployee(emp);
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
                                    handleDelete(emp.id);
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing{" "}
            {employees.length > 0
              ? (filters.page! - 1) * filters.pageSize! + 1
              : 0}
            –{Math.min(filters.page! * filters.pageSize!, meta.total)} of{" "}
            {meta.total} employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={!meta.hasPreviousPage}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
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
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["employees"] });
        }}
        employee={editingEmployee}
      />
    </div>
  );
};

export default EmployeesList;
