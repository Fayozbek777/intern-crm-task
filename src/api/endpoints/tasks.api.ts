import { api } from "../Clients/client";

// Task turlari
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    position?: string;
  };
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    position?: string;
  };
}

export interface TaskFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE" | "ALL";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "ALL";
  assignedToId?: string | "UNASSIGNED" | "ALL";
  sortBy?: "dueDate" | "createdAt" | "title" | "priority" | "status";
  sortOrder?: "asc" | "desc";
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate: string;
  assignedToId?: string | null;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  assignedToId?: string | null;
}

export const tasksApi = {
  // Barcha tasklarni olish
  getAll: async (params?: TaskFilters) => {
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  // Bitta taskni olish
  getById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  // Task yaratish
  create: async (data: CreateTaskData) => {
    const response = await api.post("/tasks", data);
    return response.data.data;
  },

  // Taskni tahrirlash
  update: async (id: string, data: UpdateTaskData) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.data;
  },

  // Task statusini o'zgartirish
  updateStatus: async (id: string, status: "TODO" | "IN_PROGRESS" | "DONE") => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data.data;
  },

  // Taskni o'chirish
  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data.data;
  },
};
