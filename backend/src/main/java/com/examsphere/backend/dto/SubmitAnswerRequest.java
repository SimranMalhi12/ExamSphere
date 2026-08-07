package com.examsphere.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitAnswerRequest {

    private Long attemptId;

    private Long questionId;

    private String selectedAnswer;

}