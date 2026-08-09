package com.examsphere.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectResponse {

    private Long id;

    private String name;

    private String description;

    private Long categoryId;

    private String categoryName;

    private Long createdById;

    private String createdByName;

    private Integer questionsCount;

}