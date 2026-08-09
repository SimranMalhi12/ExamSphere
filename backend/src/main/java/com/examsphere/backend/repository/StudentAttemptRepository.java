package com.examsphere.backend.repository;

import com.examsphere.backend.entity.StudentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentAttemptRepository extends JpaRepository<StudentAttempt, Long> {

    List<StudentAttempt> findByStudentId(Long studentId);

    List<StudentAttempt> findByExamId(Long examId);

    @Query("SELECT sa FROM StudentAttempt sa WHERE sa.exam.createdBy.id = :adminId ORDER BY sa.startTime DESC")
    List<StudentAttempt> findByExamCreatedById(@Param("adminId") Long adminId);

    @Query("SELECT COUNT(sa) FROM StudentAttempt sa WHERE sa.exam.createdBy.id = :adminId")
    long countByExamCreatedById(@Param("adminId") Long adminId);

}