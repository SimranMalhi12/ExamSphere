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
import com.examsphere.backend.dto.ResultResponse;
import com.examsphere.backend.entity.StudentAnswer;
import com.examsphere.backend.repository.StudentAnswerRepository;

import java.util.List;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StudentAttemptService {

    private final StudentAttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final StudentAnswerRepository answerRepository;

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

        int totalMarks = attempt.getExam().getTotalMarks();

        int score = (correctAnswers * totalMarks) / totalQuestions;

        attempt.setScore(score);
        attempt.setSubmitted(true);

        attemptRepository.save(attempt);

        boolean passed = score >= attempt.getExam().getPassingMarks();

        return ResultResponse.builder()
                .attemptId(attempt.getId())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctAnswers)
                .score(score)
                .passed(passed)
                .build();
    }
}