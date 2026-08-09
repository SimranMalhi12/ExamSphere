package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndCreatedById(String name, Long createdById);

    List<Subject> findByCategoryId(Long categoryId);

    List<Subject> findByCreatedById(Long createdById);

    List<Subject> findByCreatedByIdOrCreatedByIsNull(Long createdById);

    long countByCreatedById(Long createdById);

}