package com.examsphere.backend.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {

    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private String role;
    private Boolean canCreateExams;
    private Boolean canManageQuestions;
    private Boolean canManageSubjects;
    private Boolean canViewSubmissions;
    private Boolean isActive;

    public AuthenticationResponse(String token, Long userId, String email, String fullName, String role) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.canCreateExams = true;
        this.canManageQuestions = true;
        this.canManageSubjects = true;
        this.canViewSubmissions = true;
        this.isActive = true;
    }

    public AuthenticationResponse(String token, String fullName, String role) {
        this.token = token;
        this.fullName = fullName;
        this.role = role;
        this.canCreateExams = true;
        this.canManageQuestions = true;
        this.canManageSubjects = true;
        this.canViewSubmissions = true;
        this.isActive = true;
    }
}
