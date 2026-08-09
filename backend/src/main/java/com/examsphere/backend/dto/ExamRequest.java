package com.examsphere.backend.dto;

import com.examsphere.backend.entity.ExamStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Integer duration;

    @NotNull
    private Integer totalMarks;

    @NotNull
    private Integer passingMarks;

    @NotNull
    private ExamStatus status;

    @NotNull
    private Long subjectId;

    private String accessCode;

}