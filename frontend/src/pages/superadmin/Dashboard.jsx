import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPlatformStats, getAllAdmins, getAllAttempts } from "../../services/superAdminService";
import { useToast } from "../../context/ToastContext";
import {
  Users,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  FileCheck2,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  ArrowUpRight,
  ShieldX,
  CheckCircle2,
} from "lucide-react";

const SuperAdminDashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, adminsData, attemptsData] = await Promise.all([
        getPlatformStats(),
        getAllAdmins(),
        getAllAttempts(),
      ]);
      setStats(statsData);
      setAdmins(adminsData || []);
      setRecentAttempts((attemptsData || []).slice(-5).reverse());
    } catch (err) {
      toast.error("Failed to load platform overview metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          Gathering Platform Analytics...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Admins",
      value: stats?.totalAdmins ?? 0,
      subtext: `${stats?.activeAdmins ?? 0} Active • ${stats?.suspendedAdmins ?? 0} Suspended`,
      icon: Users,
      color: "border-amber-500/30 text-amber-400 bg-amber-500/5",
    },
    {
      title: "Total Candidates",
      value: stats?.totalStudents ?? 0,
      subtext: "Registered students",
      icon: GraduationCap,
      color: "border-blue-500/30 text-blue-400 bg-blue-500/5",
    },
    {
      title: "Global Exams",
      value: stats?.totalExams ?? 0,
      subtext: `${stats?.totalSubjects ?? 0} Subjects across ${stats?.totalCategories ?? 0} Categories`,
      icon: BookOpen,
      color: "border-purple-500/30 text-purple-400 bg-purple-500/5",
    },
    {
      title: "Question Bank",
      value: stats?.totalQuestions ?? 0,
      subtext: "Validated question items",
      icon: HelpCircle,
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
    },
    {
      title: "Total Attempts",
      value: stats?.totalAttempts ?? 0,
      subtext: `${stats?.platformPassRate ?? 0}% Platform Pass Rate`,
      icon: FileCheck2,
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
    },
    {
      title: "Average Score",
      value: `${stats?.platformAverageScore ?? 0}%`,
      subtext: "Overall candidate average",
      icon: TrendingUp,
      color: "border-rose-500/30 text-rose-400 bg-rose-500/5",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-400 text-zinc-950 text-[10px] font-mono font-black uppercase tracking-widest">
              Root Authority
            </span>
            <span className="text-xs font-mono text-zinc-500">Live Platform Monitor</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
            Super Admin Control Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Oversee administrator permissions, examination volumes, candidate cohorts, and security policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <Link
            to="/super-admin/admins"
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-amber-400/10"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision Admin</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-5 border bg-zinc-900/60 ${stat.color} transition-all hover:bg-zinc-900/90`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  {stat.title}
                </span>
                <Icon className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-black font-mono text-white mt-3">{stat.value}</p>
              <p className="text-[11px] font-mono text-zinc-400 mt-1">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Active Admins Overview & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provisioned Admins Widget */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Provisioned Administrators ({admins.length})
              </h2>
            </div>
            <Link
              to="/super-admin/admins"
              className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1 uppercase"
            >
              Manage All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {admins.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800">
              <p className="text-xs text-zinc-500 font-mono">No provisioned administrators yet.</p>
              <Link
                to="/super-admin/admins"
                className="mt-2 inline-block text-xs font-bold text-amber-400 hover:underline uppercase"
              >
                + Provision First Admin
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {admins.slice(0, 4).map((admin) => (
                <div
                  key={admin.id}
                  className="p-3 bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{admin.fullName}</p>
                      {admin.isActive ? (
                        <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono uppercase">
                          Active
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 bg-rose-950 text-rose-400 border border-rose-800 text-[9px] font-mono uppercase">
                          Suspended
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">{admin.email}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    {admin.canCreateExams && (
                      <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300">
                        Exams
                      </span>
                    )}
                    {admin.canManageQuestions && (
                      <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300">
                        Questions
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Attempts Widget */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Recent Audit Submissions
              </h2>
            </div>
            <Link
              to="/super-admin/submissions"
              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 uppercase"
            >
              Audit Log <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-800">
              <p className="text-xs text-zinc-500 font-mono">No exam submissions recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-3 bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{attempt.examTitle}</p>
                    <p className="text-[10px] font-mono text-zinc-400 truncate">
                      Candidate: {attempt.studentName} ({attempt.studentEmail})
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-mono font-bold ${
                        attempt.passed ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {attempt.score ?? 0}%
                    </span>
                    <p className="text-[9px] font-mono text-zinc-500 uppercase">
                      {attempt.passed ? "Passed" : "Failed"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
