import React, { useEffect, useState } from "react";
import { getAllStudents } from "../../services/superAdminService";
import PageHeader from "../../components/ui/PageHeader";
import { Input } from "../../components/ui/Input";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { Users, Search, GraduationCap } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllStudents();
      setStudents(data || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.fullName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      String(s.id).includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Directory"
        subtitle="Platform-wide registered test takers and candidates"
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin/dashboard" }, { label: "Candidates" }]}
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            id="search"
            placeholder="Search student by name or email..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end sm:self-center">
          Registered Candidates: <span className="font-bold text-zinc-950">{filteredStudents.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading candidate accounts..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Candidates"
          message="Could not retrieve student candidate list from server."
          onRetry={loadData}
        />
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates registered"
          description="Candidates will appear here once they register on the student signup portal."
        />
      ) : (
        <Table
          headers={[
            { label: "Candidate ID", className: "w-28" },
            { label: "Student Name" },
            { label: "Email Address" },
            { label: "Account Role" },
            { label: "Account Status" },
          ]}
        >
          {filteredStudents.map((s) => (
            <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
              <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">#{s.id}</td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2 font-bold text-xs text-zinc-950">
                  <GraduationCap className="w-4 h-4 text-zinc-400" />
                  <span>{s.fullName}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 font-mono text-xs text-zinc-600">{s.email}</td>
              <td className="py-3.5 px-4">
                <span className="text-[10px] font-mono font-bold uppercase bg-zinc-100 border border-zinc-300 px-2 py-0.5 text-zinc-800">
                  {s.role?.name || "STUDENT"}
                </span>
              </td>
              <td className="py-3.5 px-4 font-mono text-xs text-emerald-700 font-bold">
                ACTIVE
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};

export default Students;
