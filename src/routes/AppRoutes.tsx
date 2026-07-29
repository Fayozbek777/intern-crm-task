import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/features/auth/Login";
import Dashboard from "../components/features/dashboard/Dashboard";
import EmployeesList from "../components/features/Employees/EmployeesList";
import TasksList from "../components/features/Tasks/TasksList";
import Profile from "../components/features/Profile/Profile";
import Layout from "../components/common/Layout/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeesList />} />
        <Route path="/tasks" element={<TasksList />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
