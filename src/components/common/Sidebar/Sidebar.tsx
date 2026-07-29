import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/employees", label: "Employees", icon: Users },
    { path: "/tasks", label: "Tasks", icon: ClipboardList },
    { path: "/profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <aside className="w-64 bg-[#f5f8fb] min-h-[calc(100vh-64px)] p-4 flex flex-col">
      {/* Menu */}
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

      <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-[#74849b] hover:bg-[#0f172b]/5 hover:text-[#0f172b] transition mt-auto">
        <LogOut className="w-5 h-5" />
        Log out
      </button>
    </aside>
  );
};

export default Sidebar;
