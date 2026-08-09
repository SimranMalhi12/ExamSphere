import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPlatformStats, getAllAdmins } from "../../services/superAdminService";
import { getAllExams } from "../../services/examService";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  FileCheck,
  HelpCircle,
  Award,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [statsData, adminsData, examsData] = await Promise.all([
        getPlatformStats(),
        getAllAdmins().catch(() => []),
        getAllExams().catch(() => []),
      ]);
      setStats(statsData);
      setAdmins(adminsData || []);
      setExams(examsData || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loader text="Loading Super Admin Governance Dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Governance Metrics"
        message="Unable to communicate with the Super Admin subsystem. Please ensure the backend is active."
        onRetry={loadData}
      />
    );
  }

  const recentAdmins = [...admins].reverse().slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Super Admin Top Governance Banner */}
      <div className="p-5 bg-zinc-950 text-white border-2 border-zinc-950 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 bg-white text-zinc-950 flex items-center justify-center font-bold text-base shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold uppercase tracking-widest text-white">
                Super Admin Governance Hub
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-amber-400 text-zinc-950">
                Root Access
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Full control over administrator provisioning, platform permissions, exam integrity, and system logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/super-admin/admins">
            <Button variant="primary" size="sm" icon={Plus} className="bg-white text-zinc-950 hover:bg-zinc-200">
              Provision Admin
            </Button>
          </Link>
        </div>
      </div>

      <PageHeader
        title="System Analytics & Governance"
        subtitle="Platform-wide metrics across all administrators, created tests, questions, and candidate results."
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin/dashboard" }, { label: "Overview" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Administrators"
          value={stats?.totalAdmins ?? admins.length}
          subtitle="Provisioned admin accounts"
          icon={ShieldCheck}
        />
        <StatCard
          title="Student Candidates"
          value={stats?.totalStudents ?? 0}
          subtitle="Registered exam takers"
          icon={Users}
        />
        <StatCard
          title="Global Examinations"
          value={stats?.totalExams ?? exams.length}
          subtitle="Across all admins"
          icon={FileCheck}
        />
        <StatCard
          title="Candidate Submissions"
          value={stats?.totalAttempts ?? 0}
          subtitle={`Pass Rate: ${stats?.passRate ?? 0}%`}
          icon={Award}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Provisioning & Governance Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card
            title="Governance Actions"
            subtitle="Admin lifecycle & policy management"
          >
            <div className="space-y-3">
              <Link to="/super-admin/admins" className="block">
                <div className="p-3.5 border border-zinc-200 hover:border-zinc-950 bg-zinc-50 hover:bg-white transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-950 text-white shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-zinc-950">Manage Admins</p>
                      <p className="text-[11px] text-zinc-500">Create, edit permissions, suspend</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              </Link>

              <Link to="/super-admin/exams" className="block">
                <div className="p-3.5 border border-zinc-200 hover:border-zinc-950 bg-zinc-50 hover:bg-white transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-950 text-white shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-zinc-950">Global Exams Catalogue</p>
                      <p className="text-[11px] text-zinc-500">Inspect all active and closed exams</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              </Link>

              <Link to="/super-admin/students" className="block">
                <div className="p-3.5 border border-zinc-200 hover:border-zinc-950 bg-zinc-50 hover:bg-white transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-950 text-white shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-zinc-950">Candidates Directory</p>
                      <p className="text-[11px] text-zinc-500">View registered exam takers</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              </Link>

              <Link to="/super-admin/submissions" className="block">
                <div className="p-3.5 border border-zinc-200 hover:border-zinc-950 bg-zinc-50 hover:bg-white transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-950 text-white shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-zinc-950">Submissions Log</p>
                      <p className="text-[11px] text-zinc-500">Examine platform attempt records</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </div>
              </Link>
            </div>
          </Card>

          {/* System Breakdown Card */}
          <div className="p-4 bg-white border border-zinc-200">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" /> Resource Breakdown
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Question Pool:</span>
                <span className="font-bold text-zinc-950">{stats?.totalQuestions ?? 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Academic Subjects:</span>
                <span className="font-bold text-zinc-950">{stats?.totalSubjects ?? 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Discipline Categories:</span>
                <span className="font-bold text-zinc-950">{stats?.totalCategories ?? 0}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Successful Tests:</span>
                <span className="font-bold text-emerald-700">{stats?.passedAttempts ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Provisioned Administrators Table */}
        <div className="lg:col-span-2">
          <Card
            title="Provisioned Administrators"
            subtitle="Active admin workspaces and permissions"
            action={
              <Link to="/super-admin/admins">
                <Button variant="ghost" size="sm">
                  Manage All ({admins.length}) <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                </Button>
              </Link>
            }
          >
            {recentAdmins.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                No administrators provisioned yet. Click "Provision Admin" to create the first admin account.
              </div>
            ) : (
              <Table
                headers={[
                  { label: "Admin" },
                  { label: "Created Exams" },
                  { label: "Permissions" },
                  { label: "Status" },
                  { label: "Action", className: "text-right" },
                ]}
              >
                {recentAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-xs text-zinc-950">{admin.fullName}</p>
                      <p className="text-[10px] font-mono text-zinc-500">{admin.email}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs font-semibold text-zinc-800">
                      {admin.examsCount ?? 0} exams
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {admin.canCreateExams && (
                          <span className="text-[9px] font-mono font-bold uppercase bg-zinc-100 border border-zinc-300 px-1 py-0.5">
                            Exams
                          </span>
                        )}
                        {admin.canManageQuestions && (
                          <span className="text-[9px] font-mono font-bold uppercase bg-zinc-100 border border-zinc-300 px-1 py-0.5">
                            Questions
                          </span>
                        )}
                        {admin.canManageSubjects && (
                          <span className="text-[9px] font-mono font-bold uppercase bg-zinc-100 border border-zinc-300 px-1 py-0.5">
                            Subjects
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {admin.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5">
                          <CheckCircle2 className="w-3 h-3" /> ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-300 px-1.5 py-0.5">
                          <XCircle className="w-3 h-3" /> SUSPENDED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to="/super-admin/admins">
                        <Button variant="secondary" size="xs">
                          Configure
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
