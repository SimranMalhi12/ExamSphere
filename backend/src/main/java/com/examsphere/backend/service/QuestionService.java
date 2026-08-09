package com.examsphere.backend.service;

import com.examsphere.backend.dto.QuestionRequest;
import com.examsphere.backend.dto.QuestionResponse;
import com.examsphere.backend.entity.Question;
import com.examsphere.backend.entity.Subject;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.QuestionRepository;
import com.examsphere.backend.repository.SubjectRepository;
import com.examsphere.backend.security.PermissionValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final PermissionValidator permissionValidator;

    // Create Question
    public QuestionResponse createQuestion(QuestionRequest request) {
        permissionValidator.validateCanManageQuestions();

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Question question = Question.builder()
                .questionText(request.getQuestionText())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctAnswer(request.getCorrectAnswer())
                .difficulty(request.getDifficulty())
                .marks(request.getMarks())
                .subject(subject)
                .build();

        Question savedQuestion = questionRepository.save(question);

        return mapToResponse(savedQuestion);
    }

    // Get All Questions
    public List<QuestionResponse> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Question By Id
    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        return mapToResponse(question);
    }

    // Update Question
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {
        permissionValidator.validateCanManageQuestions();

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        question.setQuestionText(request.getQuestionText());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setDifficulty(request.getDifficulty());
        question.setMarks(request.getMarks());
        question.setSubject(subject);

        Question updatedQuestion = questionRepository.save(question);

        return mapToResponse(updatedQuestion);
    }

    // Delete Question
    public String deleteQuestion(Long id) {
        permissionValidator.validateCanManageQuestions();

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        questionRepository.delete(question);

        return "Question Deleted Successfully";
    }

    // Helper Method
    private QuestionResponse mapToResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .correctAnswer(question.getCorrectAnswer())
                .difficulty(question.getDifficulty())
                .marks(question.getMarks())
                .subjectId(question.getSubject().getId())
                .subjectName(question.getSubject().getName())
                .build();
    }
}