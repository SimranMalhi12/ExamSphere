import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyExams } from "../../services/examService";
import { getQuestions } from "../../services/questionService";
import { getSubjects } from "../../services/subjectService";
import { getCategories } from "../../services/categoryService";
import { getAdminExamAttempts } from "../../services/attemptService";
import { useAuth } from "../../context/AuthContext";
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
  Users,
  Key,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [examsData, questionsData, subjectsData, categoriesData, attemptsData] = await Promise.all([
        getMyExams().catch(() => []),
        getQuestions().catch(() => []),
        getSubjects().catch(() => []),
        getCategories().catch(() => []),
        getAdminExamAttempts().catch(() => []),
      ]);

      setExams(examsData || []);
      setQuestions(questionsData || []);
      setSubjects(subjectsData || []);
      setCategories(categoriesData || []);
      setAttempts(attemptsData || []);
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
  const recentAttempts = [...attempts].reverse().slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Personalized Multi-Admin Workspace Banner */}
      <div className="p-5 bg-white border border-zinc-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 bg-zinc-950 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold uppercase tracking-tight text-zinc-950">
                {user?.fullName || "Administrator"} Workspace
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300">
                Isolated Environment
              </span>
            </div>
            <p className="text-xs text-zinc-600 mt-0.5">
              Admin Account: <span className="font-mono text-zinc-900 font-semibold">{user?.email || "Current Admin"}</span> • Exams created here are private and isolated to your portal.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center">
          <Link to="/admin/exams">
            <Button variant="primary" size="sm" icon={Plus}>
              New Exam
            </Button>
          </Link>
        </div>
      </div>

      <PageHeader
        title="Admin Overview & Metrics"
        subtitle="Live status of your isolated question banks, created exams, and candidate test submissions."
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Exams"
          value={exams.length}
          subtitle={`${publishedExamsCount} currently published`}
          icon={FileCheck}
        />
        <StatCard
          title="Question Bank"
          value={questions.length}
          subtitle="Questions in your catalogue"
          icon={HelpCircle}
        />
        <StatCard
          title="Subjects & Topics"
          value={subjects.length}
          subtitle="Configured disciplines"
          icon={BookOpen}
        />
        <StatCard
          title="Candidate Submissions"
          value={attempts.length}
          subtitle="Tests completed by students"
          icon={Users}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams Section */}
        <Card
          title="My Examinations"
          subtitle="Your created tests and unique access codes"
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
                { label: "Code / ID", className: "w-28" },
                { label: "Exam Title" },
                { label: "Subject" },
                { label: "Status" },
                { label: "Action", className: "text-right" },
              ]}
            >
              {recentExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-mono font-bold bg-zinc-100 border border-zinc-300 px-1.5 py-0.5 block text-center">
                      {exam.accessCode || `#${exam.id}`}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-zinc-950 truncate max-w-[160px]">{exam.title}</td>
                  <td className="py-3 px-4 font-mono text-xs text-zinc-600 truncate max-w-[120px]">{exam.subjectName || "—"}</td>
                  <td className="py-3 px-4">
                    <Badge size="xs">{exam.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link to="/admin/exams">
                      <Button variant="secondary" size="xs">
                        Manage
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        {/* Recent Candidate Submissions Section */}
        <Card
          title="Candidate Submissions"
          subtitle="Latest student attempts on your exams"
          action={
            <span className="text-xs font-mono text-zinc-500">
              Total: {attempts.length}
            </span>
          }
        >
          {recentAttempts.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-zinc-500">
              No candidate submissions recorded yet. Share your exam access code with students to begin receiving results.
            </div>
          ) : (
            <Table
              headers={[
                { label: "Student" },
                { label: "Exam" },
                { label: "Score" },
                { label: "Result" },
              ]}
            >
              {recentAttempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-xs text-zinc-950">{attempt.studentName}</p>
                    <p className="text-[10px] font-mono text-zinc-500">{attempt.studentEmail || "Student"}</p>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-zinc-800 truncate max-w-[140px]">
                    {attempt.examTitle}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-xs">
                    {attempt.score ?? 0} / {attempt.totalMarks || 100}
                  </td>
                  <td className="py-3 px-4">
                    {attempt.passed ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                        <CheckCircle2 className="w-3 h-3" /> PASSED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5">
                        <XCircle className="w-3 h-3" /> FAILED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;