package com.examsphere.backend.security;

import com.examsphere.backend.entity.User;
import com.examsphere.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PermissionValidator {

    private final UserRepository userRepository;

    public void validateCanCreateExams() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return;

        if ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            return;
        }

        if ("ADMIN".equalsIgnoreCase(currentUser.getRole().getName()) && !currentUser.getCanCreateExams()) {
            throw new AccessDeniedException("Forbidden: You do not have permission to create or manage exams (canCreateExams is disabled).");
        }
    }

    public void validateCanManageQuestions() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return;

        if ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            return;
        }

        if ("ADMIN".equalsIgnoreCase(currentUser.getRole().getName()) && !currentUser.getCanManageQuestions()) {
            throw new AccessDeniedException("Forbidden: You do not have permission to manage questions (canManageQuestions is disabled).");
        }
    }

    public void validateCanManageSubjects() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return;

        if ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            return;
        }

        if ("ADMIN".equalsIgnoreCase(currentUser.getRole().getName()) && !currentUser.getCanManageSubjects()) {
            throw new AccessDeniedException("Forbidden: You do not have permission to manage subjects or categories (canManageSubjects is disabled).");
        }
    }

    public void validateCanViewSubmissions() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return;

        if ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName())) {
            return;
        }

        if ("ADMIN".equalsIgnoreCase(currentUser.getRole().getName()) && !currentUser.getCanViewSubmissions()) {
            throw new AccessDeniedException("Forbidden: You do not have permission to view candidate submissions (canViewSubmissions is disabled).");
        }
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }

        Optional<User> userOpt = userRepository.findByEmail(auth.getName());
        return userOpt.orElse(null);
    }
}
