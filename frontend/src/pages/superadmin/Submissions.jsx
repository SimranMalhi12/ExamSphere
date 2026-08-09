import React, { useState, useEffect } from "react";
import { getAllAttempts } from "../../services/superAdminService";
import { useToast } from "../../context/ToastContext";
import {
  FileCheck2,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Calendar,
  Award,
} from "lucide-react";

const Submissions = () => {
  const toast = useToast();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const data = await getAllAttempts();
      setAttempts(data || []);
    } catch (err) {
      toast.error("Failed to load platform submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch =
      attempt.examTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    if (resultFilter === "PASSED") return matchesSearch && attempt.passed;
    if (resultFilter === "FAILED") return matchesSearch && !attempt.passed;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest border border-cyan-500/20">
              Audit Stream
            </span>
            <span className="text-xs font-mono text-zinc-500">Live Submission Registry</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
            Global Submission Audit Log
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Complete platform audit record of all exam attempts, scores, and pass/fail verdicts.
          </p>
        </div>

        <button
          onClick={fetchAttempts}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search candidate or exam..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-mono text-zinc-400 uppercase">Verdict:</span>
          {["ALL", "PASSED", "FAILED"].map((filter) => (
            <button
              key={filter}
              onClick={() => setResultFilter(filter)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors border ${
                resultFilter === filter
                  ? "bg-amber-400 text-zinc-950 border-amber-300"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Fetching Submissions...
            </p>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileCheck2 className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-zinc-300">No submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Candidate</th>
                  <th className="py-3.5 px-4 font-bold">Exam Title</th>
                  <th className="py-3.5 px-4 font-bold">Score</th>
                  <th className="py-3.5 px-4 font-bold">Verdict</th>
                  <th className="py-3.5 px-4 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-white text-sm">{attempt.studentName}</p>
                      <p className="font-mono text-[11px] text-zinc-400">{attempt.studentEmail}</p>
                    </td>
                    <td className="py-4 px-4 font-mono text-zinc-200">
                      {attempt.examTitle}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm font-bold text-white">
                      {attempt.score ?? 0}%
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase border ${
                          attempt.passed
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                            : "bg-rose-950/80 text-rose-400 border-rose-800"
                        }`}
                      >
                        {attempt.passed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Passed</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-400" />
                            <span>Failed</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>{attempt.attemptDate ? new Date(attempt.attemptDate).toLocaleString() : "Completed"}</span>
                      </div>
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

export default Submissions;
