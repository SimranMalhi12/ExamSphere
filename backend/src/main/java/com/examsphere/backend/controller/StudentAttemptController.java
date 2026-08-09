package com.examsphere.backend.controller;

import com.examsphere.backend.dto.ResultResponse;
import com.examsphere.backend.dto.StudentAttemptRequest;
import com.examsphere.backend.dto.StudentAttemptResponse;
import com.examsphere.backend.service.StudentAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
public class StudentAttemptController {

    private final StudentAttemptService attemptService;

    @PostMapping("/start")
    public ResponseEntity<StudentAttemptResponse> startExam(
            @RequestBody StudentAttemptRequest request) {

        return ResponseEntity.ok(attemptService.startExam(request));
    }

    @PostMapping("/submit/{attemptId}")
    public ResponseEntity<ResultResponse> submitExam(
            @PathVariable Long attemptId) {

        return ResponseEntity.ok(attemptService.submitExam(attemptId));
    }

    @GetMapping("/my-attempts")
    public ResponseEntity<List<StudentAttemptResponse>> getMyAttempts() {

        return ResponseEntity.ok(attemptService.getMyStudentAttempts());
    }

    @GetMapping("/admin/my-exam-attempts")
    public ResponseEntity<List<StudentAttemptResponse>> getAdminExamAttempts() {

        return ResponseEntity.ok(attemptService.getMyAdminExamAttempts());
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<StudentAttemptResponse>> getAttemptsByExam(
            @PathVariable Long examId) {

        return ResponseEntity.ok(attemptService.getAttemptsByExam(examId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentAttemptResponse> getAttemptById(
            @PathVariable Long id) {

        return ResponseEntity.ok(attemptService.getAttemptById(id));
    }
}