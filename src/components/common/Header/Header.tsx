import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../../../ctx/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center h-16">
      <div className="text-xl font-semibold text-gray-800">CorpCRM</div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0f172b&color=fff`
              }
              alt={user.firstName}
              className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-[#0f172b] transition"
            />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user.firstName} {user.lastName}
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0f172b&color=fff`
                    }
                    alt={user.firstName}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className="text-xs bg-[#f5f8fb] text-[#0f172b] px-2 py-0.5 rounded-full mt-1 inline-block">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#f5f8fb] transition"
                >
                  <UserCircle className="w-4 h-4 text-[#74849b]" />
                  My Profile
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
