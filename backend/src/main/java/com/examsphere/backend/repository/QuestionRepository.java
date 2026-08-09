package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Question;
import com.examsphere.backend.entity.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findBySubjectId(Long subjectId);

    List<Question> findByDifficulty(Difficulty difficulty);

    List<Question> findBySubjectIdAndDifficulty(Long subjectId, Difficulty difficulty);

}
