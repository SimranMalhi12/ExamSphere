import React, { useState, useEffect } from "react";
import { getAllStudents } from "../../services/superAdminService";
import { useToast } from "../../context/ToastContext";
import {
  GraduationCap,
  Search,
  RefreshCw,
  Mail,
  User,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const Students = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudents();
      setStudents(data || []);
    } catch (err) {
      toast.error("Failed to load candidate directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest border border-blue-500/20">
              Platform Registry
            </span>
            <span className="text-xs font-mono text-zinc-500">Candidate Directory</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
            Registered Candidates
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global directory of all registered students, test activity volumes, and average performance scores.
          </p>
        </div>

        <button
          onClick={fetchStudents}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Fetching Candidates...
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <GraduationCap className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-zinc-300">No candidates registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Candidate</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Total Attempts</th>
                  <th className="py-3.5 px-4 font-bold">Average Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-blue-400">
                          {student.fullName ? student.fullName.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{student.fullName}</p>
                          <p className="font-mono text-[11px] text-zinc-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-mono uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-zinc-300">
                      {student.totalAttempts} exams taken
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span
                        className={`font-bold ${
                          student.averageScore >= 50 ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {student.averageScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
