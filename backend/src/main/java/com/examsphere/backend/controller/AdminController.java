package com.examsphere.backend.controller;

import com.examsphere.backend.response.ApiResponse;
import com.examsphere.backend.repository.CategoryRepository;
import com.examsphere.backend.repository.ExamRepository;
import com.examsphere.backend.repository.QuestionRepository;
import com.examsphere.backend.repository.SubjectRepository;
import com.examsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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
        Map<String, Object> stats = new HashMap<>();
        stats.put("adminEmail", authentication != null ? authentication.getName() : "");
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        stats.put("totalSubjects", subjectRepository.count());
        stats.put("totalExams", examRepository.count());
        stats.put("totalQuestions", questionRepository.count());

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
        profile.put("email", authentication != null ? authentication.getName() : "");
        profile.put("roles", authentication != null ? authentication.getAuthorities().stream().map(Object::toString).toList() : java.util.Collections.emptyList());

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
