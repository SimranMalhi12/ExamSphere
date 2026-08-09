import React, { useEffect, useState } from "react";
import { getAllExams } from "../../services/examService";
import { getAllAdmins } from "../../services/superAdminService";
import { getSubjects } from "../../services/subjectService";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { FileCheck, Search, KeyRound, User } from "lucide-react";

const AllExams = () => {
  const [exams, setExams] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [examsData, adminsData, subjectsData] = await Promise.all([
        getAllExams(),
        getAllAdmins().catch(() => []),
        getSubjects().catch(() => []),
      ]);
      setExams(examsData || []);
      setAdmins(adminsData || []);
      setSubjects(subjectsData || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredExams = exams.filter((exam) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      exam.title?.toLowerCase().includes(q) ||
      exam.accessCode?.toLowerCase().includes(q) ||
      exam.subjectName?.toLowerCase().includes(q) ||
      exam.createdByName?.toLowerCase().includes(q) ||
      String(exam.id).includes(q);

    const matchesAdmin =
      !selectedAdmin || String(exam.createdById) === selectedAdmin || exam.createdByName === selectedAdmin;

    const matchesSubject =
      !selectedSubject || String(exam.subjectId) === selectedSubject;

    return matchesSearch && matchesAdmin && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Examinations Repository"
        subtitle="Supervisory overview of all tests configured across every administrator in the system"
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin/dashboard" }, { label: "Global Exams" }]}
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
          <div className="w-full sm:w-72">
            <Input
              id="search"
              placeholder="Search title, access code, instructor..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              style={{ borderRadius: "0px" }}
              className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
              value={selectedAdmin}
              onChange={(e) => setSelectedAdmin(e.target.value)}
            >
              <option value="">All Administrators ({admins.length})</option>
              {admins.map((admin) => (
                <option key={admin.id} value={String(admin.id)}>
                  {admin.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-48">
            <select
              style={{ borderRadius: "0px" }}
              className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects ({subjects.length})</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={String(subj.id)}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end lg:self-center">
          Total Exams: <span className="font-bold text-zinc-950">{filteredExams.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading global examinations..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Examinations"
          message="Could not retrieve platform exams."
          onRetry={loadData}
        />
      ) : filteredExams.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No examinations found"
          description="There are currently no exams matching the specified filters."
        />
      ) : (
        <Table
          headers={[
            { label: "Access Code", className: "w-36" },
            { label: "Exam Title" },
            { label: "Subject" },
            { label: "Creator Admin" },
            { label: "Duration & Marks" },
            { label: "Status" },
          ]}
        >
          {filteredExams.map((exam) => (
            <tr key={exam.id} className="hover:bg-zinc-50 transition-colors">
              <td className="py-3.5 px-4">
                <span className="font-mono font-bold text-xs bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-zinc-900 block text-center">
                  {exam.accessCode || `EXAM-${exam.id}`}
                </span>
              </td>
              <td className="py-3.5 px-4 font-bold text-zinc-950 text-xs uppercase tracking-tight">
                {exam.title}
                {exam.description && (
                  <p className="text-[11px] text-zinc-500 font-normal truncate max-w-xs">{exam.description}</p>
                )}
              </td>
              <td className="py-3.5 px-4 font-mono text-xs text-zinc-700">
                {exam.subjectName || "Subject #" + exam.subjectId}
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1.5 text-xs">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-900">{exam.createdByName || "Administrator"}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 font-mono text-xs">
                {exam.duration}m • <strong className="text-zinc-950">{exam.totalMarks}pts</strong> (Pass: {exam.passingMarks})
              </td>
              <td className="py-3.5 px-4">
                <Badge>{exam.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};

export default AllExams;
