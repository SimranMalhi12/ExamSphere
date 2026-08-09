package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Question;
import com.examsphere.backend.entity.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findBySubjectId(Long subjectId);

    List<Question> findByDifficulty(Difficulty difficulty);

    List<Question> findBySubjectIdAndDifficulty(Long subjectId, Difficulty difficulty);

    List<Question> findAllByCreatedBy_Id(Long adminId);

    List<Question> findBySubjectIdAndCreatedBy_Id(Long subjectId, Long adminId);

    long countByCreatedBy_Id(Long adminId);

    Optional<Question> findByIdAndCreatedBy_Id(Long id, Long adminId);
}
