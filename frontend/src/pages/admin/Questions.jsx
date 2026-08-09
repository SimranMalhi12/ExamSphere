import React, { useEffect, useState } from "react";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../../services/questionService";
import { getSubjects } from "../../services/subjectService";
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
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const Questions = () => {
  const toast = useToast();
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const initialForm = {
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    difficulty: "EASY",
    marks: 1,
    subjectId: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [questionsData, subjectsData] = await Promise.all([
        getQuestions(),
        getSubjects(),
      ]);
      setQuestions(questionsData || []);
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

  const validateForm = () => {
    const errors = {};
    if (!formData.questionText.trim()) errors.questionText = "Question text is required";
    if (!formData.optionA.trim()) errors.optionA = "Option A is required";
    if (!formData.optionB.trim()) errors.optionB = "Option B is required";
    if (!formData.optionC.trim()) errors.optionC = "Option C is required";
    if (!formData.optionD.trim()) errors.optionD = "Option D is required";
    if (!formData.correctAnswer) errors.correctAnswer = "Select the correct option";
    if (!formData.difficulty) errors.difficulty = "Select difficulty";
    if (!formData.marks || Number(formData.marks) <= 0) errors.marks = "Marks must be greater than 0";
    if (!formData.subjectId) errors.subjectId = "Select a subject";
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

  const handleOpenEdit = (question) => {
    setCurrentQuestion(question);
    setFormData({
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer || "A",
      difficulty: question.difficulty || "EASY",
      marks: question.marks || 1,
      subjectId: String(question.subjectId || ""),
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (question) => {
    setCurrentQuestion(question);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createQuestion({
        questionText: formData.questionText.trim(),
        optionA: formData.optionA.trim(),
        optionB: formData.optionB.trim(),
        optionC: formData.optionC.trim(),
        optionD: formData.optionD.trim(),
        correctAnswer: formData.correctAnswer,
        difficulty: formData.difficulty,
        marks: Number(formData.marks),
        subjectId: Number(formData.subjectId),
      });
      toast.success("Question created successfully");
      setIsCreateOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create question";
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
      await updateQuestion(currentQuestion.id, {
        questionText: formData.questionText.trim(),
        optionA: formData.optionA.trim(),
        optionB: formData.optionB.trim(),
        optionC: formData.optionC.trim(),
        optionD: formData.optionD.trim(),
        correctAnswer: formData.correctAnswer,
        difficulty: formData.difficulty,
        marks: Number(formData.marks),
        subjectId: Number(formData.subjectId),
      });
      toast.success("Question updated successfully");
      setIsEditOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update question";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await deleteQuestion(currentQuestion.id);
      toast.success("Question deleted successfully");
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete question";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const subjectOptions = subjects.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  const difficultyOptions = [
    { value: "EASY", label: "EASY" },
    { value: "MEDIUM", label: "MEDIUM" },
    { value: "HARD", label: "HARD" },
  ];

  const answerOptions = [
    { value: "A", label: "Option A" },
    { value: "B", label: "Option B" },
    { value: "C", label: "Option C" },
    { value: "D", label: "Option D" },
  ];

  const filteredQuestions = questions.filter((q) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      q.questionText?.toLowerCase().includes(query) ||
      q.subjectName?.toLowerCase().includes(query) ||
      String(q.id).includes(query);

    const matchesSubject = !subjectFilter || String(q.subjectId) === subjectFilter;
    const matchesDifficulty = !difficultyFilter || q.difficulty === difficultyFilter;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank"
        subtitle="Create, configure and manage multiple-choice questions with answer keys"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Questions" }]}
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Add Question
          </Button>
        }
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-1">
          <div className="w-full sm:w-72">
            <Input
              id="search"
              placeholder="Search question text..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
          <div className="w-full sm:w-40">
            <select
              style={{ borderRadius: "0px" }}
              className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end lg:self-center">
          Total Questions: <span className="font-bold text-zinc-950">{questions.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading question bank..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Questions"
          message="Could not retrieve questions from the server."
          onRetry={loadData}
        />
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title={
            searchQuery || subjectFilter || difficultyFilter
              ? "No matching questions found"
              : "No questions in bank"
          }
          description={
            searchQuery || subjectFilter || difficultyFilter
              ? "Try adjusting your filters or search terms."
              : "Start adding multiple-choice questions for your subjects."
          }
          actionText={
            searchQuery || subjectFilter || difficultyFilter ? undefined : "Add First Question"
          }
          onAction={
            searchQuery || subjectFilter || difficultyFilter ? undefined : handleOpenCreate
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <div
                key={q.id}
                style={{ borderRadius: "0px" }}
                className="bg-white border border-zinc-200 transition-all hover:border-zinc-400"
              >
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="font-mono font-bold text-zinc-400 text-xs mt-0.5 shrink-0">
                      #{q.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-zinc-950 leading-snug">
                        {q.questionText}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-zinc-100 border border-zinc-300 font-semibold">
                          {q.subjectName || "Subject #" + q.subjectId}
                        </span>
                        <Badge size="xs">{q.difficulty}</Badge>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {q.marks} Mark{q.marks > 1 ? "s" : ""}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5">
                          Correct: {q.correctAnswer}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleExpand(q.id)}
                    >
                      {isExpanded ? (
                        <>
                          Hide Details <ChevronUp className="w-3.5 h-3.5 ml-1" />
                        </>
                      ) : (
                        <>
                          Options <ChevronDown className="w-3.5 h-3.5 ml-1" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Edit2}
                      onClick={() => handleOpenEdit(q)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleOpenDelete(q)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-zinc-100 bg-zinc-50">
                    <p className="text-[11px] font-mono uppercase font-bold text-zinc-500 mb-3 tracking-wider">
                      Choice Options & Key
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { key: "A", text: q.optionA },
                        { key: "B", text: q.optionB },
                        { key: "C", text: q.optionC },
                        { key: "D", text: q.optionD },
                      ].map((opt) => {
                        const isCorrect = q.correctAnswer?.toUpperCase() === opt.key;
                        return (
                          <div
                            key={opt.key}
                            className={`p-3 border flex items-start gap-2.5 ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold"
                                : "bg-white border-zinc-200 text-zinc-800"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border ${
                                isCorrect
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-zinc-100 text-zinc-700 border-zinc-300"
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="flex-1 break-words">{opt.text}</span>
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isCreateOpen || isEditOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setIsEditOpen(false);
        }}
        title={isCreateOpen ? "Add Question to Bank" : "Edit Question"}
        subtitle="Specify question prompt, multiple choice answers, and key"
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
              {isCreateOpen ? "Save Question" : "Update Question"}
            </Button>
          </>
        }
      >
        <form
          onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit}
          className="space-y-4"
        >
          <Textarea
            id="q-text"
            label="Question Prompt"
            placeholder="Type question statement or code snippet..."
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            error={formErrors.questionText}
            rows={3}
            required
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="opt-a"
              label="Option A"
              placeholder="Choice A text"
              value={formData.optionA}
              onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
              error={formErrors.optionA}
              required
            />
            <Input
              id="opt-b"
              label="Option B"
              placeholder="Choice B text"
              value={formData.optionB}
              onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
              error={formErrors.optionB}
              required
            />
            <Input
              id="opt-c"
              label="Option C"
              placeholder="Choice C text"
              value={formData.optionC}
              onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
              error={formErrors.optionC}
              required
            />
            <Input
              id="opt-d"
              label="Option D"
              placeholder="Choice D text"
              value={formData.optionD}
              onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
              error={formErrors.optionD}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-100">
            <Select
              id="correct-ans"
              label="Correct Key"
              options={answerOptions}
              value={formData.correctAnswer}
              onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              error={formErrors.correctAnswer}
              required
            />

            <Select
              id="diff"
              label="Difficulty"
              options={difficultyOptions}
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              error={formErrors.difficulty}
              required
            />

            <Input
              id="marks"
              label="Marks"
              type="number"
              min="1"
              max="100"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
              error={formErrors.marks}
              required
            />

            <Select
              id="q-subject"
              label="Subject"
              options={subjectOptions}
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              error={formErrors.subjectId}
              required
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message={`Are you sure you want to permanently delete Question #${currentQuestion?.id}?`}
        confirmText="Delete Question"
        loading={submitting}
      />
    </div>
  );
};

export default Questions;