package com.examsphere.backend.controller;

import com.examsphere.backend.dto.*;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.service.SuperAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    // Create Admin
    @PostMapping("/admins")
    public ResponseEntity<AdminUserResponse> createAdmin(@Valid @RequestBody AdminCreateRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(superAdminService.createAdmin(request));
    }

    // Get all Admins
    @GetMapping("/admins")
    public ResponseEntity<List<AdminUserResponse>> getAllAdmins() {

        return ResponseEntity.ok(superAdminService.getAllAdmins());
    }

    // Update Admin
    @PutMapping("/admins/{id}")
    public ResponseEntity<AdminUserResponse> updateAdmin(
            @PathVariable Long id,
            @RequestBody AdminUpdateRequest request) {

        return ResponseEntity.ok(superAdminService.updateAdmin(id, request));
    }

    // Toggle Admin status (active / suspended)
    @PatchMapping("/admins/{id}/status")
    public ResponseEntity<AdminUserResponse> toggleAdminStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusMap) {

        Boolean active = statusMap.getOrDefault("active", true);
        return ResponseEntity.ok(superAdminService.toggleAdminStatus(id, active));
    }

    // Delete Admin
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {

        return ResponseEntity.ok(superAdminService.deleteAdmin(id));
    }

    // Get Platform Stats
    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsResponse> getPlatformStats() {

        return ResponseEntity.ok(superAdminService.getPlatformStats());
    }

    // Get all Students
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {

        return ResponseEntity.ok(superAdminService.getAllStudents());
    }
}
