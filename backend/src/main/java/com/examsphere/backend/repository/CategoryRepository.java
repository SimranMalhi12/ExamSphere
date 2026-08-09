package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndCreatedBy_Id(String name, Long adminId);

    List<Category> findAllByCreatedBy_Id(Long adminId);

    long countByCreatedBy_Id(Long adminId);

    Optional<Category> findByIdAndCreatedBy_Id(Long id, Long adminId);
}
