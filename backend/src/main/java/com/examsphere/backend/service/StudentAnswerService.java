package com.examsphere.backend.service;

import com.examsphere.backend.dto.SubmitAnswerRequest;
import com.examsphere.backend.dto.SubmitAnswerResponse;
import com.examsphere.backend.entity.Question;
import com.examsphere.backend.entity.StudentAnswer;
import com.examsphere.backend.entity.StudentAttempt;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.QuestionRepository;
import com.examsphere.backend.repository.StudentAnswerRepository;
import com.examsphere.backend.repository.StudentAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentAnswerService {

    private final StudentAnswerRepository answerRepository;
    private final StudentAttemptRepository attemptRepository;
    private final QuestionRepository questionRepository;

    public SubmitAnswerResponse submitAnswer(SubmitAnswerRequest request) {

        StudentAttempt attempt = attemptRepository.findById(request.getAttemptId())
                .orElseThrow(() -> new ResourceNotFoundException("Attempt not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        boolean isCorrect =
                question.getCorrectAnswer().equalsIgnoreCase(request.getSelectedAnswer());

        StudentAnswer answer = StudentAnswer.builder()
                .attempt(attempt)
                .question(question)
                .selectedAnswer(request.getSelectedAnswer())
                .correct(isCorrect)
                .build();

        answerRepository.save(answer);

        return SubmitAnswerResponse.builder()
                .questionId(question.getId())
                .selectedAnswer(request.getSelectedAnswer())
                .correct(isCorrect)
                .build();
    }
}