package com.examsphere.backend.controller;

import com.examsphere.backend.dto.SubjectRequest;
import com.examsphere.backend.dto.SubjectResponse;
import com.examsphere.backend.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SubjectController {

    private final SubjectService subjectService;

    // Create Subject
    @PostMapping
    public ResponseEntity<SubjectResponse> createSubject(
            @Valid @RequestBody SubjectRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subjectService.createSubject(request));
    }

    // Get All Subjects
    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {

        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    // Get Subject By ID
    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Long id) {

        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    // Update Subject
    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponse> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request) {

        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    // Delete Subject
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable Long id) {

        return ResponseEntity.ok(subjectService.deleteSubject(id));
    }
}