package com.examsphere.backend.service;

import com.examsphere.backend.dto.ExamRequest;
import com.examsphere.backend.dto.ExamResponse;
import com.examsphere.backend.entity.Exam;
import com.examsphere.backend.entity.ExamStatus;
import com.examsphere.backend.entity.Subject;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.ExamRepository;
import com.examsphere.backend.repository.SubjectRepository;
import com.examsphere.backend.repository.UserRepository;
import com.examsphere.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    // Create Exam
    public ExamResponse createExam(ExamRequest request) {

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        if (currentUser == null) {
            throw new RuntimeException("Authentication Required: You must be logged in to create an exam.");
        }

        if (currentUser.getCanCreateExams() != null && !currentUser.getCanCreateExams()
                && !"SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            throw new RuntimeException("Permission Denied: Your admin account has not been granted permission to create exams. Please contact the Super Administrator.");
        }

        String code = request.getAccessCode();
        if (code == null || code.trim().isEmpty()) {
            code = generateUniqueAccessCode(request.getTitle());
        } else {
            code = code.trim().toUpperCase();
        }

        Exam exam = Exam.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .duration(request.getDuration())
                .totalMarks(request.getTotalMarks())
                .passingMarks(request.getPassingMarks())
                .status(request.getStatus())
                .subject(subject)
                .createdBy(currentUser)
                .accessCode(code)
                .build();

        Exam savedExam = examRepository.save(exam);

        return mapToResponse(savedExam);
    }

    // Get All Exams (Strictly Isolated for Admin, Full for Super Admin, Published for Students)
    public List<ExamResponse> getAllExams() {

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        if (currentUser != null && currentUser.getRole() != null) {
            String roleName = currentUser.getRole().getName();
            if ("ADMIN".equalsIgnoreCase(roleName)) {
                // Strict isolation: only exams created by this specific admin
                return examRepository.findByCreatedById(currentUser.getId())
                        .stream()
                        .map(this::mapToResponse)
                        .toList();
            } else if ("SUPER_ADMIN".equalsIgnoreCase(roleName)) {
                // Super Admin sees all exams
                return examRepository.findAll()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();
            }
        }

        // Students & public see all published exams
        return examRepository.findByStatus(ExamStatus.PUBLISHED)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Exams explicitly for the logged-in admin
    public List<ExamResponse> getMyExams() {
        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        if (currentUser == null) {
            return List.of();
        }
        return examRepository.findByCreatedById(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Exam By Id
    public ExamResponse getExamById(Long id) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        return mapToResponse(exam);
    }

    // Get Exam By Access Code
    public ExamResponse getExamByAccessCode(String accessCode) {
        if (accessCode == null || accessCode.trim().isEmpty()) {
            throw new ResourceNotFoundException("Access code is required");
        }

        Exam exam = examRepository.findByAccessCode(accessCode.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Exam with access code '" + accessCode + "' not found"));

        return mapToResponse(exam);
    }

    // Update Exam
    public ExamResponse updateExam(Long id, ExamRequest request) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        validateExamOwnership(exam, currentUser);

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setDuration(request.getDuration());
        exam.setTotalMarks(request.getTotalMarks());
        exam.setPassingMarks(request.getPassingMarks());
        exam.setStatus(request.getStatus());
        exam.setSubject(subject);

        if (request.getAccessCode() != null && !request.getAccessCode().trim().isEmpty()) {
            exam.setAccessCode(request.getAccessCode().trim().toUpperCase());
        }

        Exam updatedExam = examRepository.save(exam);

        return mapToResponse(updatedExam);
    }

    // Delete Exam
    public String deleteExam(Long id) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        validateExamOwnership(exam, currentUser);

        examRepository.delete(exam);

        return "Exam Deleted Successfully";
    }

    // Helper: validate ownership
    private void validateExamOwnership(Exam exam, User currentUser) {
        if (currentUser != null && exam.getCreatedBy() != null) {
            if ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
                return; // Super Admin has global override permission
            }
            if (!exam.getCreatedBy().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access Denied: You do not have permission to modify exams created by another administrator.");
            }
        }
    }

    // Helper: generate unique short access code
    private String generateUniqueAccessCode(String title) {
        String prefix = "EXAM";
        if (title != null && title.length() >= 3) {
            prefix = title.substring(0, Math.min(4, title.length())).replaceAll("[^a-zA-Z]", "").toUpperCase();
            if (prefix.isEmpty()) prefix = "EXAM";
        }
        String randomPart = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        return prefix + "-" + randomPart;
    }

    // Helper Method
    private ExamResponse mapToResponse(Exam exam) {
        int qCount = 0;
        if (exam.getSubject() != null && exam.getSubject().getQuestions() != null) {
            qCount = exam.getSubject().getQuestions().size();
        }

        Long createdById = exam.getCreatedBy() != null ? exam.getCreatedBy().getId() : null;
        String createdByName = exam.getCreatedBy() != null ? exam.getCreatedBy().getFullName() : "Administrator";
        String createdByEmail = exam.getCreatedBy() != null ? exam.getCreatedBy().getEmail() : null;

        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .duration(exam.getDuration())
                .totalMarks(exam.getTotalMarks())
                .passingMarks(exam.getPassingMarks())
                .status(exam.getStatus())
                .subjectId(exam.getSubject() != null ? exam.getSubject().getId() : null)
                .subjectName(exam.getSubject() != null ? exam.getSubject().getName() : null)
                .accessCode(exam.getAccessCode())
                .createdById(createdById)
                .createdByName(createdByName)
                .createdByEmail(createdByEmail)
                .questionsCount(qCount)
                .build();
    }
}