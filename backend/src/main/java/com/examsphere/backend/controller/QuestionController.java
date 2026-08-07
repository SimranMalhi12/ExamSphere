package com.examsphere.backend.controller;

import com.examsphere.backend.dto.QuestionRequest;
import com.examsphere.backend.dto.QuestionResponse;
import com.examsphere.backend.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor

public class QuestionController {

    private final QuestionService questionService;

    // Create Question
    @PostMapping
    public ResponseEntity<QuestionResponse> createQuestion(
            @Valid @RequestBody QuestionRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(questionService.createQuestion(request));
    }

    // Get All Questions
    @GetMapping
    public ResponseEntity<List<QuestionResponse>> getAllQuestions() {

        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    // Get Question By Id
    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable Long id) {

        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    // Update Question
    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request) {

        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    // Delete Question
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {

        return ResponseEntity.ok(questionService.deleteQuestion(id));
    }
}