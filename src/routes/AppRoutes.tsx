import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/features/auth/Login";
import Dashboard from "../components/features/dashboard/Dashboard";
import Layout from "../components/common/Layout/Layout";
import EmployeeList from "../components/features/Employees/EmployeesList";
import TaskList from "../components/features/Tasks/TasksList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route
          path="/profile"
          element={<div className="p-8">Profile Page</div>}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
