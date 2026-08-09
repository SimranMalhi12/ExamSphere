package com.examsphere.backend.exception;

import com.examsphere.backend.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(
            ResourceNotFoundException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(response);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicate(
            DuplicateResourceException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(
            AccessDeniedException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.FORBIDDEN.value())
                .message(ex.getMessage() != null ? ex.getMessage() : "Access denied: Insufficient permissions")
                .timestamp(LocalDateTime.now())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(
            BadCredentialsException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.UNAUTHORIZED.value())
                .message("Invalid email or password")
                .timestamp(LocalDateTime.now())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Object>> handleResponseStatus(
            ResponseStatusException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(ex.getStatusCode().value())
                .message(ex.getReason() != null ? ex.getReason() : ex.getMessage())
                .timestamp(LocalDateTime.now())
                .data(null)
                .build();

        return ResponseEntity.status(ex.getStatusCode())
                .body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(
            IllegalArgumentException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(
            Exception ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

}