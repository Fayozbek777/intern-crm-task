import { api } from "../Clients/client";

export interface DashboardAdmin {
  scope: "ADMIN";
  stats: {
    totalEmployees: number;
    activeTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  chart: Array<{
    label: string;
    date: string;
    created: number;
    completed: number;
  }>;
  recentTasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: string;
    assignedTo?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
  recentEmployees: Array<{
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    avatar?: string;
    status: string;
  }>;
}

export interface DashboardEmployee {
  scope: "EMPLOYEE";
  stats: {
    assignedTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
  };
  chart: Array<{
    label: string;
    date: string;
    created: number;
    completed: number;
  }>;
  myTasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: string;
  }>;
}

export type DashboardData = DashboardAdmin | DashboardEmployee;

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const response = await api.get("/dashboard");
    return response.data.data;
  },
};
