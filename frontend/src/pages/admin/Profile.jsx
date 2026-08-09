import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/userService";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ShieldCheck, CheckCircle } from "lucide-react";

const AdminProfile = () => {
  const { user, role } = useAuth();
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    getUserProfile()
      .then((data) => setServerMessage(data))
      .catch(() => setServerMessage("Connected to ExamSphere"));
  }, []);

  const fullName = user?.fullName || "Administrator";
  const email = user?.email || "admin@examsphere.com";

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Admin Profile"
        subtitle="Manage your administrator credentials and platform authorization"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Profile" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-950 text-white font-mono font-bold text-2xl flex items-center justify-center border border-zinc-950 mb-4">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-base font-bold uppercase tracking-tight text-zinc-950">
            {fullName}
          </h3>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">{email}</p>
          <div className="mt-4">
            <Badge variant="default">{role || "ADMIN"}</Badge>
          </div>
          <div className="w-full mt-6 pt-4 border-t border-zinc-100 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-600">
              <span>Security Level</span>
              <span className="font-mono font-bold text-zinc-950">Level 1 (Root)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span>Auth Method</span>
              <span className="font-mono font-bold text-zinc-950">JWT Bearer</span>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card title="Account Information" subtitle="System credentials and access levels">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 py-2 border-b border-zinc-100">
                <span className="font-mono text-zinc-500 uppercase">Full Name</span>
                <span className="col-span-2 font-bold text-zinc-900">{fullName}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-zinc-100">
                <span className="font-mono text-zinc-500 uppercase">Email Address</span>
                <span className="col-span-2 font-mono text-zinc-900">{email}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-zinc-100">
                <span className="font-mono text-zinc-500 uppercase">System Role</span>
                <span className="col-span-2 font-bold text-zinc-900 uppercase">{role || "ADMIN"}</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-zinc-100">
                <span className="font-mono text-zinc-500 uppercase">API Status</span>
                <span className="col-span-2 font-mono text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> {serverMessage || "Online"}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Platform Privileges" subtitle="Permissions granted to administrator role">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                "Create, modify and delete Categories",
                "Create and organize academic Subjects",
                "Build MCQ Question Banks with keys",
                "Publish and schedule Timed Exams",
                "Evaluate Candidate Attempts & Scoring",
                "Full REST API Administrative Access",
              ].map((priv, i) => (
                <div
                  key={i}
                  className="p-3 bg-zinc-50 border border-zinc-200 flex items-start gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-zinc-950 shrink-0 mt-0.5" />
                  <span className="text-zinc-700 font-medium">{priv}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
