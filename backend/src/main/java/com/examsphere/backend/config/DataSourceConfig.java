package com.examsphere.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource() {
        String rawUrl = System.getenv("DATABASE_URL");
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            rawUrl = System.getenv("SPRING_DATASOURCE_URL");
        }

        String username = System.getenv("DATABASE_USERNAME");
        if (username == null || username.trim().isEmpty()) {
            username = System.getenv("SPRING_DATASOURCE_USERNAME");
        }

        String password = System.getenv("DATABASE_PASSWORD");
        if (password == null || password.trim().isEmpty()) {
            password = System.getenv("SPRING_DATASOURCE_PASSWORD");
        }

        String finalJdbcUrl;
        String driverClassName = null;

        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            logger.info("No external DATABASE_URL provided. Initializing embedded H2 database (MySQL compatibility mode).");
            finalJdbcUrl = "jdbc:h2:mem:exam_portal;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1";
            driverClassName = "org.h2.Driver";
            if (username == null || username.trim().isEmpty()) {
                username = "sa";
            }
            if (password == null) {
                password = "";
            }
        } else if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
            try {
                URI uri = new URI(rawUrl.replace("postgres://", "postgresql://"));
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    if (username == null || username.trim().isEmpty()) username = parts[0];
                    if (password == null || password.trim().isEmpty()) password = parts[1];
                }
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath() != null ? uri.getPath() : "";
                String query = uri.getQuery() != null ? "?" + uri.getQuery() : "";
                finalJdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + path + query;
                driverClassName = "org.postgresql.Driver";
            } catch (Exception e) {
                logger.warn("Could not parse postgresql URI, prepending jdbc: prefix: {}", e.getMessage());
                finalJdbcUrl = "jdbc:" + rawUrl;
                driverClassName = "org.postgresql.Driver";
            }
        } else if (rawUrl.startsWith("mysql://")) {
            try {
                URI uri = new URI(rawUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    if (username == null || username.trim().isEmpty()) username = parts[0];
                    if (password == null || password.trim().isEmpty()) password = parts[1];
                }
                int port = uri.getPort() > 0 ? uri.getPort() : 3306;
                String path = uri.getPath() != null && !uri.getPath().isEmpty() ? uri.getPath() : "/exam_portal";
                String query = uri.getQuery() != null ? "?" + uri.getQuery() : "?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true";
                finalJdbcUrl = "jdbc:mysql://" + uri.getHost() + ":" + port + path + query;
                driverClassName = "com.mysql.cj.jdbc.Driver";
            } catch (Exception e) {
                logger.warn("Could not parse mysql URI, prepending jdbc: prefix: {}", e.getMessage());
                finalJdbcUrl = "jdbc:" + rawUrl;
                driverClassName = "com.mysql.cj.jdbc.Driver";
            }
        } else if (rawUrl.startsWith("jdbc:")) {
            finalJdbcUrl = rawUrl;
            if (rawUrl.startsWith("jdbc:postgresql:")) {
                driverClassName = "org.postgresql.Driver";
            } else if (rawUrl.startsWith("jdbc:mysql:")) {
                driverClassName = "com.mysql.cj.jdbc.Driver";
            } else if (rawUrl.startsWith("jdbc:h2:")) {
                driverClassName = "org.h2.Driver";
            }
        } else {
            // Default fallback: prepend jdbc:
            finalJdbcUrl = "jdbc:" + rawUrl;
        }

        logger.info("Initializing DataSource with JDBC URL: {}", finalJdbcUrl);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(finalJdbcUrl);
        if (driverClassName != null) {
            config.setDriverClassName(driverClassName);
        }
        if (username != null && !username.trim().isEmpty()) {
            config.setUsername(username);
        }
        if (password != null && !password.trim().isEmpty()) {
            config.setPassword(password);
        }

        config.setMaximumPoolSize(5);
        config.setMinimumIdle(1);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
