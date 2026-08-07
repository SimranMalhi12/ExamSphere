package com.examsphere.backend.repository;

import com.examsphere.backend.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentAnswerRepository
        extends JpaRepository<StudentAnswer,Long> {

    List<StudentAnswer> findByAttemptId(Long attemptId);

}