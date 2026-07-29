import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { authApi } from "../api/Auth/auth";

// User tipi
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "EMPLOYEE";
  avatar?: string;
}

// AuthContext tipi
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

// AuthContext yaratish
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider komponenti
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Profilni olish - faqat bir marta
  const loadUser = useCallback(async () => {
    // Agar allaqachon yuklangan bo'lsa, qayta yuklamaymiz
    if (isInitialized) return;

    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Sayt yuklanganda faqat bir marta chaqiriladi
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login qilish
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authApi.login(email, password);
      setUser(userData);
      setIsInitialized(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout qilish
  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setIsInitialized(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // User ma'lumotlarini yangilash
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
