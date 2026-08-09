package com.examsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateRequest {

    private String fullName;
    private String password;
    private Boolean canCreateExams;
    private Boolean canManageQuestions;
    private Boolean canManageSubjects;
    private Boolean canViewSubmissions;
    private Boolean isActive;
}
