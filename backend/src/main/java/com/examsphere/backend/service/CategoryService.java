package com.examsphere.backend.service;

import com.examsphere.backend.dto.CategoryRequest;
import com.examsphere.backend.dto.CategoryResponse;
import com.examsphere.backend.entity.Category;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.DuplicateResourceException;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.CategoryRepository;
import com.examsphere.backend.repository.UserRepository;
import com.examsphere.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Create Category
    public CategoryResponse createCategory(CategoryRequest request) {

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        if (currentUser == null) {
            throw new RuntimeException("Authentication Required: You must be logged in to create a category.");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(currentUser)
                .build();

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    // Get All Categories (Isolated for Admin if caller is Admin)
    public List<CategoryResponse> getAllCategories() {

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        if (currentUser != null && currentUser.getRole() != null) {
            String roleName = currentUser.getRole().getName();
            if ("ADMIN".equalsIgnoreCase(roleName)) {
                return categoryRepository.findByCreatedById(currentUser.getId())
                        .stream()
                        .map(this::mapToResponse)
                        .toList();
            } else if ("SUPER_ADMIN".equalsIgnoreCase(roleName)) {
                return categoryRepository.findAll()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();
            }
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

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        validateOwnership(category, currentUser);

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    // Delete Category
    public String deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        validateOwnership(category, currentUser);

        categoryRepository.delete(category);

        return "Category Deleted Successfully";
    }

    private void validateOwnership(Category category, User currentUser) {
        if (currentUser != null && category.getCreatedBy() != null) {
            if ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
                return;
            }
            if (!category.getCreatedBy().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access Denied: You do not have permission to modify categories created by another administrator.");
            }
        }
    }

    // Helper Method
    private CategoryResponse mapToResponse(Category category) {
        Long createdById = category.getCreatedBy() != null ? category.getCreatedBy().getId() : null;
        String createdByName = category.getCreatedBy() != null ? category.getCreatedBy().getFullName() : "System";

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdById(createdById)
                .createdByName(createdByName)
                .build();
    }
}