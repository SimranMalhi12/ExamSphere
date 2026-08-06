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

    private Long examId;

    private String examTitle;

    private LocalDateTime startTime;

    private Boolean submitted;

}