package com.examsphere.backend.service;

import com.examsphere.backend.dto.StudentAttemptRequest;
import com.examsphere.backend.dto.StudentAttemptResponse;
import com.examsphere.backend.entity.Exam;
import com.examsphere.backend.entity.StudentAttempt;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.ExamRepository;
import com.examsphere.backend.repository.StudentAttemptRepository;
import com.examsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudentAttemptService {

    private final StudentAttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;

    public StudentAttemptResponse startExam(StudentAttemptRequest request) {


        System.out.println("========== START EXAM ==========");
        System.out.println("Request Object = " + request);
        System.out.println("Student ID = " + request.getStudentId());
        System.out.println("Exam ID = " + request.getExamId());

        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        StudentAttempt attempt = StudentAttempt.builder()
                .student(student)
                .exam(exam)
                .startTime(LocalDateTime.now())
                .submitted(false)
                .score(0)
                .build();

        StudentAttempt saved = attemptRepository.save(attempt);

        return StudentAttemptResponse.builder()
                .id(saved.getId())
                .studentId(student.getId())
                .studentName(student.getFullName())
                .examId(exam.getId())
                .examTitle(exam.getTitle())
                .startTime(saved.getStartTime())
                .submitted(saved.getSubmitted())
                .build();
    }
}