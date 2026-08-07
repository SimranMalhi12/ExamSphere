package com.examsphere.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitAnswerResponse {

    private Long questionId;

    private String selectedAnswer;

    private Boolean correct;

}