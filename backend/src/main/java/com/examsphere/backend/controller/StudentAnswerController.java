package com.examsphere.backend.controller;

import com.examsphere.backend.dto.SubmitAnswerRequest;
import com.examsphere.backend.dto.SubmitAnswerResponse;
import com.examsphere.backend.service.StudentAnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor

public class StudentAnswerController {

    private final StudentAnswerService answerService;

    @PostMapping
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
            @RequestBody SubmitAnswerRequest request) {

        return ResponseEntity.ok(answerService.submitAnswer(request));
    }
}