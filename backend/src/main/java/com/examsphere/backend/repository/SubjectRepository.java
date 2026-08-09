package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndCategory_IdAndCreatedBy_Id(String name, Long categoryId, Long adminId);

    List<Subject> findByCategoryId(Long categoryId);

    List<Subject> findByCategoryIdAndCreatedBy_Id(Long categoryId, Long adminId);

    List<Subject> findAllByCreatedBy_Id(Long adminId);

    long countByCreatedBy_Id(Long adminId);

    Optional<Subject> findByIdAndCreatedBy_Id(Long id, Long adminId);
}