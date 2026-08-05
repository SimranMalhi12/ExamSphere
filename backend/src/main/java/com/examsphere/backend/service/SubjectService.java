package com.examsphere.backend.service;

import com.examsphere.backend.dto.SubjectRequest;
import com.examsphere.backend.dto.SubjectResponse;
import com.examsphere.backend.entity.Category;
import com.examsphere.backend.entity.Subject;
import com.examsphere.backend.repository.CategoryRepository;
import com.examsphere.backend.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final CategoryRepository categoryRepository;

    // Create Subject
    public SubjectResponse createSubject(SubjectRequest request) {

        if (subjectRepository.existsByName(request.getName())) {
            throw new RuntimeException("Subject already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Subject subject = Subject.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(category)
                .build();

        Subject savedSubject = subjectRepository.save(subject);

        return mapToResponse(savedSubject);
    }

    // Get All Subjects
    public List<SubjectResponse> getAllSubjects() {

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