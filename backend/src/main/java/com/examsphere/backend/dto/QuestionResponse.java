package com.examsphere.backend.dto;

import com.examsphere.backend.entity.Difficulty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResponse {

    private Long id;

    private String questionText;

    private String optionA;

    private String optionB;

    private String optionC;

    private String optionD;

    private String correctAnswer;

    private Difficulty difficulty;

    private Integer marks;

    private Long subjectId;

    private String subjectName;

}