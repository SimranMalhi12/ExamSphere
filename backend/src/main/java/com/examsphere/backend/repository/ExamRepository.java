package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Exam;
import com.examsphere.backend.entity.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findBySubjectId(Long subjectId);

    List<Exam> findByStatus(ExamStatus status);

    List<Exam> findByCreatedById(Long createdById);

    List<Exam> findByCreatedByIdOrCreatedByIsNull(Long createdById);

    List<Exam> findByCreatedByIdAndSubjectId(Long createdById, Long subjectId);

    Optional<Exam> findByAccessCode(String accessCode);

    long countByCreatedById(Long createdById);

}