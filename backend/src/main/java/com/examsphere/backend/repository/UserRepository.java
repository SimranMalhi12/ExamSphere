package com.examsphere.backend.repository;

import com.examsphere.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole_Name(String roleName);

    Optional<User> findByRole_Name(String roleName);

}