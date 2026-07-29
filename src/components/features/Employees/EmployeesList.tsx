import React, { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  MoreVertical,
  UserPlus,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Statik ma'lumotlar
const employeesData = [
  {
    id: 1,
    name: "Marcus Reed",
    email: "marcus.reed@corpcrm.dev",
    position: "Mobile Developer",
    role: "Employee",
    status: "Inactive",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=13",
  },
  {
    id: 2,
    name: "Laura Bianchi",
    email: "laura.bianchi@corpcrm.dev",
    position: "Marketing Manager",
    role: "Employee",
    status: "Active",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=12",
  },
  {
    id: 3,
    name: "Kevin Osei",
    email: "kevin.osei@corpcrm.dev",
    position: "Support Specialist",
    role: "Employee",
    status: "Active",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=11",
  },
  {
    id: 4,
    name: "Julia Novak",
    email: "julia.novak@corpcrm.dev",
    position: "Data Analyst",
    role: "Employee",
    status: "On Leave",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=10",
  },
  {
    id: 5,
    name: "Ivan Petrov",
    email: "ivan.petrov@corpcrm.dev",
    position: "DevOps Engineer",
    role: "Employee",
    status: "Active",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=9",
  },
  {
    id: 6,
    name: "Hannah Lee",
    email: "hannah.lee@corpcrm.dev",
    position: "Product Designer",
    role: "Employee",
    status: "Active",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=8",
  },
  {
    id: 7,
    name: "George Miller",
    email: "george.miller@corpcrm.dev",
    position: "Backend Developer",
    role: "Employee",
    status: "Inactive",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=7",
  },
  {
    id: 8,
    name: "Fiona Grant",
    email: "fiona.grant@corpcrm.dev",
    position: "QA Engineer",
    role: "Employee",
    status: "Active",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=6",
  },
  {
    id: 9,
    name: "Ethan Harris",
    email: "ethan.harris@corpcrm.dev",
    position: "Frontend Developer",
    role: "Employee",
    status: "Active",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: 10,
    name: "Charlie Davis",
    email: "charlie.davis@corpcrm.dev",
    position: "UX Designer",
    role: "Employee",
    status: "On Leave",
    joined: "29 Jul 2026",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
];

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(employeesData.length / itemsPerPage);

  // Filter qilish
  const filteredEmployees = employeesData.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "All roles" || emp.role === roleFilter;
    const matchesStatus =
      statusFilter === "All statuses" || emp.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-green-100 text-green-700",
      Inactive: "bg-gray-100 text-gray-700",
      "On Leave": "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getRoleColor = (role: string) => {
    return role === "Admin"
      ? "bg-purple-100 text-purple-700"
      : "bg-blue-100 text-blue-700";
  };

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
        <button className="bg-[#0f172b] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#1a2744] transition text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add employee
        </button>
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
                placeholder="Search by name, email or position…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="relative">
            <button
              onClick={() => setIsRoleOpen(!isRoleOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4 text-gray-400" />
              {roleFilter}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isRoleOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[150px] z-10">
                {["All roles", "Admin", "Employee"].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setRoleFilter(role);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      roleFilter === role
                        ? "text-[#0f172b] font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
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
                {["All statuses", "Active", "Inactive", "On Leave"].map(
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
        </div>
      </div>

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
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-9 h-9 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {emp.name}
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
                    {emp.joined}
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
            {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of{" "}
            {filteredEmployees.length} employees
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

export default EmployeeList;
