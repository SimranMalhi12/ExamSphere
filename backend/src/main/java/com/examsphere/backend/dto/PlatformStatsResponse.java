package com.examsphere.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlatformStatsResponse {

    private long totalAdmins;

    private long totalStudents;

    private long totalExams;

    private long totalQuestions;

    private long totalCategories;

    private long totalSubjects;

    private long totalAttempts;

    private long passedAttempts;

    private long failedAttempts;

    private double passRate;

}
