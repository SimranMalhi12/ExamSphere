import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllExams } from "../../services/examService";
import { getSubjects } from "../../services/subjectService";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import {
  FileCheck,
  Search,
  ArrowRight,
} from "lucide-react";

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [examsData, subjectsData] = await Promise.all([
        getAllExams(),
        getSubjects().catch(() => []),
      ]);
      setExams(examsData || []);
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
      exam.description?.toLowerCase().includes(q) ||
      exam.subjectName?.toLowerCase().includes(q) ||
      String(exam.id).includes(q);

    const matchesSubject =
      !selectedSubject || String(exam.subjectId) === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Available Examinations"
        subtitle="Browse active scheduled tests, review prerequisites, and begin your assessments"
        breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Available Exams" }]}
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="w-full sm:w-80">
            <Input
              id="search"
              placeholder="Search exams by title or subject..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-60">
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
        <div className="text-xs font-mono text-zinc-500 self-end sm:self-center">
          Available: <span className="font-bold text-zinc-950">{filteredExams.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading available examinations..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Examinations"
          message="Could not communicate with the backend server. Please verify network connectivity."
          onRetry={loadData}
        />
      ) : filteredExams.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title={searchQuery || selectedSubject ? "No matching exams" : "No exams available"}
          description={
            searchQuery || selectedSubject
              ? "Try adjusting your search criteria or subject filter."
              : "There are no exams available at this moment. Please check back later."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const isClosed = exam.status === "CLOSED";
            return (
              <div
                key={exam.id}
                style={{ borderRadius: "0px" }}
                className="bg-white border border-zinc-200 p-6 flex flex-col justify-between hover:border-zinc-950 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-zinc-100 border border-zinc-300 text-zinc-800">
                      {exam.subjectName || "Subject #" + exam.subjectId}
                    </span>
                    <Badge size="xs">{exam.status || "PUBLISHED"}</Badge>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-950 uppercase tracking-tight line-clamp-1">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-zinc-600 mt-2 line-clamp-2 min-h-[34px]">
                    {exam.description || "General candidate evaluation test covering curriculum topics."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 my-5 p-3 bg-zinc-50 border border-zinc-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Duration</span>
                      <span className="font-mono font-bold text-zinc-950 mt-0.5 block">{exam.duration} mins</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total</span>
                      <span className="font-mono font-bold text-zinc-950 mt-0.5 block">{exam.totalMarks} pts</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Pass</span>
                      <span className="font-mono font-bold text-emerald-700 mt-0.5 block">{exam.passingMarks} pts</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  {isClosed ? (
                    <Button variant="secondary" size="md" className="w-full" disabled>
                      Exam Concluded
                    </Button>
                  ) : (
                    <Link to={`/student/exam/${exam.id}`} className="block">
                      <Button variant="primary" size="md" className="w-full font-bold">
                        Start Examination <ArrowRight className="w-4 h-4 ml-1 inline" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailableExams;