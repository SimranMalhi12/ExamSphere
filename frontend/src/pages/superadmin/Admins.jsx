import React, { useEffect, useState } from "react";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} from "../../services/superAdminService";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { Modal, ConfirmDialog } from "../../components/ui/Modal";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import {
  ShieldCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Power,
  Shield,
} from "lucide-react";

const Admins = () => {
  const toast = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentAdmin, setCurrentAdmin] = useState(null);

  const initialForm = {
    fullName: "",
    email: "",
    password: "",
    canCreateExams: true,
    canManageQuestions: true,
    canManageSubjects: true,
    canViewSubmissions: true,
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllAdmins();
      setAdmins(data || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const validateCreateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password || formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData(initialForm);
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      password: "",
      canCreateExams: admin.canCreateExams ?? true,
      canManageQuestions: admin.canManageQuestions ?? true,
      canManageSubjects: admin.canManageSubjects ?? true,
      canViewSubmissions: admin.canViewSubmissions ?? true,
      isActive: admin.isActive ?? true,
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (admin) => {
    setCurrentAdmin(admin);
    setIsDeleteOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateCreateForm()) return;

    setSubmitting(true);
    try {
      await createAdmin({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        canCreateExams: formData.canCreateExams,
        canManageQuestions: formData.canManageQuestions,
        canManageSubjects: formData.canManageSubjects,
        canViewSubmissions: formData.canViewSubmissions,
      });
      toast.success(`Administrator "${formData.fullName}" provisioned successfully!`);
      setIsCreateOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Failed to provision administrator";
      toast.error(typeof msg === "string" ? msg : "Failed to create administrator");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        canCreateExams: formData.canCreateExams,
        canManageQuestions: formData.canManageQuestions,
        canManageSubjects: formData.canManageSubjects,
        canViewSubmissions: formData.canViewSubmissions,
        isActive: formData.isActive,
      };
      if (formData.password && formData.password.length >= 6) {
        payload.password = formData.password;
      }
      await updateAdmin(currentAdmin.id, payload);
      toast.success("Administrator permissions updated successfully!");
      setIsEditOpen(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update administrator";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    const nextStatus = !admin.isActive;
    try {
      await toggleAdminStatus(admin.id, nextStatus);
      toast.success(
        nextStatus
          ? `Administrator "${admin.fullName}" has been ACTIVATED.`
          : `Administrator "${admin.fullName}" has been SUSPENDED.`
      );
      loadData();
    } catch (err) {
      toast.error("Failed to update admin status");
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await deleteAdmin(currentAdmin.id);
      toast.success("Administrator account removed from platform.");
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete administrator");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      admin.fullName?.toLowerCase().includes(q) ||
      admin.email?.toLowerCase().includes(q) ||
      String(admin.id).includes(q);

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "ACTIVE" && admin.isActive) ||
      (statusFilter === "SUSPENDED" && !admin.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrator Governance & Permissions"
        subtitle="Provision new administrators, configure individual module capabilities, and regulate access"
        breadcrumbs={[{ label: "Super Admin", href: "/super-admin/dashboard" }, { label: "Administrators" }]}
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Provision New Admin
          </Button>
        }
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="w-full sm:w-80">
            <Input
              id="search"
              placeholder="Search admin by name or email..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              style={{ borderRadius: "0px" }}
              className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE only</option>
              <option value="SUSPENDED">SUSPENDED only</option>
            </select>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end sm:self-center">
          Total Admins: <span className="font-bold text-zinc-950">{admins.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading administrator directory..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Administrators"
          message="Could not communicate with the Super Admin backend service."
          onRetry={loadData}
        />
      ) : filteredAdmins.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title={searchQuery || statusFilter ? "No matching administrators" : "No administrators provisioned"}
          description={
            searchQuery || statusFilter
              ? "Try adjusting your search criteria or status filter."
              : "Provision your first administrator to grant them a dedicated exam management portal."
          }
          actionText={searchQuery || statusFilter ? undefined : "Provision Admin"}
          onAction={searchQuery || statusFilter ? undefined : handleOpenCreate}
        />
      ) : (
        <Table
          headers={[
            { label: "ID", className: "w-16" },
            { label: "Administrator Profile" },
            { label: "Created Resources" },
            { label: "Assigned Permissions" },
            { label: "Status" },
            { label: "Actions", className: "text-right w-64" },
          ]}
        >
          {filteredAdmins.map((admin) => (
            <tr key={admin.id} className="hover:bg-zinc-50 transition-colors">
              <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">#{admin.id}</td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-zinc-950 text-xs uppercase tracking-tight">
                  {admin.fullName}
                </div>
                <div className="text-zinc-500 font-mono text-[11px] mt-0.5">{admin.email}</div>
              </td>
              <td className="py-3.5 px-4 font-mono text-xs">
                <span className="font-bold text-zinc-950">{admin.examsCount ?? 0}</span> exams •{" "}
                <span className="text-zinc-600">{admin.questionsCount ?? 0}</span> questions
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                      admin.canCreateExams
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-zinc-100 text-zinc-400 border-zinc-200 line-through"
                    }`}
                  >
                    Exams
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                      admin.canManageQuestions
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-zinc-100 text-zinc-400 border-zinc-200 line-through"
                    }`}
                  >
                    Questions
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                      admin.canManageSubjects
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-zinc-100 text-zinc-400 border-zinc-200 line-through"
                    }`}
                  >
                    Subjects
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 border ${
                      admin.canViewSubmissions
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-zinc-100 text-zinc-400 border-zinc-200 line-through"
                    }`}
                  >
                    Submissions
                  </span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                {admin.isActive ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5">
                    <XCircle className="w-3 h-3" /> SUSPENDED
                  </span>
                )}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    variant={admin.isActive ? "secondary" : "primary"}
                    size="xs"
                    icon={Power}
                    onClick={() => handleToggleStatus(admin)}
                    title={admin.isActive ? "Suspend admin" : "Activate admin"}
                  >
                    {admin.isActive ? "Suspend" : "Activate"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    icon={Shield}
                    onClick={() => handleOpenEdit(admin)}
                    title="Configure permissions"
                  >
                    Permissions
                  </Button>
                  <Button
                    variant="danger"
                    size="xs"
                    icon={Trash2}
                    onClick={() => handleOpenDelete(admin)}
                    title="Delete administrator"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Provision Admin Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Provision Administrator Account"
        subtitle="Create an admin workspace and assign operational permissions"
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateSubmit} loading={submitting}>
              Provision Administrator
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            id="admin-name"
            label="Full Name"
            placeholder="e.g. Professor Alan Turing"
            icon={User}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={formErrors.fullName}
            required
            autoFocus
          />

          <Input
            id="admin-email"
            label="Email Address (Login ID)"
            type="email"
            placeholder="alan.turing@university.edu"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            required
          />

          <Input
            id="admin-pass"
            label="Initial Password"
            type="password"
            placeholder="Minimum 6 characters"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={formErrors.password}
            required
            helperText="Admin can sign in with this temporary password"
          />

          <div className="pt-3 border-t border-zinc-100">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 mb-2">
              Assigned Permissions & Capabilities
            </label>
            <div className="space-y-2.5 bg-zinc-50 p-3.5 border border-zinc-200 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canCreateExams}
                  onChange={(e) => setFormData({ ...formData, canCreateExams: e.target.checked })}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">Can Create & Publish Exams</span>
                  <span className="text-[11px] text-zinc-500">Allow this admin to build assessments and issue access codes</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canManageQuestions}
                  onChange={(e) => setFormData({ ...formData, canManageQuestions: e.target.checked })}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">Can Manage Question Bank</span>
                  <span className="text-[11px] text-zinc-500">Allow creating and modifying MCQs in private question catalogue</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canManageSubjects}
                  onChange={(e) => setFormData({ ...formData, canManageSubjects: e.target.checked })}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">Can Manage Subjects & Topics</span>
                  <span className="text-[11px] text-zinc-500">Allow adding new disciplines and categories</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canViewSubmissions}
                  onChange={(e) => setFormData({ ...formData, canViewSubmissions: e.target.checked })}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">Can View Candidate Submissions</span>
                  <span className="text-[11px] text-zinc-500">Allow reviewing student attempts and test scores</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Permissions Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Configure Permissions: ${currentAdmin?.fullName}`}
        subtitle={`Admin Account: ${currentAdmin?.email}`}
        maxWidth="max-w-xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit} loading={submitting}>
              Save Permissions
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            id="edit-name"
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <Input
            id="edit-pass"
            label="Reset Password (Optional)"
            type="password"
            placeholder="Leave empty to retain existing password"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="pt-3 border-t border-zinc-100">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 mb-2">
              Capabilities & Module Permissions
            </label>
            <div className="space-y-2.5 bg-zinc-50 p-3.5 border border-zinc-200 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canCreateExams}
                  onChange={(e) => setFormData({ ...formData, canCreateExams: e.target.checked })}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">Can Create & Publish Exams</span>
                  <span className="text-[11px] text-zinc-500">Grant or revoke exam creation ability</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canManageQuestions}
                  onChange={(e) => setFormData({ ...formData, canManageQuestions: e.target.checked })}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">Can Manage Question Bank</span>
                  <span className="text-[11px] text-zinc-500">Grant or revoke question bank editing</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canManageSubjects}
                  onChange={(e) => setFormData({ ...formData, canManageSubjects: e.target.checked })}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">Can Manage Subjects & Topics</span>
                  <span className="text-[11px] text-zinc-500">Grant or revoke subject configuration</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.canViewSubmissions}
                  onChange={(e) => setFormData({ ...formData, canViewSubmissions: e.target.checked })}
                  className="w-4 h-4 accent-zinc-950 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-zinc-950 block">Can View Candidate Submissions</span>
                  <span className="text-[11px] text-zinc-500">Grant or revoke student test results viewing</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Admin Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Administrator"
        message={`Are you sure you want to permanently remove administrator "${currentAdmin?.fullName}" (${currentAdmin?.email})? Their workspace and exams will be deleted.`}
        confirmText="Delete Admin"
        loading={submitting}
      />
    </div>
  );
};

export default Admins;
