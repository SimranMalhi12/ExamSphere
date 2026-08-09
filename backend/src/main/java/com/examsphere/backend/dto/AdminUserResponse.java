package com.examsphere.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String role;

    private Boolean canCreateExams;

    private Boolean canManageQuestions;

    private Boolean canManageSubjects;

    private Boolean canViewSubmissions;

    private Boolean isActive;

    private Long examsCount;

    private Long questionsCount;

}
