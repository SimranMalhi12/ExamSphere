package com.examsphere.backend.config;

import com.examsphere.backend.entity.Role;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.repository.RoleRepository;
import com.examsphere.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Value("${initial.admin.name:System Administrator}")
    private String initialAdminName;

    @Value("${initial.admin.email:admin@examsphere.com}")
    private String initialAdminEmail;

    @Value("${initial.admin.password:Admin@123}")
    private String initialAdminPassword;

    @Bean
    CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder) {

        return args -> {
            // Initialize Core Roles
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role(null, "ADMIN")));

            Role studentRole = roleRepository.findByName("STUDENT")
                    .orElseGet(() -> roleRepository.save(new Role(null, "STUDENT")));

            if (roleRepository.findByName("USER").isEmpty()) {
                roleRepository.save(new Role(null, "USER"));
            }

            if (roleRepository.findByName("INSTRUCTOR").isEmpty()) {
                roleRepository.save(new Role(null, "INSTRUCTOR"));
            }

            // Check if any ADMIN exists in the database
            boolean adminExists = userRepository.existsByRole_Name("ADMIN");

            if (!adminExists) {
                logger.info("No ADMIN found in database. Initializing initial ADMIN account: {}", initialAdminEmail);

                User initialAdmin = new User();
                initialAdmin.setFullName(initialAdminName);
                initialAdmin.setEmail(initialAdminEmail);
                initialAdmin.setPassword(passwordEncoder.encode(initialAdminPassword));
                initialAdmin.setRole(adminRole);

                userRepository.save(initialAdmin);
                logger.info("Initial ADMIN account created successfully with email: {}", initialAdminEmail);
            } else {
                logger.info("ADMIN account already exists in database. Skipping initial admin creation.");
            }
        };
    }
}

