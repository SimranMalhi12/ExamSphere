package com.examsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultResponse {

    private Long attemptId;

    private Integer totalQuestions;

    private Integer correctAnswers;

    private Integer score;

    private Boolean passed;
}