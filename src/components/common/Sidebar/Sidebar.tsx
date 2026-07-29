import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../ctx/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/employees", label: "Employees", icon: Users },
    { path: "/tasks", label: "Tasks", icon: ClipboardList },
    { path: "/profile", label: "Profile", icon: UserCircle },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#f5f8fb] min-h-[calc(100vh-64px)] p-4 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 mb-6">
        <Users className="w-8 h-8 text-blue-400" />
        <span className="text-xl font-bold text-[#0f172b]">CorpCRM</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-[#0f172b] text-white"
                  : "text-[#74849b] hover:bg-[#0f172b]/5 hover:text-[#0f172b]"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#74849b] hover:bg-[#0f172b]/5 hover:text-[#0f172b] transition mt-auto"
      >
        <LogOut className="w-5 h-5" />
        Log out
      </button>
    </aside>
  );
};

export default Sidebar;
