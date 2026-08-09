package com.examsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformStatsResponse {

    private long totalAdmins;
    private long activeAdmins;
    private long suspendedAdmins;
    private long totalStudents;
    private long totalExams;
    private long totalQuestions;
    private long totalSubjects;
    private long totalCategories;
    private long totalAttempts;
    private double platformPassRate;
    private double platformAverageScore;
}
