package com.examsphere.backend.controller;

import com.examsphere.backend.dto.*;
import com.examsphere.backend.response.ApiResponse;
import com.examsphere.backend.service.SuperAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    @PostMapping("/admins")
    public ResponseEntity<ApiResponse<AdminUserResponse>> createAdmin(
            @Valid @RequestBody AdminCreateRequest request) {

        AdminUserResponse response = superAdminService.createAdmin(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<AdminUserResponse>builder()
                        .success(true)
                        .status(HttpStatus.CREATED.value())
                        .message("Admin account provisioned successfully")
                        .timestamp(LocalDateTime.now())
                        .data(response)
                        .build()
        );
    }

    @GetMapping("/admins")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllAdmins() {
        List<AdminUserResponse> admins = superAdminService.getAllAdmins();

        return ResponseEntity.ok(
                ApiResponse.<List<AdminUserResponse>>builder()
                        .success(true)
                        .status(HttpStatus.OK.value())
                        .message("Admins retrieved successfully")
                        .timestamp(LocalDateTime.now())
                        .data(admins)
                        .build()
        );
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateAdmin(
            @PathVariable Long id,
            @RequestBody AdminUpdateRequest request) {

        AdminUserResponse updated = superAdminService.updateAdmin(id, request);

        return ResponseEntity.ok(
                ApiResponse.<AdminUserResponse>builder()
                        .success(true)
                        .status(HttpStatus.OK.value())
                        .message("Admin permissions & details updated successfully")
                        .timestamp(LocalDateTime.now())
                        .data(updated)
                        .build()
        );
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdmin(@PathVariable Long id) {
        superAdminService.deleteAdmin(id);

        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .status(HttpStatus.OK.value())
                        .message("Admin account deleted successfully")
                        .timestamp(LocalDateTime.now())
                        .data(null)
                        .build()
        );
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<PlatformStatsResponse>> getPlatformStats() {
        PlatformStatsResponse stats = superAdminService.getPlatformStats();

        return ResponseEntity.ok(
                ApiResponse.<PlatformStatsResponse>builder()
                        .success(true)
                        .status(HttpStatus.OK.value())
                        .message("Platform statistics retrieved successfully")
                        .timestamp(LocalDateTime.now())
                        .data(stats)
                        .build()
        );
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllStudents() {
        List<Map<String, Object>> students = superAdminService.getAllStudents();

        return ResponseEntity.ok(
                ApiResponse.<List<Map<String, Object>>>builder()
                        .success(true)
                        .status(HttpStatus.OK.value())
                        .message("Global student roster retrieved successfully")
                        .timestamp(LocalDateTime.now())
                        .data(students)
                        .build()
        );
    }

    @GetMapping("/attempts")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllAttempts() {
        List<Map<String, Object>> attempts = superAdminService.getAllAttempts();

        return ResponseEntity.ok(
                ApiResponse.<List<Map<String, Object>>>builder()
                        .success(true)
                        .status(HttpStatus.OK.value())
                        .message("Global audit submission log retrieved successfully")
                        .timestamp(LocalDateTime.now())
                        .data(attempts)
                        .build()
        );
    }
}
