import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminLogin from "../pages/admin/AdminLogin";

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
      <Route path="/admin/login" element={<AdminLogin />} />

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