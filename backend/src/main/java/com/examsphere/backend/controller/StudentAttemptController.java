package com.examsphere.backend.controller;

import com.examsphere.backend.dto.ResultResponse;
import com.examsphere.backend.dto.StudentAttemptRequest;
import com.examsphere.backend.dto.StudentAttemptResponse;
import com.examsphere.backend.service.StudentAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}