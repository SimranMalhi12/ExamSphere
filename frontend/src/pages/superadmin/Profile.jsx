import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Shield,
  User,
  Mail,
  Key,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Terminal,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-amber-400 text-zinc-950 text-[10px] font-mono font-black uppercase tracking-widest">
            Identity
          </span>
          <span className="text-xs font-mono text-zinc-500">Root Account</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
          Master Profile & Authority
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Root administrator security profile, authority scope, and audit identifiers.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-zinc-800">
          <div className="w-16 h-16 bg-amber-400 text-zinc-950 font-black font-mono text-2xl flex items-center justify-center border-2 border-amber-300 shadow-xl">
            SA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white uppercase">
                {user?.fullName || "Super Administrator"}
              </h2>
              <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-mono font-bold uppercase">
                ROOT SUPER ADMIN
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              {user?.email || "superadmin@examsphere.com"}
            </p>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Unrestricted Root Capabilities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              "Provision & Manage Administrators",
              "Configure Granular Admin Capabilities",
              "Instant Admin Account Suspension",
              "Create & Edit Examination Matrix",
              "Author & Maintain Question Banks",
              "Curate Categories & Subjects",
              "Platform-Wide Submission & Anti-Cheat Audit",
              "Access System Diagnostics & Metrics",
            ].map((cap, i) => (
              <div
                key={i}
                className="p-3 bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-zinc-200">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-zinc-950 border border-zinc-800 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Security Protocol Notice
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
              The Super Administrator holds complete non-delegated master privileges across the ExamSphere network.
              Keep these credentials strictly confidential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
