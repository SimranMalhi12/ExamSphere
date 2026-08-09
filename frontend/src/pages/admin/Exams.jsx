import React, { useEffect, useState } from "react";
import {
  getAllExams,
  createExam,
  updateExam,
  deleteExam,
} from "../../services/examService";
import { getSubjects } from "../../services/subjectService";
import { getQuestions } from "../../services/questionService";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { Modal, ConfirmDialog } from "../../components/ui/Modal";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import {
  FileCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";

const Exams = () => {
  const toast = useToast();
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentExam, setCurrentExam] = useState(null);
  const initialForm = {
    title: "",
    description: "",
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    status: "DRAFT",
    subjectId: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [examsData, subjectsData, questionsData] = await Promise.all([
        getAllExams(),
        getSubjects(),
        getQuestions().catch(() => []),
      ]);
      setExams(examsData || []);
      setSubjects(subjectsData || []);
      setAllQuestions(questionsData || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Exam title is required";
    if (!formData.subjectId) errors.subjectId = "Please select a subject";
    if (!formData.duration || Number(formData.duration) <= 0)
      errors.duration = "Duration must be greater than 0";
    if (!formData.totalMarks || Number(formData.totalMarks) <= 0)
      errors.totalMarks = "Total marks must be greater than 0";
    if (!formData.passingMarks || Number(formData.passingMarks) <= 0)
      errors.passingMarks = "Passing marks must be greater than 0";
    if (Number(formData.passingMarks) > Number(formData.totalMarks))
      errors.passingMarks = "Passing marks cannot exceed total marks";
    if (!formData.status) errors.status = "Select an exam status";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({
      ...initialForm,
      subjectId: subjects.length > 0 ? String(subjects[0].id) : "",
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (exam) => {
    setCurrentExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description || "",
      duration: exam.duration || 60,
      totalMarks: exam.totalMarks || 100,
      passingMarks: exam.passingMarks || 40,
      status: exam.status || "DRAFT",
      subjectId: String(exam.subjectId || ""),
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenView = (exam) => {
    setCurrentExam(exam);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (exam) => {
    setCurrentExam(exam);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createExam({
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        totalMarks: Number(formData.totalMarks),
        passingMarks: Number(formData.passingMarks),
        status: formData.status,
        subjectId: Number(formData.subjectId),
      });
      toast.success("Exam created successfully");
      setIsCreateOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create exam";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await updateExam(currentExam.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        totalMarks: Number(formData.totalMarks),
        passingMarks: Number(formData.passingMarks),
        status: formData.status,
        subjectId: Number(formData.subjectId),
      });
      toast.success("Exam updated successfully");
      setIsEditOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update exam";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await deleteExam(currentExam.id);
      toast.success("Exam deleted successfully");
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete exam";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const subjectOptions = subjects.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  const statusOptions = [
    { value: "DRAFT", label: "DRAFT (Hidden from candidates)" },
    { value: "PUBLISHED", label: "PUBLISHED (Active for students)" },
    { value: "CLOSED", label: "CLOSED (Assessment concluded)" },
  ];

  const filteredExams = exams.filter((exam) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      exam.title?.toLowerCase().includes(q) ||
      exam.description?.toLowerCase().includes(q) ||
      exam.subjectName?.toLowerCase().includes(q) ||
      String(exam.id).includes(q);

    const matchesStatus = !statusFilter || exam.status === statusFilter;
    const matchesSubject = !subjectFilter || String(exam.subjectId) === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  const examLinkedQuestions = currentExam
    ? allQuestions.filter((q) => q.subjectId === currentExam.subjectId)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam Management"
        subtitle="Configure, publish, and schedule student assessments and passing thresholds"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Exams" }]}
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Create Exam
          </Button>
        }
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
          <div className="w-full sm:w-72">
            <Input
              id="search"
              placeholder="Search exam title..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-44">
            <select
              style={{ borderRadius: "0px" }}
              className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <div className="w-full sm:w-48">
            <select
              style={{ borderRadius: "0px" }}
              className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
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
          Total Exams: <span className="font-bold text-zinc-950">{exams.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading exams..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Exams"
          message="Could not retrieve examination list from server."
          onRetry={loadData}
        />
      ) : filteredExams.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title={
            searchQuery || statusFilter || subjectFilter
              ? "No matching exams found"
              : "No exams configured"
          }
          description={
            searchQuery || statusFilter || subjectFilter
              ? "Try adjusting your filter settings or search keyword."
              : "Get started by creating and publishing your first exam assessment."
          }
          actionText={
            searchQuery || statusFilter || subjectFilter ? undefined : "Create First Exam"
          }
          onAction={
            searchQuery || statusFilter || subjectFilter ? undefined : handleOpenCreate
          }
        />
      ) : (
        <Table
          headers={[
            { label: "ID", className: "w-16" },
            { label: "Exam Title" },
            { label: "Subject" },
            { label: "Duration" },
            { label: "Marks (Total/Pass)" },
            { label: "Status" },
            { label: "Actions", className: "text-right w-52" },
          ]}
        >
          {filteredExams.map((exam) => (
            <tr key={exam.id} className="hover:bg-zinc-50 transition-colors">
              <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">#{exam.id}</td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-zinc-950 uppercase tracking-tight">
                  {exam.title}
                </div>
                {exam.description && (
                  <div className="text-zinc-500 text-[11px] truncate max-w-xs mt-0.5">
                    {exam.description}
                  </div>
                )}
              </td>
              <td className="py-3.5 px-4 font-mono text-xs text-zinc-700">
                <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-semibold">
                  {exam.subjectName || "Subject #" + exam.subjectId}
                </span>
              </td>
              <td className="py-3.5 px-4 font-mono text-xs">
                {exam.duration} mins
              </td>
              <td className="py-3.5 px-4 font-mono text-xs">
                <span className="font-bold text-zinc-900">{exam.totalMarks}</span>
                <span className="text-zinc-400"> / pass: </span>
                <span className="text-emerald-700 font-semibold">{exam.passingMarks}</span>
              </td>
              <td className="py-3.5 px-4">
                <Badge>{exam.status}</Badge>
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleOpenView(exam)}
                    title="View details & questions"
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    onClick={() => handleOpenEdit(exam)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleOpenDelete(exam)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal
        isOpen={isCreateOpen || isEditOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setIsEditOpen(false);
        }}
        title={isCreateOpen ? "Create New Examination" : "Edit Examination"}
        subtitle="Configure assessment metadata, duration, marks, and publishing state"
        maxWidth="max-w-2xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateOpen(false);
                setIsEditOpen(false);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={isCreateOpen ? handleCreateSubmit : handleEditSubmit}
              loading={submitting}
            >
              {isCreateOpen ? "Publish / Save Exam" : "Update Exam"}
            </Button>
          </>
        }
      >
        <form
          onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit}
          className="space-y-4"
        >
          <Input
            id="exam-title"
            label="Exam Title"
            placeholder="e.g. Java Mid Semester Assessment"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={formErrors.title}
            required
            autoFocus
          />

          <Textarea
            id="exam-desc"
            label="Description / Instructions"
            placeholder="Brief description and rules for students"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
            <Select
              id="exam-subject"
              label="Subject"
              options={subjectOptions}
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              error={formErrors.subjectId}
              required
            />

            <Select
              id="exam-status"
              label="Publishing Status"
              options={statusOptions}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              error={formErrors.status}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              id="duration"
              label="Duration (Minutes)"
              type="number"
              min="1"
              max="600"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              error={formErrors.duration}
              required
            />

            <Input
              id="totalMarks"
              label="Total Marks"
              type="number"
              min="1"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
              error={formErrors.totalMarks}
              required
            />

            <Input
              id="passingMarks"
              label="Passing Marks"
              type="number"
              min="1"
              value={formData.passingMarks}
              onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
              error={formErrors.passingMarks}
              required
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title={currentExam?.title || "Exam Specification"}
        subtitle={`Exam #${currentExam?.id} • Subject: ${currentExam?.subjectName}`}
        maxWidth="max-w-3xl"
        footer={
          <Button variant="secondary" onClick={() => setIsViewOpen(false)}>
            Close
          </Button>
        }
      >
        {currentExam && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Status</span>
                <Badge className="mt-1">{currentExam.status}</Badge>
              </div>
              <div className="p-3 bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Duration</span>
                <span className="text-sm font-mono font-bold text-zinc-950 mt-1 block">
                  {currentExam.duration} Minutes
                </span>
              </div>
              <div className="p-3 bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Marks</span>
                <span className="text-sm font-mono font-bold text-zinc-950 mt-1 block">
                  {currentExam.totalMarks}
                </span>
              </div>
              <div className="p-3 bg-zinc-50 border border-zinc-200">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Passing Marks</span>
                <span className="text-sm font-mono font-bold text-emerald-700 mt-1 block">
                  {currentExam.passingMarks}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Description
              </h4>
              <p className="text-xs text-zinc-800 bg-zinc-50 p-3 border border-zinc-200">
                {currentExam.description || "No specific instructions provided."}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600">
                  Questions Pool for Subject ({examLinkedQuestions.length})
                </h4>
              </div>
              {examLinkedQuestions.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs">
                  No questions currently created under subject "{currentExam.subjectName}". Candidates will not receive any questions until questions are added to this subject in the Question Bank.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {examLinkedQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3 border border-zinc-200 bg-white flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-mono text-zinc-400 font-bold mr-2">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-zinc-900">{q.questionText}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge size="xs">{q.difficulty}</Badge>
                        <span className="font-mono text-[11px] text-zinc-500">{q.marks}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Examination"
        message={`Are you sure you want to permanently delete exam "${currentExam?.title}"?`}
        confirmText="Delete Exam"
        loading={submitting}
      />
    </div>
  );
};

export default Exams;