package com.examsphere.backend.controller;

import com.examsphere.backend.dto.StudentAttemptRequest;
import com.examsphere.backend.dto.StudentAttemptResponse;
import com.examsphere.backend.service.StudentAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StudentAttemptController {

    private final StudentAttemptService attemptService;

    @PostMapping("/start")
    public ResponseEntity<StudentAttemptResponse> startExam(
            @RequestBody StudentAttemptRequest request) {

        return ResponseEntity.ok(attemptService.startExam(request));
    }
}