package com.examsphere.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAttemptResponse {

    private Long id;

    private Long studentId;

    private String studentName;

    private String studentEmail;

    private Long examId;

    private String examTitle;

    private Integer score;

    private Integer totalMarks;

    private Integer passingMarks;

    private Boolean passed;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Boolean submitted;

}