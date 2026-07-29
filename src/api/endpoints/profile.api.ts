import { api } from "../Clients/client";

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  phone?: string;
  avatar?: string;
  role: "ADMIN" | "EMPLOYEE";
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  position?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const response = await api.get("/profile");
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<Profile> => {
    const response = await api.put("/profile", data);
    return response.data.data;
  },

  changePassword: async (
    data: ChangePasswordData,
  ): Promise<{ success: true }> => {
    const response = await api.put("/profile/password", data);
    return response.data.data;
  },
};
