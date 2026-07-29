import { api } from "../Clients/client";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "EMPLOYEE";
  avatar?: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  getProfile: async (): Promise<User | null> => {
    try {
      const response = await api.get("/profile");
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },

  updateProfile: async (data: any): Promise<User> => {
    const response = await api.put("/profile", data);
    return response.data.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> => {
    await api.put("/profile/password", data);
  },
};
