package com.examsphere.backend.service;

import com.examsphere.backend.dto.SubjectRequest;
import com.examsphere.backend.dto.SubjectResponse;
import com.examsphere.backend.entity.Category;
import com.examsphere.backend.entity.Subject;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.DuplicateResourceException;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.CategoryRepository;
import com.examsphere.backend.repository.SubjectRepository;
import com.examsphere.backend.security.PermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final CategoryRepository categoryRepository;
    private final PermissionValidator permissionValidator;

    // Create Subject (Scoped to creating Admin)
    public SubjectResponse createSubject(SubjectRequest request) {
        permissionValidator.validateCanManageSubjects();

        User currentUser = permissionValidator.getCurrentUser();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (currentUser != null && subjectRepository.existsByNameAndCategory_IdAndCreatedBy_Id(
                request.getName().trim(), category.getId(), currentUser.getId())) {
            throw new DuplicateResourceException("Subject with this name already exists in this category: " + request.getName());
        }

        Subject subject = Subject.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .category(category)
                .createdBy(currentUser)
                .build();

        Subject savedSubject = subjectRepository.save(subject);

        return mapToResponse(savedSubject);
    }

    // Get All Subjects (Scoped for Admins, Global for SuperAdmin / Students)
    public List<SubjectResponse> getAllSubjects() {
        User currentUser = permissionValidator.getCurrentUser();

        if (currentUser != null && permissionValidator.isAdmin()) {
            return subjectRepository.findAllByCreatedBy_Id(currentUser.getId())
                    .stream()
                    .map(this::mapToResponse)
                    .toList();
        }

        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Subject By Id
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        return mapToResponse(subject);
    }

    // Update Subject
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        permissionValidator.validateCanManageSubjects();

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        permissionValidator.validateOwnershipOrSuperAdmin(subject.getCreatedBy());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        subject.setName(request.getName().trim());
        subject.setDescription(request.getDescription());
        subject.setCategory(category);

        Subject updatedSubject = subjectRepository.save(subject);

        return mapToResponse(updatedSubject);
    }

    // Delete Subject
    public String deleteSubject(Long id) {
        permissionValidator.validateCanManageSubjects();

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        permissionValidator.validateOwnershipOrSuperAdmin(subject.getCreatedBy());

        subjectRepository.delete(subject);

        return "Subject Deleted Successfully";
    }

    // Helper Method
    private SubjectResponse mapToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .categoryId(subject.getCategory().getId())
                .categoryName(subject.getCategory().getName())
                .build();
    }
}