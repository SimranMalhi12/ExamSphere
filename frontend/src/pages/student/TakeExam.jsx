import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getExamById } from "../../services/examService";
import { getQuestions, getQuestionsBySubject } from "../../services/questionService";
import {
  startExamAttempt,
  submitAnswer,
  submitExamAttempt,
} from "../../services/attemptService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Loader } from "../../components/ui/Loader";
import ErrorState from "../../components/ui/ErrorState";
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Send,
  RotateCcw,
} from "lucide-react";

const TakeExam = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));

  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const loadExamAndQuestions = async () => {
    setLoading(true);
    setError(false);
    try {
      const examData = await getExamById(examId);
      let examQuestions = [];

      if (examData.subjectId) {
        try {
          examQuestions = await getQuestionsBySubject(examData.subjectId);
        } catch (e) {
          // fallback to all questions
        }
      }

      if (!examQuestions || examQuestions.length === 0) {
        const allQuestions = await getQuestions().catch(() => []);
        examQuestions = allQuestions.filter(
          (q) => q.subjectId === examData.subjectId
        );
        if (examQuestions.length === 0 && allQuestions.length > 0) {
          examQuestions = allQuestions;
        }
      }

      setExam(examData);
      setQuestions(examQuestions || []);
      setTimeLeft((examData.duration || 60) * 60);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExamAndQuestions();
  }, [examId]);

  const handleFinalSubmit = useCallback(async () => {
    if (isFinished || submitting) return;

    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      let resultData = null;
      if (attemptId) {
        resultData = await submitExamAttempt(attemptId);
      } else {
        const total = questions.length || 1;
        let correct = 0;
        questions.forEach((q) => {
          if (answers[q.id] && answers[q.id].toUpperCase() === q.correctAnswer?.toUpperCase()) {
            correct++;
          }
        });
        const score = Math.round((correct * (exam?.totalMarks || 100)) / total);
        resultData = {
          attemptId: Date.now(),
          totalQuestions: total,
          correctAnswers: correct,
          score,
          passed: score >= (exam?.passingMarks || 40),
        };
      }

      const savedAttempts = JSON.parse(localStorage.getItem("student_attempts") || "[]");
      const newRecord = {
        id: resultData?.attemptId || attemptId || Date.now(),
        examId: exam?.id,
        examTitle: exam?.title,
        subjectName: exam?.subjectName,
        date: new Date().toISOString(),
        score: resultData?.score ?? 0,
        totalMarks: exam?.totalMarks || 100,
        passingMarks: exam?.passingMarks || 40,
        passed: resultData?.passed ?? false,
        totalQuestions: resultData?.totalQuestions || questions.length,
        correctAnswers: resultData?.correctAnswers || 0,
      };

      savedAttempts.unshift(newRecord);
      localStorage.setItem("student_attempts", JSON.stringify(savedAttempts));

      setIsFinished(true);
      toast.success("Examination submitted successfully!");
      navigate(`/student/results/${newRecord.id}`, { state: { result: newRecord } });
    } catch (err) {
      toast.error("Error finalizing attempt. Submitting cached answers.");
      navigate("/student/results", { replace: true });
    } finally {
      setSubmitting(false);
    }
  }, [attemptId, exam, questions, answers, isFinished, submitting, navigate, toast]);

  useEffect(() => {
    if (hasStarted && !isFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isFinished, handleFinalSubmit]);

  const handleStartExam = async () => {
    if (!agreedToRules) {
      toast.warning("Please acknowledge and agree to the examination rules.");
      return;
    }

    setSubmitting(true);
    try {
      const studentId = user?.id || localStorage.getItem("userId") || 1;
      const attemptRes = await startExamAttempt({
        studentId: Number(studentId),
        examId: Number(exam.id),
      });

      setAttemptId(attemptRes.id);
      setHasStarted(true);
      setVisitedQuestions(new Set([0]));
      toast.info("Exam has started. Your timer is active.");
    } catch (err) {
      setAttemptId(Date.now());
      setHasStarted(true);
      setVisitedQuestions(new Set([0]));
      toast.info("Exam started in self-paced mode.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectOption = async (optionKey) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionKey,
    }));

    if (attemptId) {
      try {
        await submitAnswer({
          attemptId,
          questionId: currentQ.id,
          selectedAnswer: optionKey,
        });
      } catch (e) {
      }
    }
  };

  const handleClearSelection = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
  };

  const handleJumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setVisitedQuestions((prev) => new Set([...prev, index]));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      handleJumpToQuestion(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleJumpToQuestion(currentIndex - 1);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) {
    return <Loader text="Preparing examination environment..." />;
  }

  if (error || !exam) {
    return (
      <ErrorState
        title="Exam Not Found"
        message="Unable to load the requested examination. Please verify the exam ID."
        onRetry={loadExamAndQuestions}
      />
    );
  }

  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/student/exams"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Available Exams
        </Link>

        <div
          style={{ borderRadius: "0px" }}
          className="bg-white border border-zinc-200 shadow-sm p-6 sm:p-8"
        >
          <div className="border-b border-zinc-200 pb-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 bg-zinc-100 border border-zinc-300">
                {exam.subjectName || "Subject Assessment"}
              </span>
              <Badge size="xs">{exam.status || "PUBLISHED"}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-zinc-950">
              {exam.title}
            </h1>
            <p className="text-xs text-zinc-600 mt-1">
              {exam.description || "Official examination assessment for candidate evaluation."}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-zinc-50 border border-zinc-200 mb-6 text-xs font-mono">
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block">Duration</span>
              <span className="font-bold text-zinc-950 text-sm">{exam.duration} Minutes</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block">Questions</span>
              <span className="font-bold text-zinc-950 text-sm">{questions.length} Items</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block">Total Marks</span>
              <span className="font-bold text-zinc-950 text-sm">{exam.totalMarks} Marks</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase text-[10px] block">Passing Criteria</span>
              <span className="font-bold text-emerald-700 text-sm">{exam.passingMarks} Marks</span>
            </div>
          </div>

          <div className="space-y-3 mb-6 text-xs text-zinc-700">
            <h4 className="font-mono font-bold uppercase tracking-wider text-zinc-950 text-xs">
              Examination Rules & Integrity:
            </h4>
            <ul className="space-y-2 list-disc list-inside text-zinc-600">
              <li>The countdown timer starts immediately once you click <strong>Begin Examination</strong>.</li>
              <li>You can navigate back and forth between questions using the Question Palette.</li>
              <li>Each question has exactly one correct answer choice.</li>
              <li>When the timer reaches <strong>00:00</strong>, your exam will automatically be submitted.</li>
              <li>Do not refresh or close the browser window during the active test session.</li>
            </ul>
          </div>

          <div className="p-4 bg-zinc-100 border border-zinc-300 mb-6">
            <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-zinc-950">
              <input
                type="checkbox"
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-none accent-zinc-950 cursor-pointer"
              />
              <span>
                I have read, understood, and agree to strictly abide by all exam instructions and time limits.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link to="/student/exams">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartExam}
              disabled={!agreedToRules || questions.length === 0}
              loading={submitting}
              className="font-bold"
            >
              {questions.length === 0 ? "No Questions in Exam" : "Begin Examination →"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const isTimerLow = timeLeft <= 300;
  const isTimerCritical = timeLeft <= 60;

  return (
    <div className="space-y-6">
      <div
        style={{ borderRadius: "0px" }}
        className="bg-white border border-zinc-900 p-4 shadow-md sticky top-16 z-20 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-950 text-white flex items-center justify-center font-mono font-bold text-xs border border-zinc-950">
            {currentIndex + 1}
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-tight text-zinc-950 line-clamp-1">
              {exam.title}
            </h2>
            <p className="text-[11px] font-mono text-zinc-500">
              Question {currentIndex + 1} of {questions.length} • {currentQuestion?.marks || 1} Mark(s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            style={{ borderRadius: "0px" }}
            className={`px-4 py-2 border font-mono font-bold flex items-center gap-2 text-sm ${
              isTimerCritical
                ? "bg-rose-600 text-white border-rose-700 animate-pulse"
                : isTimerLow
                ? "bg-amber-100 text-amber-900 border-amber-400"
                : "bg-zinc-950 text-white border-zinc-950"
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            icon={Send}
          >
            Submit Exam
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {currentQuestion ? (
            <div
              style={{ borderRadius: "0px" }}
              className="bg-white border border-zinc-200 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-zinc-200">
                <span className="text-xs font-mono font-bold uppercase text-zinc-500">
                  Question #{currentIndex + 1}
                </span>
                <div className="flex items-center gap-2">
                  <Badge size="xs">{currentQuestion.difficulty || "EASY"}</Badge>
                  <span className="text-xs font-mono text-zinc-600">
                    +{currentQuestion.marks || 1} pts
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-base sm:text-lg font-semibold text-zinc-950 leading-relaxed">
                  {currentQuestion.questionText}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "A", text: currentQuestion.optionA },
                  { key: "B", text: currentQuestion.optionB },
                  { key: "C", text: currentQuestion.optionC },
                  { key: "D", text: currentQuestion.optionD },
                ].map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      style={{ borderRadius: "0px" }}
                      className={`p-4 border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                          : "bg-white text-zinc-900 border-zinc-300 hover:border-zinc-500 hover:bg-zinc-50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                          isSelected
                            ? "bg-white text-zinc-950 border-white"
                            : "bg-zinc-100 text-zinc-700 border-zinc-300"
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="text-xs sm:text-sm font-medium pt-0.5 leading-snug break-words">
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-5 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  disabled={!answers[currentQuestion.id]}
                  icon={RotateCcw}
                >
                  Clear Choice
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    icon={ChevronLeft}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1 inline" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white border border-zinc-200 text-center text-xs font-mono text-zinc-500">
              No questions found for this exam.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div
            style={{ borderRadius: "0px" }}
            className="bg-white border border-zinc-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950">
                Question Palette
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">
                {answeredCount}/{questions.length} Done
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = Boolean(answers[q.id]);
                const isVisited = visitedQuestions.has(idx);

                let btnStyle = "bg-zinc-100 text-zinc-600 border-zinc-300";
                if (isCurrent) {
                  btnStyle = "bg-zinc-950 text-white border-zinc-950 ring-2 ring-zinc-400";
                } else if (isAnswered) {
                  btnStyle = "bg-emerald-600 text-white border-emerald-700 font-bold";
                } else if (isVisited) {
                  btnStyle = "bg-amber-100 text-amber-900 border-amber-300 font-medium";
                }

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => handleJumpToQuestion(idx)}
                    style={{ borderRadius: "0px" }}
                    className={`h-9 flex items-center justify-center font-mono text-xs border transition-all cursor-pointer ${btnStyle}`}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-emerald-600 border border-emerald-700 inline-block" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-amber-100 border border-amber-300 inline-block" />
                <span>Visited ({visitedQuestions.size - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-zinc-950 border border-zinc-950 inline-block" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-zinc-100 border border-zinc-300 inline-block" />
                <span>Unvisited</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-200">
              <Button
                variant="danger"
                size="md"
                className="w-full font-bold"
                onClick={() => setIsSubmitModalOpen(true)}
                icon={Send}
              >
                Submit Examination
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Confirm Exam Submission"
        subtitle="Please review your attempt status before submitting"
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsSubmitModalOpen(false)}
              disabled={submitting}
            >
              Resume Test
            </Button>
            <Button
              variant="danger"
              onClick={handleFinalSubmit}
              loading={submitting}
            >
              Confirm & Submit
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-zinc-50 border border-zinc-200 grid grid-cols-2 gap-4 text-center font-mono">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Answered</span>
              <span className="text-xl font-bold text-emerald-700 mt-1 block">
                {answeredCount}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block">Unanswered</span>
              <span className="text-xl font-bold text-amber-700 mt-1 block">
                {unansweredCount}
              </span>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                You have {unansweredCount} unanswered questions remaining. You will not be able to change your answers once submitted.
              </span>
            </div>
          )}

          <p className="text-zinc-600 leading-relaxed">
            Are you sure you want to finish your examination? Your responses will be scored immediately.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TakeExam;
