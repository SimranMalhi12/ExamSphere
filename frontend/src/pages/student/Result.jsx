import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  Award,
  ArrowRight,
} from "lucide-react";

const Result = () => {
  const { attemptId } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);

  useEffect(() => {
    if (!result) {
      const savedAttempts = JSON.parse(localStorage.getItem("student_attempts") || "[]");
      if (attemptId) {
        const found = savedAttempts.find((a) => String(a.id) === String(attemptId));
        if (found) setResult(found);
      } else if (savedAttempts.length > 0) {
        setResult(savedAttempts[0]);
      }
    }
  }, [attemptId, result]);

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center py-12">
        <Card className="p-8">
          <Award className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-950">
            No Exam Result Selected
          </h2>
          <p className="text-xs text-zinc-500 mt-2 mb-6">
            You haven't completed an exam in this session or no attempt ID was provided.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/student/exams">
              <Button variant="primary" size="md">
                Browse Exams
              </Button>
            </Link>
            <Link to="/student/attempts">
              <Button variant="secondary" size="md">
                View Past Attempts
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const percentage = result.totalMarks
    ? Math.round(((result.score || 0) / result.totalMarks) * 100)
    : 0;
  const isPassed = result.passed ?? percentage >= 40;
  const totalQ = result.totalQuestions || 1;
  const correctQ = result.correctAnswers || 0;
  const incorrectQ = Math.max(0, totalQ - correctQ);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Examination Scorecard"
        subtitle="Official candidate assessment performance breakdown"
        breadcrumbs={[
          { label: "Student", href: "/student/dashboard" },
          { label: "Attempts", href: "/student/attempts" },
          { label: "Result" },
        ]}
      />

      <div
        style={{ borderRadius: "0px" }}
        className={`p-8 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          isPassed
            ? "bg-emerald-950 text-white border-emerald-800"
            : "bg-zinc-950 text-white border-zinc-800"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300">
              {result.subjectName || "Subject Assessment"}
            </span>
            <span
              className={`text-xs font-mono font-bold uppercase px-3 py-0.5 border ${
                isPassed
                  ? "bg-emerald-500 text-zinc-950 border-emerald-400"
                  : "bg-rose-600 text-white border-rose-500"
              }`}
            >
              {isPassed ? "PASSED" : "FAILED"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mt-2">
            {result.examTitle || "Assessment Examination"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Attempt ID: #{result.id} • Completed {result.date ? new Date(result.date).toLocaleString() : "Recently"}
          </p>
        </div>

        <div className="p-6 bg-zinc-900/90 border border-zinc-800 text-center shrink-0 min-w-[200px]">
          <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
            {result.score} <span className="text-xl text-zinc-500">/ {result.totalMarks}</span>
          </div>
          <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
            {percentage}% Score
          </div>
          <p className="text-[10px] font-mono uppercase text-zinc-400 mt-1">
            Passing Required: {result.passingMarks} pts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-white border border-zinc-200 text-center">
          <span className="text-zinc-500 uppercase text-[10px] block">Total Questions</span>
          <span className="text-xl font-bold text-zinc-950 mt-1 block">{totalQ}</span>
        </div>
        <div className="p-4 bg-white border border-zinc-200 text-center">
          <span className="text-zinc-500 uppercase text-[10px] block">Correct Answers</span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">{correctQ}</span>
        </div>
        <div className="p-4 bg-white border border-zinc-200 text-center">
          <span className="text-zinc-500 uppercase text-[10px] block">Incorrect / Skipped</span>
          <span className="text-xl font-bold text-rose-700 mt-1 block">{incorrectQ}</span>
        </div>
        <div className="p-4 bg-white border border-zinc-200 text-center">
          <span className="text-zinc-500 uppercase text-[10px] block">Accuracy Rate</span>
          <span className="text-xl font-bold text-zinc-950 mt-1 block">
            {Math.round((correctQ / totalQ) * 100)}%
          </span>
        </div>
      </div>

      <Card title="Assessment Feedback" subtitle="Candidate performance evaluation summary">
        <div className="space-y-4 text-xs text-zinc-700">
          <p className="leading-relaxed">
            {isPassed
              ? `Congratulations! You have successfully passed this examination with a score of ${result.score}/${result.totalMarks} (${percentage}%). Your score meets or exceeds the required passing standard of ${result.passingMarks} marks.`
              : `Your score of ${result.score}/${result.totalMarks} (${percentage}%) did not meet the minimum passing threshold of ${result.passingMarks} marks. We recommend reviewing syllabus concepts before re-attempting.`}
          </p>

          <div className="p-4 bg-zinc-50 border border-zinc-200 flex items-center justify-between">
            <span className="font-mono text-zinc-600 font-semibold">Evaluation Status:</span>
            <span className="font-mono font-bold text-zinc-950 uppercase">
              Algorithmic Grade Verified
            </span>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Link to="/student/attempts">
          <Button variant="secondary" size="md">
            ← View All Attempts
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/student/dashboard">
            <Button variant="secondary" size="md">
              Dashboard
            </Button>
          </Link>
          <Link to="/student/exams">
            <Button variant="primary" size="md" icon={ArrowRight}>
              Take Another Exam
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;