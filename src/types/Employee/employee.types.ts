// Employee tipiga taskStats qo'shamiz
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
  taskStats?: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    overdue: number;
  };
}
