import React from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  HelpCircle,
  FileCheck,
  Award,
  User,
  LogOut,
  X,
  ClipboardList,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Sidebar = ({ isOpen, onClose, role = "ADMIN" }) => {
  const { logout, user, isSuperAdmin, permissions } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate(role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin/login" : "/login");
  };

  const rawAdminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, enabled: true },
    { to: "/admin/categories", label: "Categories", icon: Layers, enabled: permissions?.canManageSubjects },
    { to: "/admin/subjects", label: "Subjects", icon: BookOpen, enabled: permissions?.canManageSubjects },
    { to: "/admin/questions", label: "Questions", icon: HelpCircle, enabled: permissions?.canManageQuestions },
    { to: "/admin/exams", label: "Exams", icon: FileCheck, enabled: permissions?.canCreateExams },
    { to: "/admin/profile", label: "Profile", icon: User, enabled: true },
  ];

  const studentLinks = [
    { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/exams", label: "Available Exams", icon: FileCheck },
    { to: "/student/attempts", label: "My Attempts", icon: ClipboardList },
    { to: "/student/results", label: "Results", icon: Award },
    { to: "/student/profile", label: "Profile", icon: User },
  ];

  const adminLinks = isSuperAdmin
    ? rawAdminLinks
    : rawAdminLinks.filter((item) => item.enabled);

  const links = role === "ADMIN" || role === "SUPER_ADMIN" ? adminLinks : studentLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{ borderRadius: "0px" }}
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-zinc-950 text-zinc-100 flex flex-col justify-between border-r border-zinc-800 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white text-zinc-950 flex items-center justify-center font-extrabold font-mono text-sm border border-white">
                E
              </div>
              <div>
                <span className="text-base font-extrabold tracking-wider uppercase text-white">
                  ExamSphere
                </span>
                <span className="block text-[10px] font-mono text-zinc-400 uppercase -mt-0.5">
                  {role === "SUPER_ADMIN" ? "Super Admin" : role === "ADMIN" ? "Admin Portal" : "Student Portal"}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSuperAdmin && (
            <div className="p-3 mx-3 my-2 bg-amber-400/10 border border-amber-400/30">
              <Link
                to="/super-admin/dashboard"
                className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold uppercase hover:underline"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Super Admin Console →</span>
              </Link>
            </div>
          )}

          <nav className="p-4 space-y-1">
            <p className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
              Navigation
            </p>
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  style={{ borderRadius: "0px" }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-white text-zinc-950 font-bold shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="p-3 bg-zinc-900 border border-zinc-800 mb-3" style={{ borderRadius: "0px" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 shrink-0" />
              <span className="text-[11px] font-mono text-zinc-300 truncate">
                {user?.email || (role === "ADMIN" ? "admin@examsphere.com" : "student@examsphere.com")}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ borderRadius: "0px" }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono uppercase font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;