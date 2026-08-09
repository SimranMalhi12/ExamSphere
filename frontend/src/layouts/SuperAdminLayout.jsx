import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  ShieldAlert,
  Users,
  BookOpen,
  GraduationCap,
  FileCheck2,
  UserCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Shield,
  Activity,
} from "lucide-react";

const SuperAdminLayout = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Super Administrator signed out successfully.");
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Platform Overview", path: "/super-admin/dashboard", icon: LayoutDashboard },
    { name: "Admin Provisioning", path: "/super-admin/admins", icon: Users },
    { name: "Global Exams", path: "/super-admin/exams", icon: BookOpen },
    { name: "Candidate Directory", path: "/super-admin/students", icon: GraduationCap },
    { name: "Audit Submissions", path: "/super-admin/submissions", icon: FileCheck2 },
    { name: "Master Profile", path: "/super-admin/profile", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-400 text-zinc-950 font-black font-mono flex items-center justify-center text-sm border border-amber-300">
            S
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-white block">
              ExamSphere
            </span>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
              Super Admin Console
            </span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-zinc-800 text-zinc-200 border border-zinc-700 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between z-30 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Branding */}
          <div className="p-5 border-b border-zinc-800">
            <Link to="/super-admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-amber-400 text-zinc-950 font-black font-mono flex items-center justify-center text-base border border-amber-300 shadow-md">
                S
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider uppercase text-white block">
                  ExamSphere
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    Super Admin
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* User Status Card */}
          <div className="p-4 mx-3 my-3 bg-zinc-950/70 border border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-bold font-mono text-xs">
                SA
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">
                  {user?.fullName || "Super Administrator"}
                </p>
                <p className="text-[10px] font-mono text-zinc-400 truncate">
                  {user?.email || "superadmin@examsphere.com"}
                </p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3 h-3" /> Full Authority
              </span>
              <span className="bg-amber-400/10 text-amber-400 px-1.5 py-0.5 border border-amber-400/20">
                ROOT
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border ${
                      isActive
                        ? "bg-amber-400 text-zinc-950 border-amber-300 font-bold shadow-md"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/80 border-transparent"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Core Service</span>
            </span>
            <span className="text-emerald-400 font-bold uppercase">Online</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-950 border border-zinc-800 text-rose-400 hover:bg-rose-950/30 hover:border-rose-800 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-zinc-950 min-h-screen p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
