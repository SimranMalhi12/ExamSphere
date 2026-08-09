package com.examsphere.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUpdateRequest {

    private String fullName;

    private String password;

    private Boolean canCreateExams;

    private Boolean canManageQuestions;

    private Boolean canManageSubjects;

    private Boolean canViewSubmissions;

    private Boolean isActive;

}
