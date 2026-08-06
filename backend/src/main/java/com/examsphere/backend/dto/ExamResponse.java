package com.examsphere.backend.dto;

import com.examsphere.backend.entity.ExamStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResponse {

    private Long id;

    private String title;

    private String description;

    private Integer duration;

    private Integer totalMarks;

    private Integer passingMarks;

    private ExamStatus status;

    private Long subjectId;

    private String subjectName;

}