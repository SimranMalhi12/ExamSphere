package com.examsphere.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String selectedAnswer;

    private Boolean correct;

    @ManyToOne
    @JoinColumn(name = "attempt_id")
    private StudentAttempt attempt;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;
}