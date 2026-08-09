package com.examsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private long totalExamsCreated;
    private long totalQuestionsCreated;
}
