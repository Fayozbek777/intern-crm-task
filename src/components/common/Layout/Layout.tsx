import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#f5f8fb]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-white m-4 rounded-xl shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
