package com.examsphere.backend.controller;

import com.examsphere.backend.entity.User;
import com.examsphere.backend.repository.*;
import com.examsphere.backend.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SubjectRepository subjectRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminOverview(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "";
        Optional<User> userOpt = userRepository.findByEmail(email);

        Map<String, Object> stats = new HashMap<>();
        stats.put("adminEmail", email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            stats.put("adminName", user.getFullName());
            stats.put("adminRole", user.getRole().getName());

            boolean isSuper = "SUPER_ADMIN".equalsIgnoreCase(user.getRole().getName());

            if (isSuper) {
                stats.put("totalUsers", userRepository.count());
                stats.put("totalCategories", categoryRepository.count());
                stats.put("totalSubjects", subjectRepository.count());
                stats.put("totalExams", examRepository.count());
                stats.put("totalQuestions", questionRepository.count());
            } else {
                Long adminId = user.getId();
                stats.put("totalUsers", userRepository.countByRole_Name("STUDENT"));
                stats.put("totalCategories", categoryRepository.countByCreatedBy_Id(adminId));
                stats.put("totalSubjects", subjectRepository.countByCreatedBy_Id(adminId));
                stats.put("totalExams", examRepository.countByCreatedBy_Id(adminId));
                stats.put("totalQuestions", questionRepository.countByCreatedBy_Id(adminId));
            }
        } else {
            stats.put("totalUsers", 0);
            stats.put("totalCategories", 0);
            stats.put("totalSubjects", 0);
            stats.put("totalExams", 0);
            stats.put("totalQuestions", 0);
        }

        ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .status(200)
                .message("Admin overview metrics fetched successfully")
                .timestamp(LocalDateTime.now())
                .data(stats)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminProfile(Authentication authentication) {
        Map<String, Object> profile = new HashMap<>();
        String email = authentication != null ? authentication.getName() : "";
        profile.put("email", email);

        Optional<User> userOpt = userRepository.findByEmail(email);
        userOpt.ifPresent(user -> {
            profile.put("fullName", user.getFullName());
            profile.put("role", user.getRole().getName());
            profile.put("canCreateExams", user.getCanCreateExams());
            profile.put("canManageQuestions", user.getCanManageQuestions());
            profile.put("canManageSubjects", user.getCanManageSubjects());
            profile.put("canViewSubmissions", user.getCanViewSubmissions());
        });

        ApiResponse<Map<String, Object>> response = ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .status(200)
                .message("Admin profile retrieved")
                .timestamp(LocalDateTime.now())
                .data(profile)
                .build();

        return ResponseEntity.ok(response);
    }
}
