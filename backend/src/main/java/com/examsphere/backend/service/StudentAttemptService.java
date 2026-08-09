package com.examsphere.backend.service;

import com.examsphere.backend.dto.ResultResponse;
import com.examsphere.backend.dto.StudentAttemptRequest;
import com.examsphere.backend.dto.StudentAttemptResponse;
import com.examsphere.backend.entity.Exam;
import com.examsphere.backend.entity.StudentAnswer;
import com.examsphere.backend.entity.StudentAttempt;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.ExamRepository;
import com.examsphere.backend.repository.StudentAnswerRepository;
import com.examsphere.backend.repository.StudentAttemptRepository;
import com.examsphere.backend.repository.UserRepository;
import com.examsphere.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentAttemptService {

    private final StudentAttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final StudentAnswerRepository answerRepository;

    public StudentAttemptResponse startExam(StudentAttemptRequest request) {

        String email = SecurityUtils.getCurrentUserEmail();
        User student = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        if (student == null && request.getStudentId() != null) {
            student = userRepository.findById(request.getStudentId()).orElse(null);
        }

        if (student == null) {
            throw new ResourceNotFoundException("Student authentication required to begin examination");
        }

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

        return mapToResponse(saved);
    }

    public ResultResponse submitExam(Long attemptId) {

        StudentAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        List<StudentAnswer> answers = answerRepository.findByAttemptId(attemptId);

        int totalQuestions = answers.size();
        int correctAnswers = 0;

        for (StudentAnswer answer : answers) {
            if (Boolean.TRUE.equals(answer.getCorrect())) {
                correctAnswers++;
            }
        }

        int totalMarks = attempt.getExam() != null && attempt.getExam().getTotalMarks() != null
                ? attempt.getExam().getTotalMarks() : 100;

        int score = totalQuestions > 0 ? (correctAnswers * totalMarks) / totalQuestions : 0;

        attempt.setScore(score);
        attempt.setEndTime(LocalDateTime.now());
        attempt.setSubmitted(true);

        attemptRepository.save(attempt);

        int passMarks = attempt.getExam() != null && attempt.getExam().getPassingMarks() != null
                ? attempt.getExam().getPassingMarks() : 40;
        boolean passed = score >= passMarks;

        return ResultResponse.builder()
                .attemptId(attempt.getId())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .score(score)
                .passed(passed)
                .build();
    }

    // Get attempts for the currently logged in student
    public List<StudentAttemptResponse> getMyStudentAttempts() {
        String email = SecurityUtils.getCurrentUserEmail();
        User student = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        if (student == null) {
            return List.of();
        }
        return attemptRepository.findByStudentId(student.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get attempts for all exams created by the currently logged in admin
    public List<StudentAttemptResponse> getMyAdminExamAttempts() {
        String email = SecurityUtils.getCurrentUserEmail();
        User admin = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        if (admin == null) {
            return List.of();
        }
        if (admin.getRole() != null && "SUPER_ADMIN".equalsIgnoreCase(admin.getRole().getName())) {
            return attemptRepository.findAll()
                    .stream()
                    .map(this::mapToResponse)
                    .toList();
        }
        return attemptRepository.findByExamCreatedById(admin.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get attempts for a specific exam (isolated by admin ownership)
    public List<StudentAttemptResponse> getAttemptsByExam(Long examId) {
        return attemptRepository.findByExamId(examId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public StudentAttemptResponse getAttemptById(Long id) {
        StudentAttempt attempt = attemptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));
        return mapToResponse(attempt);
    }

    private StudentAttemptResponse mapToResponse(StudentAttempt attempt) {
        int totalMarks = attempt.getExam() != null && attempt.getExam().getTotalMarks() != null
                ? attempt.getExam().getTotalMarks() : 100;
        int passMarks = attempt.getExam() != null && attempt.getExam().getPassingMarks() != null
                ? attempt.getExam().getPassingMarks() : 40;
        int score = attempt.getScore() != null ? attempt.getScore() : 0;
        boolean passed = score >= passMarks;

        Long studentId = attempt.getStudent() != null ? attempt.getStudent().getId() : null;
        String studentName = attempt.getStudent() != null ? attempt.getStudent().getFullName() : "Candidate";
        String studentEmail = attempt.getStudent() != null ? attempt.getStudent().getEmail() : null;

        Long examId = attempt.getExam() != null ? attempt.getExam().getId() : null;
        String examTitle = attempt.getExam() != null ? attempt.getExam().getTitle() : "Exam";

        return StudentAttemptResponse.builder()
                .id(attempt.getId())
                .studentId(studentId)
                .studentName(studentName)
                .studentEmail(studentEmail)
                .examId(examId)
                .examTitle(examTitle)
                .startTime(attempt.getStartTime())
                .endTime(attempt.getEndTime())
                .submitted(attempt.getSubmitted())
                .score(score)
                .totalMarks(totalMarks)
                .passed(passed)
                .build();
    }
}