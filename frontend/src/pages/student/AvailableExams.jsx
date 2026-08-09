import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllExams, getExamByAccessCode } from "../../services/examService";
import { getSubjects } from "../../services/subjectService";
import { useToast } from "../../context/ToastContext";
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
  KeyRound,
  User,
  Clock,
  Award,
} from "lucide-react";

const AvailableExams = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [joiningByCode, setJoiningByCode] = useState(false);

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

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    const code = accessCodeInput.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a valid examination access code");
      return;
    }

    setJoiningByCode(true);
    try {
      const exam = await getExamByAccessCode(code);
      if (exam && exam.id) {
        toast.success(`Found exam "${exam.title}"! Redirecting...`);
        navigate(`/student/exam/${exam.id}`);
      } else {
        toast.error("Exam not found with that access code");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Exam with code "${code}" not found`);
    } finally {
      setJoiningByCode(false);
    }
  };

  // Distinct instructors for filtering
  const instructors = Array.from(
    new Set(exams.map((e) => e.createdByName).filter(Boolean))
  );

  const filteredExams = exams.filter((exam) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      exam.title?.toLowerCase().includes(q) ||
      exam.description?.toLowerCase().includes(q) ||
      exam.subjectName?.toLowerCase().includes(q) ||
      exam.accessCode?.toLowerCase().includes(q) ||
      exam.createdByName?.toLowerCase().includes(q) ||
      String(exam.id).includes(q);

    const matchesSubject =
      !selectedSubject || String(exam.subjectId) === selectedSubject;

    const matchesInstructor =
      !selectedInstructor || exam.createdByName === selectedInstructor;

    return matchesSearch && matchesSubject && matchesInstructor;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Examination Hub"
        subtitle="Access assessments, enter private test codes, review prerequisites, and complete evaluations"
        breadcrumbs={[{ label: "Student", href: "/student/dashboard" }, { label: "Available Exams" }]}
      />

      {/* Quick Access Code Card */}
      <div className="bg-white border-2 border-zinc-950 p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-950 text-white flex items-center justify-center font-mono shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
              Have a Private Exam Access Code?
            </h3>
            <p className="text-xs text-zinc-600 mt-0.5">
              Enter the unique access code provided by your administrator or instructor to begin directly.
            </p>
          </div>
        </div>

        <form onSubmit={handleJoinByCode} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="e.g. PHY-2026"
            value={accessCodeInput}
            onChange={(e) => setAccessCodeInput(e.target.value.toUpperCase())}
            style={{ borderRadius: "0px" }}
            className="w-full md:w-52 bg-zinc-50 border border-zinc-300 px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase text-zinc-900 outline-none focus:border-zinc-950 focus:bg-white"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={joiningByCode}
            className="shrink-0 font-bold"
          >
            Enter Test
          </Button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
          <div className="w-full sm:w-72">
            <Input
              id="search"
              placeholder="Search by title, code, instructor..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
          {instructors.length > 1 && (
            <div className="w-full sm:w-48">
              <select
                style={{ borderRadius: "0px" }}
                className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
              >
                <option value="">All Instructors</option>
                {instructors.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end lg:self-center">
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
          title={searchQuery || selectedSubject || selectedInstructor ? "No matching exams" : "No exams available"}
          description={
            searchQuery || selectedSubject || selectedInstructor
              ? "Try adjusting your search criteria or filter settings."
              : "There are no public exams available at this moment. You can also enter an access code above."
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

                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-zinc-500 font-mono">
                    <User className="w-3.5 h-3.5" />
                    <span>Instructor: <strong className="text-zinc-800">{exam.createdByName || "Administrator"}</strong></span>
                  </div>

                  {exam.accessCode && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono bg-zinc-50 border border-zinc-200 px-2 py-0.5 text-zinc-700">
                      <KeyRound className="w-3 h-3 text-zinc-500" />
                      <span>Code: <strong className="text-zinc-950">{exam.accessCode}</strong></span>
                    </div>
                  )}

                  <p className="text-xs text-zinc-600 mt-3 line-clamp-2 min-h-[34px]">
                    {exam.description || "Comprehensive candidate evaluation covering subject modules."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-zinc-50 border border-zinc-200 text-center text-xs">
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