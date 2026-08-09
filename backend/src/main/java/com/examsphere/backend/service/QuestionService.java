package com.examsphere.backend.service;

import com.examsphere.backend.dto.QuestionRequest;
import com.examsphere.backend.dto.QuestionResponse;
import com.examsphere.backend.entity.Question;
import com.examsphere.backend.entity.Subject;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.repository.QuestionRepository;
import com.examsphere.backend.repository.SubjectRepository;
import com.examsphere.backend.repository.UserRepository;
import com.examsphere.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    // Create Question
    public QuestionResponse createQuestion(QuestionRequest request) {

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        if (currentUser == null) {
            throw new RuntimeException("Authentication Required: You must be logged in to create a question.");
        }

        if (currentUser.getCanManageQuestions() != null && !currentUser.getCanManageQuestions()
                && !"SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            throw new RuntimeException("Permission Denied: Your admin account has not been granted permission to manage questions. Please contact the Super Administrator.");
        }

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
                .createdBy(currentUser)
                .build();

        Question savedQuestion = questionRepository.save(question);

        return mapToResponse(savedQuestion);
    }

    // Get All Questions (Isolated per admin if caller is admin)
    public List<QuestionResponse> getAllQuestions() {

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        if (currentUser != null && currentUser.getRole() != null) {
            String roleName = currentUser.getRole().getName();
            if ("ADMIN".equalsIgnoreCase(roleName)) {
                return questionRepository.findByCreatedById(currentUser.getId())
                        .stream()
                        .map(this::mapToResponse)
                        .toList();
            } else if ("SUPER_ADMIN".equalsIgnoreCase(roleName)) {
                return questionRepository.findAll()
                        .stream()
                        .map(this::mapToResponse)
                        .toList();
            }
        }

        return questionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Question By Id
    public QuestionResponse getQuestionById(Long id) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        return mapToResponse(question);
    }

    // Get Questions By Subject Id
    public List<QuestionResponse> getQuestionsBySubjectId(Long subjectId) {
        return questionRepository.findBySubjectId(subjectId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Update Question
    public QuestionResponse updateQuestion(Long id, QuestionRequest request) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        validateOwnership(question, currentUser);

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

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

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        String email = SecurityUtils.getCurrentUserEmail();
        User currentUser = email != null ? userRepository.findByEmail(email).orElse(null) : null;
        validateOwnership(question, currentUser);

        questionRepository.delete(question);

        return "Question Deleted Successfully";
    }

    private void validateOwnership(Question question, User currentUser) {
        if (currentUser != null && question.getCreatedBy() != null) {
            if ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
                return;
            }
            if (!question.getCreatedBy().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Access Denied: You cannot modify questions created by another administrator.");
            }
        }
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
                .createdById(question.getCreatedBy() != null ? question.getCreatedBy().getId() : null)
                .createdByName(question.getCreatedBy() != null ? question.getCreatedBy().getFullName() : null)
                .build();
    }
}