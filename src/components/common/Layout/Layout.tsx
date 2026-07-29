import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f8fb]">
      <Header />
      <div className="flex relative">
        <Sidebar />
        <main
          className={`
            flex-1 
            transition-all duration-300 ease-in-out
            ${isMobile ? "p-2 sm:p-3" : "p-3 md:p-4 lg:p-6"}
            bg-white 
            ${isMobile ? "m-1 sm:m-2" : "m-2 md:m-3 lg:m-4 xl:m-6"}
            rounded-xl shadow-sm
            min-h-[calc(100vh-80px)]
          `}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
