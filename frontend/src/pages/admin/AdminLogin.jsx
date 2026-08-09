import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { ShieldCheck, Lock, Mail, AlertTriangle, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const { login, isAuthenticated, role } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both administrator email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginAdmin({
        email: email.trim(),
        password: password.trim(),
      });

      // Verify the backend returned ADMIN role
      if (response.role !== "ADMIN") {
        setError("Access Denied: Account does not possess Administrator privileges.");
        toast.error("Access Denied: Administrator role required.");
        return;
      }

      const userPayload = {
        fullName: response.fullName || "System Administrator",
        email: response.email || email.trim(),
        role: "ADMIN",
        id: response.userId || 1,
      };

      login(response.token, "ADMIN", userPayload);
      toast.success(`Authenticated as Admin. Welcome, ${userPayload.fullName}!`);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      let errorMsg = "Authentication failed. Please verify administrator credentials.";

      if (status === 403) {
        errorMsg = "Access Denied (403): This account does not have Administrator privileges.";
      } else if (status === 401) {
        errorMsg = "Invalid Credentials: Incorrect admin email or password.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 selection:bg-white selection:text-zinc-950">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 bg-white text-zinc-950 flex items-center justify-center font-mono font-black text-lg border border-white shadow-md">
              E
            </div>
            <span className="text-2xl font-black uppercase tracking-widest text-white">
              ExamSphere
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-mono uppercase tracking-widest mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
        </div>

        {/* Login Box */}
        <div
          style={{ borderRadius: "0px" }}
          className="bg-white border-2 border-zinc-900 shadow-2xl p-8 relative"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-950" />

          <div className="border-b border-zinc-200 pb-4 mb-6">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-950 flex items-center gap-2">
              <span>Admin Authentication</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Restricted console. Provide verified administrator credentials to manage examination portals.
            </p>
          </div>

          {error && (
            <div
              style={{ borderRadius: "0px" }}
              className="p-3 mb-5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-start gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <Input
              id="admin-email"
              label="Admin Email Address"
              type="email"
              placeholder="admin@examsphere.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Input
              id="admin-password"
              label="Admin Password"
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
                className="w-full font-bold uppercase tracking-wider"
              >
                Authorize & Enter Console
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Student or Candidate?</span>
            <Link
              to="/login"
              className="font-bold text-zinc-950 hover:underline uppercase tracking-wider text-[11px]"
            >
              Candidate Login →
            </Link>
          </div>
        </div>

        <div className="text-center mt-6 flex items-center justify-center gap-4 text-xs font-mono text-zinc-400">
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-white uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Homepage
          </Link>
          <span>•</span>
          <Link
            to="/login"
            className="hover:text-white uppercase tracking-widest transition-colors"
          >
            Student Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
