package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Exam;
import com.examsphere.backend.entity.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findBySubjectId(Long subjectId);

    List<Exam> findByStatus(ExamStatus status);

}