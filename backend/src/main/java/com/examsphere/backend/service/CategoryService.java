package com.examsphere.backend.service;

import com.examsphere.backend.dto.CategoryRequest;
import com.examsphere.backend.dto.CategoryResponse;
import com.examsphere.backend.entity.Category;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.DuplicateResourceException;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.CategoryRepository;
import com.examsphere.backend.security.PermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PermissionValidator permissionValidator;

    // Create Category (Scoped to creating Admin)
    public CategoryResponse createCategory(CategoryRequest request) {
        permissionValidator.validateCanManageSubjects();

        User currentUser = permissionValidator.getCurrentUser();

        if (currentUser != null && categoryRepository.existsByNameAndCreatedBy_Id(request.getName().trim(), currentUser.getId())) {
            throw new DuplicateResourceException("Category with this name already exists in your workspace: " + request.getName());
        }

        Category category = Category.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .createdBy(currentUser)
                .build();

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    // Get All Categories (Scoped for Admins, Global for SuperAdmin / Students)
    public List<CategoryResponse> getAllCategories() {
        User currentUser = permissionValidator.getCurrentUser();

        if (currentUser != null && permissionValidator.isAdmin()) {
            return categoryRepository.findAllByCreatedBy_Id(currentUser.getId())
                    .stream()
                    .map(this::mapToResponse)
                    .toList();
        }

        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Category By ID
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return mapToResponse(category);
    }

    // Update Category
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        permissionValidator.validateCanManageSubjects();

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        permissionValidator.validateOwnershipOrSuperAdmin(category.getCreatedBy());

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    // Delete Category
    public String deleteCategory(Long id) {
        permissionValidator.validateCanManageSubjects();

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        permissionValidator.validateOwnershipOrSuperAdmin(category.getCreatedBy());

        categoryRepository.delete(category);

        return "Category Deleted Successfully";
    }

    // Helper Method
    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}