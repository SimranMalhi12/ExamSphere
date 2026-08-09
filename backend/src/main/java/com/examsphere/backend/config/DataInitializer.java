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

    @Value("${initial.superadmin.name:Super Administrator}")
    private String initialSuperAdminName;

    @Value("${initial.superadmin.email:superadmin@examsphere.com}")
    private String initialSuperAdminEmail;

    @Value("${initial.superadmin.password:SuperAdmin123!}")
    private String initialSuperAdminPassword;

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
            Role superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role(null, "SUPER_ADMIN")));

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

            // 1. Seed Default SUPER_ADMIN
            if (!userRepository.existsByRole_Name("SUPER_ADMIN") && !userRepository.existsByEmail(initialSuperAdminEmail)) {
                logger.info("Initializing primary SUPER_ADMIN account: {}", initialSuperAdminEmail);

                User superAdmin = new User();
                superAdmin.setFullName(initialSuperAdminName);
                superAdmin.setEmail(initialSuperAdminEmail);
                superAdmin.setPassword(passwordEncoder.encode(initialSuperAdminPassword));
                superAdmin.setRole(superAdminRole);
                superAdmin.setCanCreateExams(true);
                superAdmin.setCanManageQuestions(true);
                superAdmin.setCanManageSubjects(true);
                superAdmin.setCanViewSubmissions(true);
                superAdmin.setIsActive(true);

                userRepository.save(superAdmin);
                logger.info("SUPER_ADMIN created successfully: {}", initialSuperAdminEmail);
            }

            // 2. Seed Default Fallback ADMIN
            if (!userRepository.existsByRole_Name("ADMIN") && !userRepository.existsByEmail(initialAdminEmail)) {
                logger.info("Initializing standard ADMIN account: {}", initialAdminEmail);

                User initialAdmin = new User();
                initialAdmin.setFullName(initialAdminName);
                initialAdmin.setEmail(initialAdminEmail);
                initialAdmin.setPassword(passwordEncoder.encode(initialAdminPassword));
                initialAdmin.setRole(adminRole);
                initialAdmin.setCanCreateExams(true);
                initialAdmin.setCanManageQuestions(true);
                initialAdmin.setCanManageSubjects(true);
                initialAdmin.setCanViewSubmissions(true);
                initialAdmin.setIsActive(true);

                userRepository.save(initialAdmin);
                logger.info("ADMIN account created successfully: {}", initialAdminEmail);
            }
        };
    }
}
