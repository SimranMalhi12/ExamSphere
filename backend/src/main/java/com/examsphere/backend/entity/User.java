package com.examsphere.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    // Granular Permissions for Admin Accounts
    @Column(nullable = false)
    private Boolean canCreateExams = true;

    @Column(nullable = false)
    private Boolean canManageQuestions = true;

    @Column(nullable = false)
    private Boolean canManageSubjects = true;

    @Column(nullable = false)
    private Boolean canViewSubmissions = true;

    // Account Status (Active / Suspended)
    @Column(nullable = false)
    private Boolean isActive = true;

    public User() {
    }

    public User(Long id, String fullName, String email, String password, Role role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.canCreateExams = true;
        this.canManageQuestions = true;
        this.canManageSubjects = true;
        this.canViewSubmissions = true;
        this.isActive = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getCanCreateExams() {
        return canCreateExams != null ? canCreateExams : true;
    }

    public void setCanCreateExams(Boolean canCreateExams) {
        this.canCreateExams = canCreateExams;
    }

    public Boolean getCanManageQuestions() {
        return canManageQuestions != null ? canManageQuestions : true;
    }

    public void setCanManageQuestions(Boolean canManageQuestions) {
        this.canManageQuestions = canManageQuestions;
    }

    public Boolean getCanManageSubjects() {
        return canManageSubjects != null ? canManageSubjects : true;
    }

    public void setCanManageSubjects(Boolean canManageSubjects) {
        this.canManageSubjects = canManageSubjects;
    }

    public Boolean getCanViewSubmissions() {
        return canViewSubmissions != null ? canViewSubmissions : true;
    }

    public void setCanViewSubmissions(Boolean canViewSubmissions) {
        this.canViewSubmissions = canViewSubmissions;
    }

    public Boolean getIsActive() {
        return isActive != null ? isActive : true;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}