import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  Home,
  Briefcase,
  Calendar,
  Settings,
  Bell,
  Search,
  Users,
} from "lucide-react";
import { useAuth } from "../../../ctx/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <>
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16 shadow-sm">
        <div className="h-full px-3 sm:px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-[#0f172b] rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0f172b] whitespace-nowrap">
                CorpCRM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 sm:gap-2 focus:outline-none group"
              >
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0f172b&color=fff&bold=true`
                  }
                  alt={user.firstName}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-200 group-hover:border-[#0f172b] transition-all duration-200"
                />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700 leading-tight">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-gray-400 leading-tight">
                    {user.role}
                  </span>
                </div>
                <ChevronDown
                  className={`hidden md:block w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0f172b&color=fff&bold=true&size=128`
                        }
                        alt={user.firstName}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <span className="text-xs bg-[#f5f8fb] text-[#0f172b] px-2 py-0.5 rounded-full mt-1 inline-block">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      My Profile
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-3 shadow-lg animate-in slide-in-from-top-1 duration-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-black/20 z-40 animate-in fade-in duration-200">
          <div
            ref={mobileMenuRef}
            className="absolute left-0 top-0 w-72 max-w-[85vw] h-full bg-white shadow-xl animate-in slide-in-from-left-1 duration-200"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0f172b&color=fff&bold=true&size=128`
                  }
                  alt={user.firstName}
                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-16"></div>
    </>
  );
};

export default Header;
