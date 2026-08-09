import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { User, Mail, Lock, ShieldCheck, GraduationCap } from "lucide-react";

const Register = () => {
  const { isAuthenticated, role } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
      });

      if (typeof response === "string" && response.toLowerCase().includes("exists")) {
        setError(response);
        toast.error(response);
        return;
      }

      toast.success(
        selectedRole === "ADMIN"
          ? "Administrator account created successfully! Please sign in."
          : "Student account created successfully! Please sign in."
      );
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Email might already be registered.";
      setError(typeof msg === "string" ? msg : "Registration failed.");
      toast.error(typeof msg === "string" ? msg : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-white selection:text-zinc-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-9 h-9 bg-white text-zinc-950 flex items-center justify-center font-mono font-extrabold text-base border border-white">
              E
            </div>
            <span className="text-2xl font-extrabold uppercase tracking-widest text-white">
              ExamSphere
            </span>
          </Link>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Account Registration Portal
          </p>
        </div>

        <div
          style={{ borderRadius: "0px" }}
          className="bg-white border border-zinc-900 shadow-2xl p-8"
        >
          <div className="border-b border-zinc-200 pb-4 mb-6">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-950">
              Create Account
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Select your account type and fill in your credentials.
            </p>
          </div>

          {error && (
            <div
              style={{ borderRadius: "0px" }}
              className="p-3 mb-5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium"
            >
              {error}
            </div>
          )}

          <div className="mb-5 p-3 bg-zinc-50 border border-zinc-200">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-zinc-900" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                Candidate / Student Registration
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 font-mono">
              Creates a student profile with access to live exams, test history, and scorecards.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              id="fullName"
              label="Full Name"
              type="text"
              placeholder="e.g. Simran Malhi"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
            />

            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Minimum 6 characters"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText="Must be at least 6 characters"
            />

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Re-type your password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full font-bold uppercase tracking-wider"
              >
                Create Candidate Account
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-bold text-zinc-950 hover:underline uppercase tracking-wider text-[11px]"
            >
              Sign In →
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 flex items-center justify-center gap-4 text-xs font-mono text-zinc-400">
          <Link
            to="/"
            className="hover:text-white uppercase tracking-widest transition-colors"
          >
            ← Homepage
          </Link>
          <span>•</span>
          <Link
            to="/login"
            className="hover:text-white uppercase tracking-widest transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;