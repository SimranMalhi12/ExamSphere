import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const { login, isAuthenticated, role } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      const rawRole = (response.role || "STUDENT").toUpperCase();
      let userRole = "STUDENT";
      if (rawRole.includes("SUPER")) {
        userRole = "SUPER_ADMIN";
      } else if (rawRole.includes("ADMIN")) {
        userRole = "ADMIN";
      }

      const userPayload = {
        fullName: response.fullName || (userRole === "SUPER_ADMIN" ? "Super Administrator" : userRole === "ADMIN" ? "Administrator" : "Student"),
        email: email.trim(),
        role: userRole,
        id: response.id || 1,
        canCreateExams: response.canCreateExams ?? true,
        canManageQuestions: response.canManageQuestions ?? true,
        canManageSubjects: response.canManageSubjects ?? true,
        canViewSubmissions: response.canViewSubmissions ?? true,
      };

      login(response.token, userRole, userPayload);
      toast.success(`Welcome back, ${userPayload.fullName}!`);

      if (userRole === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      } else if (userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid email or password. Please verify credentials.";
      setError(typeof msg === "string" ? msg : "Authentication failed.");
      toast.error(typeof msg === "string" ? msg : "Invalid email or password");
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
            Secure Examination Access Portal
          </p>
        </div>

        <div
          style={{ borderRadius: "0px" }}
          className="bg-white border border-zinc-900 shadow-2xl p-8"
        >
          <div className="border-b border-zinc-200 pb-4 mb-6">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-950">
              Sign In
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Enter your registered credentials to access tests and records.
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

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full font-bold"
              >
                Sign In to Platform
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Don't have an account?</span>
            <Link
              to="/register"
              className="font-bold text-zinc-950 hover:underline uppercase tracking-wider text-[11px]"
            >
              Create Account →
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-xs font-mono text-zinc-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;