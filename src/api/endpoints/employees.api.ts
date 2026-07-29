import { api } from "../Clients/client";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  avatar?: string;
  role: "ADMIN" | "EMPLOYEE";
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: "ADMIN" | "EMPLOYEE" | "ALL";
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "ALL";
  sortBy?: "createdAt" | "firstName" | "lastName" | "email";
  sortOrder?: "asc" | "desc";
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  position: string;
  phone?: string;
  avatar?: string;
  role?: "EMPLOYEE" | "ADMIN";
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
}

export const employeesApi = {
  getAll: async (params?: EmployeeFilters) => {
    const response = await api.get("/employees", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  },

  create: async (data: CreateEmployeeData) => {
    const response = await api.post("/employees", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateEmployeeData>) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data.data;
  },

  getAssignable: async () => {
    const response = await api.get("/employees/assignable");
    return response.data.data;
  },
};
