package com.examsphere.backend.service;

import com.examsphere.backend.dto.SubjectRequest;
import com.examsphere.backend.dto.SubjectResponse;
import com.examsphere.backend.entity.Category;
import com.examsphere.backend.entity.Subject;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.DuplicateResourceException;
import com.examsphere.backend.repository.CategoryRepository;
import com.examsphere.backend.repository.SubjectRepository;
import com.examsphere.backend.repository.UserRepository;
import com.examsphere.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // Create Subject
    public SubjectResponse createSubject(SubjectRequest request) {

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        Long currentUserId = currentUser != null ? currentUser.getId() : null;

        if (currentUser == null) {
            throw new RuntimeException("Authentication Required: You must be logged in to create a subject.");
        }

        if (currentUser.getCanManageSubjects() != null && !currentUser.getCanManageSubjects()
                && !"SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            throw new RuntimeException("Permission Denied: Your admin account has not been granted permission to manage subjects. Please contact the Super Administrator.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Subject subject = Subject.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(category)
                .createdBy(currentUser)
                .build();

        Subject savedSubject = subjectRepository.save(subject);

        return mapToResponse(savedSubject);
    }

    // Get All Subjects (Isolated for Admin if caller is Admin)
    public List<SubjectResponse> getAllSubjects() {

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        if (currentUser != null && currentUser.getRole() != null) {
            String roleName = currentUser.getRole().getName();
            if ("ADMIN".equalsIgnoreCase(roleName)) {
                return subjectRepository.findByCreatedById(currentUser.getId())
                        .stream()
                        .map(this::mapToResponse)
                        .toList();
            } else if ("SUPER_ADMIN".equalsIgnoreCase(roleName)) {
                return subjectRepository.findAll()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();
            }
        }

        return subjectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Subject By Id
    public SubjectResponse getSubjectById(Long id) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        return mapToResponse(subject);
    }

    // Update Subject
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        validateOwnership(subject, currentUser);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        subject.setCategory(category);

        Subject updatedSubject = subjectRepository.save(subject);

        return mapToResponse(updatedSubject);
    }

    // Delete Subject
    public String deleteSubject(Long id) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        validateOwnership(subject, currentUser);

        subjectRepository.delete(subject);

        return "Subject Deleted Successfully";
    }

    private void validateOwnership(Subject subject, User currentUser) {
        if (currentUser != null && subject.getCreatedBy() != null) {
            if ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
                return;
            }
            if (!subject.getCreatedBy().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access Denied: You cannot modify subjects created by another administrator.");
            }
        }
    }

    // Helper Method
    private SubjectResponse mapToResponse(Subject subject) {

        int qCount = subject.getQuestions() != null ? subject.getQuestions().size() : 0;

        return SubjectResponse.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .categoryId(subject.getCategory().getId())
                .categoryName(subject.getCategory().getName())
                .createdById(subject.getCreatedBy() != null ? subject.getCreatedBy().getId() : null)
                .createdByName(subject.getCreatedBy() != null ? subject.getCreatedBy().getFullName() : null)
                .questionsCount(qCount)
                .build();
    }
}