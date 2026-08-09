import React, { useState, useEffect } from "react";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../services/superAdminService";
import { useToast } from "../../context/ToastContext";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw,
  Lock,
  Mail,
  User,
  Check,
  X,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  FolderTree,
  FileCheck,
} from "lucide-react";

const Admins = () => {
  const toast = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State for Create
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    canCreateExams: true,
    canManageQuestions: true,
    canManageSubjects: true,
    canViewSubmissions: true,
    isActive: true,
  });

  // Form State for Edit
  const [editForm, setEditForm] = useState({
    fullName: "",
    password: "",
    canCreateExams: true,
    canManageQuestions: true,
    canManageSubjects: true,
    canViewSubmissions: true,
    isActive: true,
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAllAdmins();
      setAdmins(data || []);
    } catch (err) {
      toast.error("Failed to load administrator accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.fullName.trim() || !createForm.email.trim() || !createForm.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setActionLoading(true);
    try {
      await createAdmin(createForm);
      toast.success(`Admin ${createForm.fullName} provisioned successfully!`);
      setShowCreateModal(false);
      setCreateForm({
        fullName: "",
        email: "",
        password: "",
        canCreateExams: true,
        canManageQuestions: true,
        canManageSubjects: true,
        canViewSubmissions: true,
        isActive: true,
      });
      fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to provision administrator";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditForm({
      fullName: admin.fullName || "",
      password: "",
      canCreateExams: admin.canCreateExams !== false,
      canManageQuestions: admin.canManageQuestions !== false,
      canManageSubjects: admin.canManageSubjects !== false,
      canViewSubmissions: admin.canViewSubmissions !== false,
      isActive: admin.isActive !== false,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    setActionLoading(true);
    try {
      const payload = {
        fullName: editForm.fullName.trim(),
        canCreateExams: editForm.canCreateExams,
        canManageQuestions: editForm.canManageQuestions,
        canManageSubjects: editForm.canManageSubjects,
        canViewSubmissions: editForm.canViewSubmissions,
        isActive: editForm.isActive,
      };

      if (editForm.password.trim()) {
        payload.password = editForm.password.trim();
      }

      await updateAdmin(selectedAdmin.id, payload);
      toast.success("Administrator permissions updated successfully!");
      setShowEditModal(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update administrator";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      const nextStatus = !admin.isActive;
      await updateAdmin(admin.id, { isActive: nextStatus });
      toast.success(`Admin account ${nextStatus ? "Activated" : "Suspended"}`);
      fetchAdmins();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdmin) return;
    setActionLoading(true);
    try {
      await deleteAdmin(selectedAdmin.id);
      toast.success("Administrator account deleted successfully.");
      setShowDeleteModal(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (err) {
      toast.error("Failed to delete administrator account");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter Logic
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "ACTIVE") return matchesSearch && admin.isActive;
    if (statusFilter === "SUSPENDED") return matchesSearch && !admin.isActive;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-400 text-zinc-950 text-[10px] font-mono font-black uppercase tracking-widest">
              Access Control
            </span>
            <span className="text-xs font-mono text-zinc-500">Provisioning & Granular Roles</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
            Administrator Provisioning
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create administrators, assign granular permissions, toggle access status, and audit permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdmins}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-amber-400/10"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New Admin</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-mono text-zinc-400 uppercase">Filter Status:</span>
          {["ALL", "ACTIVE", "SUSPENDED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors border ${
                statusFilter === status
                  ? "bg-amber-400 text-zinc-950 border-amber-300"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto mb-2" />
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Loading Administrators...
            </p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-zinc-300">No administrator accounts found</p>
            <p className="text-xs text-zinc-500 font-mono">
              {searchTerm ? "Try clearing your search query" : "Click 'Provision New Admin' to create one"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Admin User</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Assigned Permissions</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-sans">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* User Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-amber-400 shrink-0">
                          {admin.fullName ? admin.fullName.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{admin.fullName}</p>
                          <p className="font-mono text-[11px] text-zinc-400">{admin.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                          admin.isActive
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-800"
                            : "bg-rose-950/80 text-rose-300 border-rose-800 hover:bg-emerald-950/80 hover:text-emerald-300 hover:border-emerald-800"
                        }`}
                      >
                        {admin.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-400" />
                            <span>Suspended</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Permissions Badges */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono border flex items-center gap-1 ${
                            admin.canCreateExams
                              ? "bg-purple-950/50 text-purple-300 border-purple-800"
                              : "bg-zinc-950 text-zinc-600 border-zinc-800 line-through"
                          }`}
                        >
                          <BookOpen className="w-2.5 h-2.5" /> Exams
                        </span>

                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono border flex items-center gap-1 ${
                            admin.canManageQuestions
                              ? "bg-blue-950/50 text-blue-300 border-blue-800"
                              : "bg-zinc-950 text-zinc-600 border-zinc-800 line-through"
                          }`}
                        >
                          <HelpCircle className="w-2.5 h-2.5" /> Questions
                        </span>

                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono border flex items-center gap-1 ${
                            admin.canManageSubjects
                              ? "bg-amber-950/50 text-amber-300 border-amber-800"
                              : "bg-zinc-950 text-zinc-600 border-zinc-800 line-through"
                          }`}
                        >
                          <FolderTree className="w-2.5 h-2.5" /> Subjects
                        </span>

                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono border flex items-center gap-1 ${
                            admin.canViewSubmissions
                              ? "bg-cyan-950/50 text-cyan-300 border-cyan-800"
                              : "bg-zinc-950 text-zinc-600 border-zinc-800 line-through"
                          }`}
                        >
                          <FileCheck className="w-2.5 h-2.5" /> Submissions
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 hover:border-amber-400 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3 h-3 text-amber-400" />
                          <span>Permissions</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-rose-800 text-zinc-400 hover:text-rose-400 transition-colors"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================== MODAL: CREATE ADMIN ===================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-zinc-700 max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest">
                <UserPlus className="w-4 h-4" /> Provisioning Wizard
              </div>
              <h2 className="text-lg font-black uppercase text-white mt-1">
                Provision Administrator Account
              </h2>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Vance"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. prof.vance@university.edu"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Initial Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Granular Capabilities Section */}
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5">
                  Granular Permission Flags
                </p>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.canCreateExams}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, canCreateExams: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-400 rounded-none cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Can Create & Manage Exams</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Author, edit, configure, and publish examination schedules.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.canManageQuestions}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, canManageQuestions: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-400 rounded-none cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Can Manage Question Bank</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Insert, modify, and delete question items & correct answer keys.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.canManageSubjects}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, canManageSubjects: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-400 rounded-none cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Can Manage Categories & Subjects</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Create subjects, curricula categories, and topics.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.canViewSubmissions}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, canViewSubmissions: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-400 rounded-none cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">Can View Candidate Submissions</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Inspect test attempt logs, anti-cheat scores, and individual results.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-xs font-mono font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider"
                >
                  {actionLoading ? "Provisioning..." : "Provision Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: EDIT PERMISSIONS ===================== */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-zinc-700 max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest">
                <Edit2 className="w-4 h-4" /> Capabilities Editor
              </div>
              <h2 className="text-lg font-black uppercase text-white mt-1">
                Edit Permissions: {selectedAdmin.fullName}
              </h2>
              <p className="text-xs font-mono text-zinc-400">{selectedAdmin.email}</p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-zinc-400">
                  Reset Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  placeholder="New password (optional)"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Status Switch */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Account Status</p>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Suspended admins cannot authenticate into the platform.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase border ${
                    editForm.isActive
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : "bg-rose-950 text-rose-400 border-rose-800"
                  }`}
                >
                  {editForm.isActive ? "Active" : "Suspended"}
                </button>
              </div>

              {/* Permissions Checkboxes */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Assigned Privileges
                </p>

                <label className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.canCreateExams}
                    onChange={(e) =>
                      setEditForm({ ...editForm, canCreateExams: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Can Create & Manage Exams</p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Author, edit, and publish exams.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.canManageQuestions}
                    onChange={(e) =>
                      setEditForm({ ...editForm, canManageQuestions: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Can Manage Question Bank</p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Add, update, or remove question items.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.canManageSubjects}
                    onChange={(e) =>
                      setEditForm({ ...editForm, canManageSubjects: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Can Manage Subjects & Categories</p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Add and update subjects and categories.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.canViewSubmissions}
                    onChange={(e) =>
                      setEditForm({ ...editForm, canViewSubmissions: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Can View Candidate Submissions</p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Inspect submissions and test results.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-xs font-mono font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: DELETE CONFIRMATION ===================== */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-rose-900 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-black uppercase text-white">
                Delete Administrator Account
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to permanently delete administrator account{" "}
              <strong className="text-white font-mono">{selectedAdmin.email}</strong>? This action
              cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-xs font-mono font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider"
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admins;
