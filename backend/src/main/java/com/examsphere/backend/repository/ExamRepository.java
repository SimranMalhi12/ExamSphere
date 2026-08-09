package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Exam;
import com.examsphere.backend.entity.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findBySubjectId(Long subjectId);

    List<Exam> findByStatus(ExamStatus status);

    List<Exam> findAllByCreatedBy_Id(Long adminId);

    List<Exam> findBySubjectIdAndCreatedBy_Id(Long subjectId, Long adminId);

    long countByCreatedBy_Id(Long adminId);

    Optional<Exam> findByIdAndCreatedBy_Id(Long id, Long adminId);
}