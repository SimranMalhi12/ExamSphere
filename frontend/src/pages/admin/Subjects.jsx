import React, { useEffect, useState } from "react";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../services/subjectService";
import { getCategories } from "../../services/categoryService";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Input, Select, Textarea } from "../../components/ui/Input";
import { Modal, ConfirmDialog } from "../../components/ui/Modal";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { BookOpen, Plus, Search, Edit2, Trash2 } from "lucide-react";

const Subjects = () => {
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentSubject, setCurrentSubject] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", categoryId: "" });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [subjectsData, categoriesData] = await Promise.all([
        getSubjects(),
        getCategories(),
      ]);
      setSubjects(subjectsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Subject name is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.categoryId) errors.categoryId = "Please select a category";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      description: "",
      categoryId: categories.length > 0 ? String(categories[0].id) : "",
    });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setCurrentSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description || "",
      categoryId: String(subject.categoryId || ""),
    });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (subject) => {
    setCurrentSubject(subject);
    setIsDeleteOpen(true);
  };

  const getCleanErrorMessage = (err, fallback) => {
    if (err.response?.data) {
      const data = err.response.data;
      if (typeof data === "string") {
        if (data.includes("default message [")) {
          const match = data.match(/default message \[([^\]]+)\]/);
          if (match && match[1]) return match[1];
        }
        return data;
      }
      if (data.message) {
        if (data.message.includes("default message [")) {
          const match = data.message.match(/default message \[([^\]]+)\]/);
          if (match && match[1]) return match[1];
        }
        return data.message;
      }
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0].defaultMessage || data.errors[0];
      }
    }
    return fallback;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createSubject({
        name: formData.name.trim(),
        description: formData.description.trim() || formData.name.trim(),
        categoryId: Number(formData.categoryId),
      });
      toast.success("Subject created successfully");
      setIsCreateOpen(false);
      loadData();
    } catch (err) {
      const msg = getCleanErrorMessage(err, "Failed to create subject");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await updateSubject(currentSubject.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || formData.name.trim(),
        categoryId: Number(formData.categoryId),
      });
      toast.success("Subject updated successfully");
      setIsEditOpen(false);
      loadData();
    } catch (err) {
      const msg = getCleanErrorMessage(err, "Failed to update subject");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await deleteSubject(currentSubject.id);
      toast.success("Subject deleted successfully");
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
      const msg = getCleanErrorMessage(err, "Failed to delete subject");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }));

  const filteredSubjects = subjects.filter((subj) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      subj.name?.toLowerCase().includes(q) ||
      subj.description?.toLowerCase().includes(q) ||
      subj.categoryName?.toLowerCase().includes(q) ||
      String(subj.id).includes(q);

    const matchesCategory =
      !selectedCategoryFilter || String(subj.categoryId) === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subject Management"
        subtitle="Manage academic subjects and curriculum topics linked to categories"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Subjects" }]}
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Add Subject
          </Button>
        }
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="w-full sm:w-80">
            <Input
              id="search"
              placeholder="Search subjects..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-60">
            <select
              style={{ borderRadius: "0px" }}
              className="w-full bg-white border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 outline-none focus:border-zinc-950 cursor-pointer"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end sm:self-center">
          Total Subjects: <span className="font-bold text-zinc-950">{subjects.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading subjects..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Subjects"
          message="Could not retrieve the subject list from the server."
          onRetry={loadData}
        />
      ) : filteredSubjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={searchQuery || selectedCategoryFilter ? "No matching subjects" : "No subjects created"}
          description={
            searchQuery || selectedCategoryFilter
              ? "Try adjusting your search or category filter."
              : "Get started by adding your first subject."
          }
          actionText={searchQuery || selectedCategoryFilter ? undefined : "Add First Subject"}
          onAction={searchQuery || selectedCategoryFilter ? undefined : handleOpenCreate}
        />
      ) : (
        <Table
          headers={[
            { label: "ID", className: "w-16" },
            { label: "Subject Name" },
            { label: "Category" },
            { label: "Description" },
            { label: "Actions", className: "text-right w-44" },
          ]}
        >
          {filteredSubjects.map((subject) => (
            <tr key={subject.id} className="hover:bg-zinc-50 transition-colors">
              <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">#{subject.id}</td>
              <td className="py-3.5 px-4 font-bold text-zinc-950 uppercase tracking-tight">
                {subject.name}
              </td>
              <td className="py-3.5 px-4 font-mono text-xs text-zinc-700">
                <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-300">
                  {subject.categoryName || "Unassigned"}
                </span>
              </td>
              <td className="py-3.5 px-4 text-zinc-600 max-w-sm truncate">
                {subject.description || "—"}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    onClick={() => handleOpenEdit(subject)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleOpenDelete(subject)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Subject"
        subtitle="Configure subject details and assign to a parent category"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsCreateOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateSubmit}
              loading={submitting}
            >
              Save Subject
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            id="subj-name"
            label="Subject Name"
            placeholder="e.g. Core Java, Data Structures"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            autoFocus
          />

          <Select
            id="subj-category"
            label="Category Classification"
            options={categoryOptions}
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            error={formErrors.categoryId}
            required
          />

          <Textarea
            id="subj-desc"
            label="Description"
            placeholder="Overview of subject syllabus"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={formErrors.description}
            rows={3}
            required
          />
        </form>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Subject"
        subtitle={`Updating subject #${currentSubject?.id}`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSubmit}
              loading={submitting}
            >
              Update Subject
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            id="edit-subj-name"
            label="Subject Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            autoFocus
          />

          <Select
            id="edit-subj-category"
            label="Category Classification"
            options={categoryOptions}
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            error={formErrors.categoryId}
            required
          />

          <Textarea
            id="edit-subj-desc"
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={formErrors.description}
            rows={3}
            required
          />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        message={`Are you sure you want to permanently delete subject "${currentSubject?.name}"? Questions associated with this subject will be removed.`}
        confirmText="Delete Subject"
        loading={submitting}
      />
    </div>
  );
};

export default Subjects;