import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { LogOut, Bell, Menu } from "lucide-react";
import Badge from "./ui/Badge";

const Navbar = ({ onToggleSidebar, title = "ExamSphere", roleLabel = "Admin" }) => {
  const { user, role, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const displayName = user?.fullName || (role === "ADMIN" ? "Administrator" : "Student");

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-400 transition-colors"
            style={{ borderRadius: "0px" }}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide text-zinc-950">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-zinc-600 hover:text-zinc-950 border border-zinc-200 hover:border-zinc-400 transition-colors relative"
            style={{ borderRadius: "0px" }}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-zinc-950 ring-1 ring-white" />
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-72 bg-white border border-zinc-900 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100"
              style={{ borderRadius: "0px" }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
                  Notifications
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-900 uppercase"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-zinc-50 border border-zinc-200">
                  <p className="font-semibold text-zinc-900">System Ready</p>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Welcome to ExamSphere. Examination server is online.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-zinc-200">
          <div className="w-8 h-8 bg-zinc-950 text-white font-mono font-bold text-xs flex items-center justify-center border border-zinc-950">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-zinc-900 leading-none">{displayName}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge size="xs" variant="default">
                {role || roleLabel}
              </Badge>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase font-semibold text-zinc-700 hover:text-white hover:bg-zinc-950 border border-zinc-300 hover:border-zinc-950 transition-all cursor-pointer"
          style={{ borderRadius: "0px" }}
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;