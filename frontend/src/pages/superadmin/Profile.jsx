import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/userService";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ShieldCheck, CheckCircle, Shield } from "lucide-react";

const SuperAdminProfile = () => {
  const { user, role } = useAuth();
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    getUserProfile()
      .then((data) => setServerMessage(data))
      .catch(() => setServerMessage("Connected to ExamSphere"));
  }, []);

  const fullName = user?.fullName || "Super Administrator";
  const email = user?.email || "superadmin@examsphere.com";

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Super Administrator Profile"
        subtitle="Platform governance credentials and root security authorization"
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin/dashboard" }, { label: "Profile" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-zinc-950 text-white font-mono font-bold text-2xl flex items-center justify-center border-2 border-amber-400 mb-4">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-base font-bold uppercase tracking-tight text-zinc-950">
            {fullName}
          </h3>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">{email}</p>
          <div className="mt-4">
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 bg-amber-400 text-zinc-950 border border-zinc-950">
              SUPER_ADMIN (ROOT)
            </span>
          </div>
          <div className="w-full mt-6 pt-4 border-t border-zinc-100 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-600">
              <span>Security Level</span>
              <span className="font-mono font-bold text-amber-600">Tier 0 (Root Master)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600">
              <span>Authorization</span>
              <span className="font-mono font-bold text-zinc-950">Full Master Authority</span>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card title="Root Account Information" subtitle="Platform master credentials">
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
                <span className="col-span-2 font-bold text-zinc-900 uppercase">SUPER_ADMIN</span>
              </div>
              <div className="grid grid-cols-3 py-2 border-b border-zinc-100">
                <span className="font-mono text-zinc-500 uppercase">Master Node</span>
                <span className="col-span-2 font-mono text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> {serverMessage || "System Online"}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Platform Master Powers" subtitle="Super Administrator privileges">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                "Provision and terminate Administrator accounts",
                "Assign and regulate granular Admin permissions",
                "Activate and suspend platform access",
                "Inspect global examinations across all portals",
                "Supervise candidate directories and test records",
                "Audit platform metrics and pass rates",
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

export default SuperAdminProfile;
