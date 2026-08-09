package com.examsphere.backend.service;

import com.examsphere.backend.dto.*;
import com.examsphere.backend.entity.Role;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.DuplicateResourceException;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final CategoryRepository categoryRepository;
    private final StudentAttemptRepository attemptRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Create a new Administrator
    public AdminUserResponse createAdmin(AdminCreateRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User with email " + request.getEmail() + " already exists");
        }

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));

        User admin = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(adminRole)
                .canCreateExams(request.getCanCreateExams() != null ? request.getCanCreateExams() : true)
                .canManageQuestions(request.getCanManageQuestions() != null ? request.getCanManageQuestions() : true)
                .canManageSubjects(request.getCanManageSubjects() != null ? request.getCanManageSubjects() : true)
                .canViewSubmissions(request.getCanViewSubmissions() != null ? request.getCanViewSubmissions() : true)
                .isActive(true)
                .build();

        User savedAdmin = userRepository.save(admin);

        return mapToAdminResponse(savedAdmin);
    }

    // List all Administrators
    public List<AdminUserResponse> getAllAdmins() {

        return userRepository.findByRoleName("ADMIN")
                .stream()
                .map(this::mapToAdminResponse)
                .toList();
    }

    // Update Administrator permissions and status
    public AdminUserResponse updateAdmin(Long id, AdminUpdateRequest request) {

        User admin = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrator not found"));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            admin.setFullName(request.getFullName().trim());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            admin.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        if (request.getCanCreateExams() != null) {
            admin.setCanCreateExams(request.getCanCreateExams());
        }

        if (request.getCanManageQuestions() != null) {
            admin.setCanManageQuestions(request.getCanManageQuestions());
        }

        if (request.getCanManageSubjects() != null) {
            admin.setCanManageSubjects(request.getCanManageSubjects());
        }

        if (request.getCanViewSubmissions() != null) {
            admin.setCanViewSubmissions(request.getCanViewSubmissions());
        }

        if (request.getIsActive() != null) {
            admin.setIsActive(request.getIsActive());
        }

        User updated = userRepository.save(admin);

        return mapToAdminResponse(updated);
    }

    // Toggle Admin status (Active / Suspended)
    public AdminUserResponse toggleAdminStatus(Long id, Boolean active) {

        User admin = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrator not found"));

        admin.setIsActive(active);
        User updated = userRepository.save(admin);

        return mapToAdminResponse(updated);
    }

    // Delete Administrator
    public String deleteAdmin(Long id) {

        User admin = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrator not found"));

        userRepository.delete(admin);

        return "Administrator deleted successfully";
    }

    // Get Platform-wide statistics
    public PlatformStatsResponse getPlatformStats() {

        long totalAdmins = userRepository.countByRoleName("ADMIN");
        long totalStudents = userRepository.countByRoleName("STUDENT");
        long totalExams = examRepository.count();
        long totalQuestions = questionRepository.count();
        long totalCategories = categoryRepository.count();
        long totalSubjects = subjectRepository.count();
        long totalAttempts = attemptRepository.count();

        long passedAttempts = attemptRepository.findAll().stream()
                .filter(a -> Boolean.TRUE.equals(a.getSubmitted()) && a.getScore() != null && a.getExam() != null && a.getScore() >= a.getExam().getPassingMarks())
                .count();

        long failedAttempts = Math.max(0, totalAttempts - passedAttempts);
        double passRate = totalAttempts > 0 ? ((double) passedAttempts / totalAttempts) * 100.0 : 0.0;

        return PlatformStatsResponse.builder()
                .totalAdmins(totalAdmins)
                .totalStudents(totalStudents)
                .totalExams(totalExams)
                .totalQuestions(totalQuestions)
                .totalCategories(totalCategories)
                .totalSubjects(totalSubjects)
                .totalAttempts(totalAttempts)
                .passedAttempts(passedAttempts)
                .failedAttempts(failedAttempts)
                .passRate(Math.round(passRate * 10.0) / 10.0)
                .build();
    }

    // List all Students
    public List<User> getAllStudents() {
        return userRepository.findByRoleName("STUDENT");
    }

    private AdminUserResponse mapToAdminResponse(User user) {
        long examsCount = examRepository.countByCreatedById(user.getId());
        long questionsCount = questionRepository.countByCreatedById(user.getId());

        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().getName() : "ADMIN")
                .canCreateExams(user.getCanCreateExams() != null ? user.getCanCreateExams() : true)
                .canManageQuestions(user.getCanManageQuestions() != null ? user.getCanManageQuestions() : true)
                .canManageSubjects(user.getCanManageSubjects() != null ? user.getCanManageSubjects() : true)
                .canViewSubmissions(user.getCanViewSubmissions() != null ? user.getCanViewSubmissions() : true)
                .isActive(user.getIsActive() != null ? user.getIsActive() : true)
                .examsCount(examsCount)
                .questionsCount(questionsCount)
                .build();
    }
}
