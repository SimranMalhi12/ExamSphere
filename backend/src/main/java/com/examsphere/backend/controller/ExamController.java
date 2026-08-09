package com.examsphere.backend.controller;

import com.examsphere.backend.dto.ExamRequest;
import com.examsphere.backend.dto.ExamResponse;
import com.examsphere.backend.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping
    public ResponseEntity<ExamResponse> createExam(
            @Valid @RequestBody ExamRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examService.createExam(request));
    }

    @GetMapping
    public ResponseEntity<List<ExamResponse>> getAllExams() {

        return ResponseEntity.ok(examService.getAllExams());
    }

    @GetMapping("/my-exams")
    public ResponseEntity<List<ExamResponse>> getMyExams() {

        return ResponseEntity.ok(examService.getMyExams());
    }

    @GetMapping("/code/{accessCode}")
    public ResponseEntity<ExamResponse> getExamByAccessCode(@PathVariable String accessCode) {

        return ResponseEntity.ok(examService.getExamByAccessCode(accessCode));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamResponse> getExamById(@PathVariable Long id) {

        return ResponseEntity.ok(examService.getExamById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamResponse> updateExam(
            @PathVariable Long id,
            @Valid @RequestBody ExamRequest request) {

        return ResponseEntity.ok(examService.updateExam(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExam(@PathVariable Long id) {

        return ResponseEntity.ok(examService.deleteExam(id));
    }
}