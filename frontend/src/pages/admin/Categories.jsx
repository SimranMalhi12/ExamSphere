import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { Modal, ConfirmDialog } from "../../components/ui/Modal";
import { Table } from "../../components/ui/Table";
import { Loader } from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import { Layers, Plus, Search, Edit2, Trash2 } from "lucide-react";

const Categories = () => {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({});

  const loadCategories = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({ name: "", description: "" });
    setFormErrors({});
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (category) => {
    setCurrentCategory(category);
    setFormData({ name: category.name, description: category.description || "" });
    setFormErrors({});
    setIsEditOpen(true);
  };

  const handleOpenDelete = (category) => {
    setCurrentCategory(category);
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
      await createCategory({
        name: formData.name.trim(),
        description: formData.description.trim() || formData.name.trim(),
      });
      toast.success("Category created successfully");
      setIsCreateOpen(false);
      loadCategories();
    } catch (err) {
      const msg = getCleanErrorMessage(err, "Failed to create category");
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
      await updateCategory(currentCategory.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || formData.name.trim(),
      });
      toast.success("Category updated successfully");
      setIsEditOpen(false);
      loadCategories();
    } catch (err) {
      const msg = getCleanErrorMessage(err, "Failed to update category");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      await deleteCategory(currentCategory.id);
      toast.success("Category deleted successfully");
      setIsDeleteOpen(false);
      loadCategories();
    } catch (err) {
      const msg = getCleanErrorMessage(err, "Failed to delete category");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q) ||
      String(cat.id).includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        subtitle="Manage academic domains and exam classifications"
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Categories" }]}
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Add Category
          </Button>
        }
      />

      <div className="bg-white border border-zinc-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-96">
          <Input
            id="search"
            placeholder="Search categories by name, ID or keywords..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-xs font-mono text-zinc-500 self-end sm:self-center">
          Total Categories: <span className="font-bold text-zinc-950">{categories.length}</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading categories..." />
      ) : error ? (
        <ErrorState
          title="Failed to Load Categories"
          message="Could not retrieve the category list from the server."
          onRetry={loadCategories}
        />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={searchQuery ? "No matching categories" : "No categories created"}
          description={
            searchQuery
              ? "Try refining your search keyword."
              : "Get started by adding your first category classification."
          }
          actionText={searchQuery ? undefined : "Add First Category"}
          onAction={searchQuery ? undefined : handleOpenCreate}
        />
      ) : (
        <Table
          headers={[
            { label: "ID", className: "w-16" },
            { label: "Category Name" },
            { label: "Description" },
            { label: "Actions", className: "text-right w-44" },
          ]}
        >
          {filteredCategories.map((category) => (
            <tr key={category.id} className="hover:bg-zinc-50 transition-colors">
              <td className="py-3.5 px-4 font-mono font-bold text-zinc-500">#{category.id}</td>
              <td className="py-3.5 px-4 font-bold text-zinc-950 uppercase tracking-tight">
                {category.name}
              </td>
              <td className="py-3.5 px-4 text-zinc-600 max-w-md truncate">
                {category.description || "—"}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit2}
                    onClick={() => handleOpenEdit(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleOpenDelete(category)}
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
        title="Add New Category"
        subtitle="Create a new classification category"
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
              Save Category
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            id="cat-name"
            label="Category Name"
            placeholder="e.g. Computer Science, Mathematics"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            autoFocus
          />
          <Textarea
            id="cat-desc"
            label="Description"
            placeholder="Brief overview of this category domain"
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
        title="Edit Category"
        subtitle={`Updating category #${currentCategory?.id}`}
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
              Update Category
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            id="edit-cat-name"
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            autoFocus
          />
          <Textarea
            id="edit-cat-desc"
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
        title="Delete Category"
        message={`Are you sure you want to permanently delete category "${currentCategory?.name}"? All associated subjects may be affected.`}
        confirmText="Delete Category"
        loading={submitting}
      />
    </div>
  );
};

export default Categories;