package com.examsphere.backend.service;

import com.examsphere.backend.dto.*;
import com.examsphere.backend.entity.Role;
import com.examsphere.backend.entity.StudentAttempt;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.DuplicateResourceException;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final CategoryRepository categoryRepository;
    private final StudentAttemptRepository studentAttemptRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public AdminUserResponse createAdmin(AdminCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User with email already exists: " + request.getEmail());
        }

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(adminRole);
        user.setCanCreateExams(request.getCanCreateExams() != null ? request.getCanCreateExams() : true);
        user.setCanManageQuestions(request.getCanManageQuestions() != null ? request.getCanManageQuestions() : true);
        user.setCanManageSubjects(request.getCanManageSubjects() != null ? request.getCanManageSubjects() : true);
        user.setCanViewSubmissions(request.getCanViewSubmissions() != null ? request.getCanViewSubmissions() : true);
        user.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        User saved = userRepository.save(user);

        return mapToAdminResponse(saved);
    }

    public List<AdminUserResponse> getAllAdmins() {
        List<User> admins = userRepository.findAllByRole_Name("ADMIN");
        return admins.stream()
                .map(this::mapToAdminResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserResponse updateAdmin(Long id, AdminUpdateRequest request) {
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));

        if (!"ADMIN".equalsIgnoreCase(admin.getRole().getName())) {
            throw new IllegalArgumentException("Target user is not an Administrator");
        }

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            admin.setFullName(request.getFullName().trim());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
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

    @Transactional
    public void deleteAdmin(Long id) {
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));

        if (!"ADMIN".equalsIgnoreCase(admin.getRole().getName())) {
            throw new IllegalArgumentException("Cannot delete non-admin user via this endpoint");
        }

        userRepository.delete(admin);
    }

    public PlatformStatsResponse getPlatformStats() {
        long totalAdmins = userRepository.countByRole_Name("ADMIN");
        long activeAdmins = userRepository.countByRole_NameAndIsActive("ADMIN", true);
        long suspendedAdmins = totalAdmins - activeAdmins;

        long totalStudents = userRepository.countByRole_Name("STUDENT") + userRepository.countByRole_Name("USER");
        long totalExams = examRepository.count();
        long totalQuestions = questionRepository.count();
        long totalSubjects = subjectRepository.count();
        long totalCategories = categoryRepository.count();
        long totalAttempts = studentAttemptRepository.count();

        List<StudentAttempt> attempts = studentAttemptRepository.findAll();
        double passRate = 0.0;
        double avgScore = 0.0;

        if (!attempts.isEmpty()) {
            long passedCount = attempts.stream()
                    .filter(a -> a.getScore() != null && a.getScore() >= 50)
                    .count();
            passRate = Math.round(((double) passedCount / attempts.size()) * 1000.0) / 10.0;

            double sumScore = attempts.stream()
                    .mapToDouble(a -> a.getScore() != null ? a.getScore() : 0.0)
                    .sum();
            avgScore = Math.round((sumScore / attempts.size()) * 10.0) / 10.0;
        }

        return PlatformStatsResponse.builder()
                .totalAdmins(totalAdmins)
                .activeAdmins(activeAdmins)
                .suspendedAdmins(suspendedAdmins)
                .totalStudents(totalStudents)
                .totalExams(totalExams)
                .totalQuestions(totalQuestions)
                .totalSubjects(totalSubjects)
                .totalCategories(totalCategories)
                .totalAttempts(totalAttempts)
                .platformPassRate(passRate)
                .platformAverageScore(avgScore)
                .build();
    }

    public List<Map<String, Object>> getAllStudents() {
        List<User> students = userRepository.findAllByRole_NameIn(List.of("STUDENT", "USER"));
        return students.stream().map(student -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", student.getId());
            map.put("fullName", student.getFullName());
            map.put("email", student.getEmail());
            map.put("role", student.getRole().getName());
            map.put("isActive", student.getIsActive());

            List<StudentAttempt> attempts = studentAttemptRepository.findByStudentId(student.getId());
            map.put("totalAttempts", attempts.size());

            double avgScore = attempts.isEmpty() ? 0.0 :
                    attempts.stream().mapToDouble(a -> a.getScore() != null ? a.getScore() : 0.0).average().orElse(0.0);
            map.put("averageScore", Math.round(avgScore * 10.0) / 10.0);

            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAllAttempts() {
        List<StudentAttempt> attempts = studentAttemptRepository.findAll();
        return attempts.stream().map(attempt -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", attempt.getId());
            map.put("studentId", attempt.getStudent() != null ? attempt.getStudent().getId() : null);
            map.put("studentName", attempt.getStudent() != null ? attempt.getStudent().getFullName() : "N/A");
            map.put("studentEmail", attempt.getStudent() != null ? attempt.getStudent().getEmail() : "N/A");
            map.put("examId", attempt.getExam() != null ? attempt.getExam().getId() : null);
            map.put("examTitle", attempt.getExam() != null ? attempt.getExam().getTitle() : "N/A");
            map.put("score", attempt.getScore());
            map.put("passed", attempt.getScore() != null && attempt.getScore() >= 50);
            map.put("attemptDate", attempt.getStartTime());
            map.put("endTime", attempt.getEndTime());
            map.put("submitted", attempt.getSubmitted());
            return map;
        }).collect(Collectors.toList());
    }

    private AdminUserResponse mapToAdminResponse(User admin) {
        return AdminUserResponse.builder()
                .id(admin.getId())
                .fullName(admin.getFullName())
                .email(admin.getEmail())
                .role(admin.getRole().getName())
                .canCreateExams(admin.getCanCreateExams())
                .canManageQuestions(admin.getCanManageQuestions())
                .canManageSubjects(admin.getCanManageSubjects())
                .canViewSubmissions(admin.getCanViewSubmissions())
                .isActive(admin.getIsActive())
                .totalExamsCreated(0) // future expansion per admin tracking
                .totalQuestionsCreated(0)
                .build();
    }
}
