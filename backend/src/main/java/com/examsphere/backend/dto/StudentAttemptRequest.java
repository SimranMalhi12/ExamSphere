package com.examsphere.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAttemptRequest {

    private Long studentId;
    private Long examId;

}