import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/features/auth/Login";
import Dashboard from "../components/features/dashboard/Dashboard";
import EmployeesList from "../components/features/Employees/EmployeesList";
import EmployeeDetail from "../components/features/Employees/EmployeeDetail";
import TasksList from "../components/features/Tasks/TasksList";
import TaskDetail from "../components/features/Tasks/TaskDetail";
import Profile from "../components/features/Profile/Profile";
import Layout from "../components/common/Layout/Layout";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeesList />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/tasks" element={<TasksList />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
