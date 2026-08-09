import React, { useEffect, useState } from "react";
import { getAdminExamAttempts } from "../../services/attemptService";
import { getAllExams } from "../../services/examService";
import PageHeader from "../../components/ui/PageHeader";
import { Input } from "../../components/ui/Input";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { ClipboardList, Search, CheckCircle2, XCircle } from "lucide-react";

const Submissions = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAdminExamAttempts();
      setAttempts(data || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAttempts = attempts.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.studentName?.toLowerCase().includes(q) ||
      a.studentEmail?.toLowerCase().includes(q) ||
      a.examTitle?.toLowerCase().includes(q) ||
      String(a.id).includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Submissions Audit Log"
        subtitle="Platform-wide examination attempt logs, evaluation records, and timestamps"
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin/dashboard" }, { label: "Submissions" }]}
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            id="search"
            placeholder="Search candidate, exam title..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end sm:self-center">
          Total Attempts: <span className="font-bold text-zinc-950">{filteredAttempts.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading test submission audit records..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Submissions"
          message="Could not retrieve platform submissions log."
          onRetry={loadData}
        />
      ) : filteredAttempts.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No candidate submissions logged"
          description="Submissions will be automatically recorded here as candidates complete assessments."
        />
      ) : (
        <Table
          headers={[
            { label: "Attempt ID", className: "w-28" },
            { label: "Candidate Name" },
            { label: "Exam Title" },
            { label: "Score" },
            { label: "Pass/Fail Status" },
            { label: "Submission Time" },
          ]}
        >
          {filteredAttempts.map((a) => (
            <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
              <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">#{a.id}</td>
              <td className="py-3.5 px-4">
                <p className="font-bold text-xs text-zinc-950">{a.studentName}</p>
                <p className="text-[10px] font-mono text-zinc-500">{a.studentEmail || "Student"}</p>
              </td>
              <td className="py-3.5 px-4 text-xs font-semibold text-zinc-900">{a.examTitle}</td>
              <td className="py-3.5 px-4 font-mono text-xs font-bold text-zinc-950">
                {a.score ?? 0} / {a.totalMarks || 100}
              </td>
              <td className="py-3.5 px-4">
                {a.passed ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3" /> PASSED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5">
                    <XCircle className="w-3 h-3" /> FAILED
                  </span>
                )}
              </td>
              <td className="py-3.5 px-4 font-mono text-xs text-zinc-500">
                {a.endTime ? new Date(a.endTime).toLocaleString() : a.startTime ? new Date(a.startTime).toLocaleString() : "—"}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};

export default Submissions;
