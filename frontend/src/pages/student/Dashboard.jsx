import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllExams } from "../../services/examService";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import {
  FileCheck,
  Award,
  Clock,
  ArrowRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem("student_attempts");
    return saved ? JSON.parse(saved) : [];
  });

  const studentName = user?.fullName || "Student";

  const fetchExams = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllExams();
      setExams(data || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) {
    return <Loader text="Loading Student Dashboard..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to Load Dashboard"
        message="Could not connect to the examination service."
        onRetry={fetchExams}
      />
    );
  }

  const availableExams = exams.filter(
    (e) => e.status === "PUBLISHED" || e.status === "DRAFT" || !e.status
  );

  const passedAttempts = attempts.filter((a) => a.passed);
  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / attempts.length
        )
      : 0;

  return (
    <div className="space-y-8">
      <div
        style={{ borderRadius: "0px" }}
        className="bg-zinc-950 text-white p-6 sm:p-8 border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase tracking-widest text-zinc-300 mb-3">
            <span className="w-1.5 h-1.5 bg-emerald-400 inline-block" /> Candidate Assessment Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Welcome back, {studentName}!
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
            You have active examinations available for evaluation. Check duration and guidelines before beginning tests.
          </p>
        </div>

        <div className="shrink-0">
          <Link to="/student/exams">
            <Button variant="secondary" size="lg" icon={ArrowRight}>
              Browse Exams
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Exams"
          value={availableExams.length}
          subtitle="Ready to attempt"
          icon={FileCheck}
        />
        <StatCard
          title="Exams Attempted"
          value={attempts.length}
          subtitle="Tests completed"
          icon={Clock}
        />
        <StatCard
          title="Passed Exams"
          value={passedAttempts.length}
          subtitle={`${attempts.length > 0 ? Math.round((passedAttempts.length / attempts.length) * 100) : 0}% success rate`}
          icon={Award}
        />
        <StatCard
          title="Average Score"
          value={attempts.length > 0 ? `${averageScore}%` : "—"}
          subtitle="Cumulative score"
          icon={TrendingUp}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-950">
              Available Examinations
            </h2>
            <p className="text-xs text-zinc-500">
              Select an assessment to review instructions and start testing
            </p>
          </div>
          <Link to="/student/exams">
            <Button variant="ghost" size="sm">
              View All ({availableExams.length}) <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </Button>
          </Link>
        </div>

        {availableExams.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-xs font-mono text-zinc-500">
              No exams are currently available for your profile. Please check back later.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableExams.slice(0, 6).map((exam) => (
              <div
                key={exam.id}
                style={{ borderRadius: "0px" }}
                className="bg-white border border-zinc-200 p-5 flex flex-col justify-between hover:border-zinc-950 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-bold text-zinc-700">
                      {exam.subjectName || "Academic"}
                    </span>
                    <Badge size="xs">{exam.status || "PUBLISHED"}</Badge>
                  </div>

                  <h3 className="text-base font-bold text-zinc-950 uppercase tracking-tight line-clamp-1 mt-1">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 min-h-[32px]">
                    {exam.description || "Comprehensive assessment covering syllabus requirements."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 my-4 p-2.5 bg-zinc-50 border border-zinc-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">Time</span>
                      <span className="font-mono font-bold text-zinc-900">{exam.duration}m</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">Marks</span>
                      <span className="font-mono font-bold text-zinc-900">{exam.totalMarks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">Pass</span>
                      <span className="font-mono font-bold text-emerald-700">{exam.passingMarks}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/student/exam/${exam.id}`} className="block mt-2">
                  <Button variant="primary" size="sm" className="w-full">
                    Start Exam
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Card
        title="Online Examination Guidelines"
        subtitle="Important reminders before commencing live assessments"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-700">
          <div className="p-3 bg-zinc-50 border border-zinc-200">
            <p className="font-bold uppercase tracking-wider text-zinc-950 mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-950" /> Automated Timer
            </p>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Once you start an exam, the countdown runs continuously and cannot be paused. Tests auto-submit when the timer reaches 00:00.
            </p>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200">
            <p className="font-bold uppercase tracking-wider text-zinc-950 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-zinc-950" /> Question Palette
            </p>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Use the question palette to jump between questions. Answered questions are marked in emerald so you can review before submitting.
            </p>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200">
            <p className="font-bold uppercase tracking-wider text-zinc-950 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-zinc-950" /> Instant Results
            </p>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Your test is automatically evaluated as soon as you confirm submission, showing your scorecard, percentage, and pass/fail status.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;