package com.examsphere.backend.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticationResponse {

    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private Boolean canCreateExams;
    private Boolean canManageQuestions;
    private Boolean canManageSubjects;
    private Boolean canViewSubmissions;
    private Boolean isActive;

    public AuthenticationResponse(String token, Long id, String fullName, String email, String role) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
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
