package com.examsphere.backend.config;

import com.examsphere.backend.entity.Role;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.repository.RoleRepository;
import com.examsphere.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Map;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRolesAndSuperAdmin(
            RoleRepository roleRepository,
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate) {

        return args -> {

            // Drop any legacy unique constraints on categories and subjects to allow duplicate names
            dropUniqueIndexesOnCategoriesAndSubjects(jdbcTemplate);

            Role superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                    .orElseGet(() -> roleRepository.save(new Role(null, "SUPER_ADMIN")));

            if (roleRepository.findByName("ADMIN").isEmpty()) {
                roleRepository.save(new Role(null, "ADMIN"));
            }

            if (roleRepository.findByName("INSTRUCTOR").isEmpty()) {
                roleRepository.save(new Role(null, "INSTRUCTOR"));
            }

            if (roleRepository.findByName("STUDENT").isEmpty()) {
                roleRepository.save(new Role(null, "STUDENT"));
            }

            // Seed default Super Admin account if not existing
            String superAdminEmail = "superadmin@examsphere.com";
            if (userRepository.findByEmail(superAdminEmail).isEmpty()) {
                User superAdmin = User.builder()
                        .fullName("Super Administrator")
                        .email(superAdminEmail)
                        .password(passwordEncoder.encode("SuperAdmin123!"))
                        .role(superAdminRole)
                        .canCreateExams(true)
                        .canManageQuestions(true)
                        .canManageSubjects(true)
                        .canViewSubmissions(true)
                        .isActive(true)
                        .build();

                userRepository.save(superAdmin);
                System.out.println("Default Super Admin created: " + superAdminEmail);
            }

        };
    }

    private void dropUniqueIndexesOnCategoriesAndSubjects(JdbcTemplate jdbcTemplate) {
        try {
            String sql = """
                SELECT DISTINCT TABLE_NAME, INDEX_NAME 
                FROM information_schema.STATISTICS 
                WHERE TABLE_SCHEMA = DATABASE() 
                  AND TABLE_NAME IN ('categories', 'subjects') 
                  AND NON_UNIQUE = 0 
                  AND INDEX_NAME != 'PRIMARY'
            """;

            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            for (Map<String, Object> row : rows) {
                String tableName = (String) row.get("TABLE_NAME");
                String indexName = (String) row.get("INDEX_NAME");
                try {
                    jdbcTemplate.execute("ALTER TABLE " + tableName + " DROP INDEX " + indexName);
                    System.out.println("Successfully removed unique index: " + tableName + "." + indexName);
                } catch (Exception e) {
                    System.out.println("Note on index " + indexName + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.out.println("Schema index cleanup notice: " + e.getMessage());
        }
    }
}
