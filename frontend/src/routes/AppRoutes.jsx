import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import SuperAdminLayout from "../layouts/SuperAdminLayout";
import SuperAdminDashboard from "../pages/superadmin/Dashboard";
import SuperAdminAdmins from "../pages/superadmin/Admins";
import SuperAdminAllExams from "../pages/superadmin/AllExams";
import SuperAdminStudents from "../pages/superadmin/Students";
import SuperAdminSubmissions from "../pages/superadmin/Submissions";
import SuperAdminProfile from "../pages/superadmin/Profile";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import Subjects from "../pages/admin/Subjects";
import Questions from "../pages/admin/Questions";
import Exams from "../pages/admin/Exams";
import AdminProfile from "../pages/admin/Profile";

import StudentLayout from "../layouts/StudentLayout";
import StudentDashboard from "../pages/student/Dashboard";
import AvailableExams from "../pages/student/AvailableExams";
import TakeExam from "../pages/student/TakeExam";
import Result from "../pages/student/Result";
import Attempts from "../pages/student/Attempts";
import StudentProfile from "../pages/student/Profile";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRole="SUPER_ADMIN">
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="admins" element={<SuperAdminAdmins />} />
        <Route path="exams" element={<SuperAdminAllExams />} />
        <Route path="students" element={<SuperAdminStudents />} />
        <Route path="submissions" element={<SuperAdminSubmissions />} />
        <Route path="profile" element={<SuperAdminProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="questions" element={<Questions />} />
        <Route path="exams" element={<Exams />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exams" element={<AvailableExams />} />
        <Route path="exam/:examId" element={<TakeExam />} />
        <Route path="attempts" element={<Attempts />} />
        <Route path="results" element={<Result />} />
        <Route path="results/:attemptId" element={<Result />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;