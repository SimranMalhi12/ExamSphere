package com.examsphere.backend.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {

    private boolean success;

    private int status;

    private String message;

    private LocalDateTime timestamp;

    private T data;

}