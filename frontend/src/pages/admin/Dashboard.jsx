import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllExams } from "../../services/examService";
import { getQuestions } from "../../services/questionService";
import { getSubjects } from "../../services/subjectService";
import { getCategories } from "../../services/categoryService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import {
  FileCheck,
  HelpCircle,
  BookOpen,
  Layers,
  Plus,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Mail,
  User,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const adminName = user?.fullName || "System Administrator";
  const adminEmail = user?.email || "admin@examsphere.com";

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [examsData, questionsData, subjectsData, categoriesData] = await Promise.all([
        getAllExams().catch(() => []),
        getQuestions().catch(() => []),
        getSubjects().catch(() => []),
        getCategories().catch(() => []),
      ]);

      setExams(examsData || []);
      setQuestions(questionsData || []);
      setSubjects(subjectsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader text="Loading Administrator Dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Dashboard Data"
        message="Unable to fetch system metrics. Please verify the backend service is running."
        onRetry={fetchDashboardData}
      />
    );
  }

  const publishedExamsCount = exams.filter((e) => e.status === "PUBLISHED").length;
  const recentExams = [...exams].reverse().slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner with Admin Info & Quick Logout */}
      <div
        style={{ borderRadius: "0px" }}
        className="bg-zinc-950 text-white p-6 sm:p-8 border border-zinc-800 shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-[11px] font-mono uppercase tracking-widest text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Administrator Session</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Welcome, Admin
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                You have full administrative control over examination creation, subject modules, and question banks.
              </p>
            </div>
            {/* Admin Details */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 border border-zinc-800">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-400">Admin Name:</span>
                <span className="font-bold text-white">{adminName}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 border border-zinc-800">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-400">Email:</span>
                <span className="font-bold text-white">{adminEmail}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 border border-zinc-800">
                <span className="text-zinc-400">Role:</span>
                <span className="font-bold text-emerald-400">ADMIN</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/admin/exams">
              <Button variant="primary" size="md" icon={Plus} className="font-bold">
                Create Exam
              </Button>
            </Link>
            <button
              onClick={handleLogout}
              style={{ borderRadius: "0px" }}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900 border border-rose-800/80 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <PageHeader
        title="Administrative Overview"
        subtitle="Live platform metrics and academic resource distribution"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Exams"
          value={exams.length}
          subtitle={`${publishedExamsCount} currently published`}
          icon={FileCheck}
        />
        <StatCard
          title="Total Questions"
          value={questions.length}
          subtitle="Across all subjects"
          icon={HelpCircle}
        />
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          subtitle="Active academic modules"
          icon={BookOpen}
        />
        <StatCard
          title="Categories"
          value={categories.length}
          subtitle="Domain classifications"
          icon={Layers}
        />
      </div>

      <Card
        title="Quick Management Actions"
        subtitle="Create and configure new examination assets in one click"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/admin/exams" className="block">
            <div className="p-4 border border-zinc-200 hover:border-zinc-950 bg-zinc-50 hover:bg-white transition-all text-left">
              <FileCheck className="w-5 h-5 text-zinc-950 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-950">Add Exam</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Schedule new test</p>
            </div>
          </Link>
          <Link to="/admin/questions" className="block">
            <div className="p-4 border border-zinc-200 hover:border-zinc-950 bg-zinc-50 hover:bg-white transition-all text-left">
              <HelpCircle className="w-5 h-5 text-zinc-950 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-950">Add Question</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Build question pool</p>
            </div>
          </Link>
          <Link to="/admin/subjects" className="block">
            <div className="p-4 border border-zinc-200 hover:border-zinc-950 bg-zinc-50 hover:bg-white transition-all text-left">
              <BookOpen className="w-5 h-5 text-zinc-950 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-950">Add Subject</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Link to category</p>
            </div>
          </Link>
          <Link to="/admin/categories" className="block">
            <div className="p-4 border border-zinc-200 hover:border-zinc-950 bg-zinc-50 hover:bg-white transition-all text-left">
              <Layers className="w-5 h-5 text-zinc-950 mb-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-950">Add Category</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Define discipline</p>
            </div>
          </Link>
        </div>
      </Card>

      <Card
        title="Recent Examinations"
        subtitle="Latest exams configured on the platform"
        action={
          <Link to="/admin/exams">
            <Button variant="ghost" size="sm">
              View All ({exams.length}) <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </Button>
          </Link>
        }
      >
        {recentExams.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-zinc-500">
            No exams created yet. Click "Create Exam" to schedule your first test.
          </div>
        ) : (
          <Table
            headers={[
              { label: "ID", className: "w-16" },
              { label: "Exam Title" },
              { label: "Subject" },
              { label: "Duration" },
              { label: "Marks (Total/Pass)" },
              { label: "Status" },
              { label: "Action", className: "text-right" },
            ]}
          >
            {recentExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-zinc-50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-zinc-500">#{exam.id}</td>
                <td className="py-3 px-4 font-semibold text-zinc-950">{exam.title}</td>
                <td className="py-3 px-4 font-mono text-zinc-600">{exam.subjectName || "—"}</td>
                <td className="py-3 px-4 font-mono">{exam.duration} mins</td>
                <td className="py-3 px-4 font-mono">
                  {exam.totalMarks} / {exam.passingMarks}
                </td>
                <td className="py-3 px-4">
                  <Badge>{exam.status}</Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link to="/admin/exams">
                    <Button variant="secondary" size="sm">
                      Manage
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;