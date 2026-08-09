import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";
import {
  ClipboardList,
  Search,
  Eye,
} from "lucide-react";

const Attempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("student_attempts") || "[]");
    setAttempts(saved);
  }, []);

  const filteredAttempts = attempts.filter((att) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      att.examTitle?.toLowerCase().includes(q) ||
      att.subjectName?.toLowerCase().includes(q) ||
      String(att.id).includes(q);

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "PASSED" && att.passed) ||
      (statusFilter === "FAILED" && !att.passed);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Examination Attempts"
        subtitle="Review your historical examination scorecards and evaluation records"
        breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "My Attempts" }]}
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="w-full sm:w-80">
            <Input
              id="search"
              placeholder="Search attempts by exam title..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              style={{ borderRadius: "0px" }}
              className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Results ({attempts.length})</option>
              <option value="PASSED">Passed Only</option>
              <option value="FAILED">Failed Only</option>
            </select>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end sm:self-center">
          Total Attempts: <span className="font-bold text-zinc-950">{attempts.length}</span>
        </div>
      </div>

      {filteredAttempts.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={searchQuery || statusFilter ? "No matching attempts" : "No examination attempts recorded"}
          description={
            searchQuery || statusFilter
              ? "Try adjusting your search criteria."
              : "You have not completed any online examinations yet. Start an assessment to see your scores here."
          }
          actionText={searchQuery || statusFilter ? undefined : "Browse Available Exams"}
          onAction={
            searchQuery || statusFilter
              ? undefined
              : () => (window.location.href = "/student/exams")
          }
        />
      ) : (
        <Table
          headers={[
            { label: "Attempt ID", className: "w-28" },
            { label: "Examination Title" },
            { label: "Subject" },
            { label: "Date & Time" },
            { label: "Score / Total" },
            { label: "Percentage" },
            { label: "Status" },
            { label: "Action", className: "text-right w-36" },
          ]}
        >
          {filteredAttempts.map((att) => {
            const percentage = att.totalMarks
              ? Math.round(((att.score || 0) / att.totalMarks) * 100)
              : 0;

            return (
              <tr key={att.id} className="hover:bg-zinc-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">#{att.id}</td>
                <td className="py-3.5 px-4 font-bold text-zinc-950 uppercase tracking-tight">
                  {att.examTitle || "Exam #" + att.examId}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-zinc-600">
                  {att.subjectName || "—"}
                </td>
                <td className="py-3.5 px-4 font-mono text-xs text-zinc-500">
                  {att.date ? new Date(att.date).toLocaleDateString() : "Recent"}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                  {att.score} / {att.totalMarks}
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                  {percentage}%
                </td>
                <td className="py-3.5 px-4">
                  <Badge>{att.passed ? "PASSED" : "FAILED"}</Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/student/results/${att.id}`}
                    state={{ result: att }}
                  >
                    <Button variant="secondary" size="sm" icon={Eye}>
                      Scorecard
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </div>
  );
};

export default Attempts;
