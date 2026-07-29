import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../ctx/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobileOpen
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileOpen]);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/employees", label: "Employees", icon: Users },
    { path: "/tasks", label: "Tasks", icon: ClipboardList },
    { path: "/profile", label: "Profile", icon: UserCircle },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsMobileOpen(false);
  };

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed(!isCollapsed);
    } else {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-[#0f172b]" />
        ) : (
          <Menu className="w-5 h-5 text-[#0f172b]" />
        )}
      </button>

      <aside
        ref={sidebarRef}
        className={`
          fixed lg:sticky top-16 left-0 z-40
          h-[calc(100vh-64px)] 
          bg-[#f5f8fb] 
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-lg lg:shadow-none
          border-r border-gray-200/50
        `}
      >
        <button
          onClick={toggleSidebar}
          className={`
            hidden lg:flex absolute -right-3 top-20
            w-6 h-6 bg-white border border-gray-200 rounded-full
            items-center justify-center shadow-md
            hover:bg-gray-50 transition-all duration-200
            ${isCollapsed ? "rotate-180" : ""}
          `}
        >
          <ChevronLeft className="w-3.5 h-3.5 text-[#74849b]" />
        </button>

        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileOpen(false);
                  }
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg 
                  text-sm font-medium transition-all duration-200
                  group relative
                  ${isCollapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-[#0f172b] text-white shadow-md"
                      : "text-[#74849b] hover:bg-[#0f172b]/5 hover:text-[#0f172b]"
                  }
                `}
              >
                <item.icon
                  className={`
                  w-5 h-5 flex-shrink-0
                  transition-transform duration-200
                  group-hover:scale-110
                `}
                />

                {!isCollapsed && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}

                {isCollapsed && (
                  <div
                    className="
                    absolute left-full ml-4 px-2 py-1
                    bg-[#0f172b] text-white text-xs rounded
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible
                    transition-all duration-200 whitespace-nowrap
                    pointer-events-none
                  "
                  >
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div
          className={`
          px-3 py-4 border-t border-gray-200/50
          ${isCollapsed ? "flex justify-center" : ""}
        `}
        >
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium text-[#74849b]
              hover:bg-red-50 hover:text-red-600
              transition-all duration-200
              w-full group relative
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <LogOut
              className={`
              w-5 h-5 flex-shrink-0
              transition-transform duration-200
              group-hover:scale-110
            `}
            />

            {!isCollapsed && <span className="whitespace-nowrap">Log out</span>}

            {isCollapsed && (
              <div
                className="
                absolute left-full ml-4 px-2 py-1
                bg-red-600 text-white text-xs rounded
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 whitespace-nowrap
                pointer-events-none
              "
              >
                Log out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
