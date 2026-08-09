package com.examsphere.backend.repository;

import com.examsphere.backend.entity.StudentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentAttemptRepository extends JpaRepository<StudentAttempt, Long> {

    List<StudentAttempt> findByStudentId(Long studentId);

    List<StudentAttempt> findByExamId(Long examId);

}