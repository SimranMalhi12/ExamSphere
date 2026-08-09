package com.examsphere.backend.repository;

import com.examsphere.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndCreatedById(String name, Long createdById);

    List<Category> findByCreatedById(Long createdById);

    List<Category> findByCreatedByIdOrCreatedByIsNull(Long createdById);

    long countByCreatedById(Long createdById);

}
