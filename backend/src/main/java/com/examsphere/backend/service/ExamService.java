package com.examsphere.backend.service;

import com.examsphere.backend.dto.ExamRequest;
import com.examsphere.backend.dto.ExamResponse;
import com.examsphere.backend.entity.Exam;
import com.examsphere.backend.entity.Subject;
import com.examsphere.backend.exception.ResourceNotFoundException;
import com.examsphere.backend.repository.ExamRepository;
import com.examsphere.backend.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final SubjectRepository subjectRepository;

    // Create Exam
    public ExamResponse createExam(ExamRequest request) {

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Exam exam = Exam.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .duration(request.getDuration())
                .totalMarks(request.getTotalMarks())
                .passingMarks(request.getPassingMarks())
                .status(request.getStatus())
                .subject(subject)
                .build();

        Exam savedExam = examRepository.save(exam);

        return mapToResponse(savedExam);
    }

    // Get All Exams
    public List<ExamResponse> getAllExams() {

        System.out.println("Exam Count = " + examRepository.count());

        return examRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Exam By Id
    public ExamResponse getExamById(Long id) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        return mapToResponse(exam);
    }

    // Update Exam
    public ExamResponse updateExam(Long id, ExamRequest request) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setDuration(request.getDuration());
        exam.setTotalMarks(request.getTotalMarks());
        exam.setPassingMarks(request.getPassingMarks());
        exam.setStatus(request.getStatus());
        exam.setSubject(subject);

        Exam updatedExam = examRepository.save(exam);

        return mapToResponse(updatedExam);
    }

    // Delete Exam
    public String deleteExam(Long id) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        examRepository.delete(exam);

        return "Exam Deleted Successfully";
    }

    // Helper Method
    private ExamResponse mapToResponse(Exam exam) {

        return ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .duration(exam.getDuration())
                .totalMarks(exam.getTotalMarks())
                .passingMarks(exam.getPassingMarks())
                .status(exam.getStatus())
                .subjectId(exam.getSubject().getId())
                .subjectName(exam.getSubject().getName())
                .build();
    }
}