// API dan keladigan xodim ma'lumotlari
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

// Xodim yaratish uchun ma'lumotlar
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

// Filter parametrlari
export interface EmployeeFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: "ADMIN" | "EMPLOYEE" | "ALL";
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "ALL";
  sortBy?: "createdAt" | "firstName" | "lastName" | "email";
  sortOrder?: "asc" | "desc";
}

// API dan keladigan response
export interface EmployeeResponse {
  success: boolean;
  data: Employee[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
