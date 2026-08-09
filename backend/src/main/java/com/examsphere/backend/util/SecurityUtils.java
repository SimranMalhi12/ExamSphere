package com.examsphere.backend.util;

import com.examsphere.backend.entity.User;
import com.examsphere.backend.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getUser();
        }
        return null;
    }

    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
                return userDetails.getUsername();
            } else if (authentication.getPrincipal() instanceof String principalStr) {
                return principalStr;
            }
        }
        return null;
    }

    public static Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    public static boolean isSuperAdmin() {
        User user = getCurrentUser();
        return user != null && user.getRole() != null && "SUPER_ADMIN".equalsIgnoreCase(user.getRole().getName());
    }

    public static boolean isAdmin() {
        User user = getCurrentUser();
        return user != null && user.getRole() != null &&
                ("ADMIN".equalsIgnoreCase(user.getRole().getName()) || "SUPER_ADMIN".equalsIgnoreCase(user.getRole().getName()));
    }

    public static boolean isStudent() {
        User user = getCurrentUser();
        return user != null && user.getRole() != null && "STUDENT".equalsIgnoreCase(user.getRole().getName());
    }
}
