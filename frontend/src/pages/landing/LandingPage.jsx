import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  CheckCircle,
  Layers,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Timer,
  BarChart3,
  Users,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const LandingPage = () => {
  const { isAuthenticated, role } = useAuth();
  const dashboardLink = role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-white selection:text-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-zinc-950 flex items-center justify-center font-mono font-extrabold text-sm border border-white">
              E
            </div>
            <span className="text-lg font-extrabold uppercase tracking-wider text-white">
              ExamSphere
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
            <a href="#statistics" className="hover:text-white transition-colors">Overview</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={dashboardLink}>
                <Button variant="secondary" size="sm">
                  Go to Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative pt-20 pb-24 border-b border-zinc-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono uppercase tracking-wider mb-6">
              <span className="w-2 h-2 bg-white inline-block" />
              Next-Generation Online Examination Platform
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase leading-[1.1] text-white">
              Take Smarter Exams with <span className="underline decoration-1 underline-offset-8">ExamSphere</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-normal">
              A high-precision, role-secured examination environment built for educational institutions and professional assessments. Seamlessly create, administer, and evaluate timed online tests with instant algorithmic grading.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {isAuthenticated ? (
                <Link to={dashboardLink}>
                  <Button variant="secondary" size="lg" icon={ArrowRight}>
                    Open Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="secondary" size="lg" icon={Zap}>
                      Get Started Now
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="border-zinc-700 text-white hover:bg-zinc-900 hover:text-white">
                      Sign In to Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-16 border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8" style={{ borderRadius: "0px" }}>
            <div className="border-b border-zinc-800 pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-zinc-700" />
                <div className="w-3 h-3 bg-zinc-700" />
                <div className="w-3 h-3 bg-zinc-700" />
                <span className="ml-2 text-xs font-mono text-zinc-400">EXAM ENVIRONMENT PREVIEW</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700">TIMER: 44:59</span>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800">STATUS: LIVE</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-4 bg-zinc-950 border border-zinc-800">
                  <span className="text-xs font-mono text-zinc-500 uppercase">Question 04 of 20</span>
                  <p className="text-sm sm:text-base font-semibold text-zinc-100 mt-2">
                    Which component of the Java Virtual Machine is responsible for loading class files into memory?
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["A. ClassLoader Subsystem", "B. Execution Engine", "C. Garbage Collector", "D. JIT Compiler"].map((opt, i) => (
                    <div
                      key={i}
                      className={`p-3 border text-xs font-mono cursor-pointer transition-colors ${
                        i === 0
                          ? "bg-zinc-800 border-white text-white font-bold"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-zinc-800 bg-zinc-950 p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-3">
                    Question Palette
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 15 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-7 flex items-center justify-center text-[10px] font-mono font-bold border ${
                          idx < 3
                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                            : idx === 3
                            ? "bg-white text-zinc-950 border-white"
                            : "bg-zinc-900 text-zinc-500 border-zinc-800"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Answered: 3</span>
                  <span>Pending: 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-2">
              Engineered For Accuracy
            </span>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
              Platform Features
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Timer,
                title: "Live Countdown Timer",
                desc: "Strict countdown synchronization with warning thresholds and automated submission when time expires.",
              },
              {
                icon: Zap,
                title: "Instant Algorithmic Grading",
                desc: "Real-time answer verification and score computation against total marks and passing criteria.",
              },
              {
                icon: Layers,
                title: "Hierarchical Banks",
                desc: "Organize academic tests by Categories, Subjects, and Questions with Difficulty tagging (Easy, Medium, Hard).",
              },
              {
                icon: ShieldCheck,
                title: "Role-Based Security",
                desc: "Strict authorization layers for Administrators and Students with JWT authentication and protected routing.",
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col justify-between hover:border-zinc-600 transition-colors"
                  style={{ borderRadius: "0px" }}
                >
                  <div>
                    <div className="w-10 h-10 border border-zinc-700 bg-zinc-800 flex items-center justify-center text-white mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold uppercase tracking-tight text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 border-b border-zinc-800 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-2">
              Workflow
            </span>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-white">
              How ExamSphere Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Setup & Exam Creation",
                desc: "Administrators configure categories, subjects, and multiple-choice questions with marks and difficulty levels, then publish timed exams.",
              },
              {
                step: "02",
                title: "Student Assessment",
                desc: "Students browse available published exams, review instructions, and complete the live timed test using an interactive question palette.",
              },
              {
                step: "03",
                title: "Evaluation & Scorecard",
                desc: "Answers are algorithmically evaluated immediately upon submission, presenting percentage scores, pass/fail status, and attempt analytics.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="border border-zinc-800 bg-zinc-950 p-8 relative"
                style={{ borderRadius: "0px" }}
              >
                <span className="text-3xl font-extrabold font-mono text-zinc-700 block mb-4">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="border border-zinc-800 bg-zinc-950 p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                <Users className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                  For Students
                </h3>
              </div>
              <ul className="space-y-4 text-xs text-zinc-300">
                {[
                  "Clean, distraction-free examination interface with high contrast",
                  "Live question palette indicating answered and unvisited questions",
                  "Automated countdown timer with real-time low-time warnings",
                  "Instant score generation and comprehensive performance breakdown",
                  "Historical attempt tracking with pass/fail evaluation",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                <ShieldCheck className="w-5 h-5 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-white">
                  For Administrators
                </h3>
              </div>
              <ul className="space-y-4 text-xs text-zinc-300">
                {[
                  "Full CRUD control over Categories, Subjects, Questions, and Exams",
                  "Flexible exam publishing states (DRAFT, PUBLISHED, CLOSED)",
                  "Customizable passing thresholds and total marks configuration",
                  "Comprehensive difficulty tagging (EASY, MEDIUM, HARD)",
                  "Centralized management dashboard with real-time statistics",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="statistics" className="py-16 border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Evaluation Latency", value: "< 100ms" },
              { label: "Grading Accuracy", value: "100%" },
              { label: "Supported Question Types", value: "Multiple Choice" },
              { label: "Security Protocol", value: "JWT Stateless" },
            ].map((stat, i) => (
              <div key={i} className="border border-zinc-800 bg-zinc-950 p-6">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-4">
            Ready to Experience ExamSphere?
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-8">
            Join the platform today to streamline online assessments with precision, security, and automated grading.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="border-zinc-700 text-white hover:bg-zinc-900 hover:text-white">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 bg-zinc-950 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">ExamSphere</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Online Examination Platform</span>
            <Link
              to="/admin/login"
              className="text-zinc-400 hover:text-amber-400 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Admin Portal →</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
