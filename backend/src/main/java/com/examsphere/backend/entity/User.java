package com.examsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Column(name = "can_create_exams")
    @Builder.Default
    private Boolean canCreateExams = true;

    @Column(name = "can_manage_questions")
    @Builder.Default
    private Boolean canManageQuestions = true;

    @Column(name = "can_manage_subjects")
    @Builder.Default
    private Boolean canManageSubjects = true;

    @Column(name = "can_view_submissions")
    @Builder.Default
    private Boolean canViewSubmissions = true;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

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
}