package com.examsphere.backend.service;

import com.examsphere.backend.dto.RegisterRequest;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.entity.Role;
import com.examsphere.backend.repository.RoleRepository;
import com.examsphere.backend.repository.UserRepository;
import com.examsphere.backend.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.examsphere.backend.dto.LoginRequest;
import com.examsphere.backend.response.AuthenticationResponse;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Public self-registration is strictly for STUDENT accounts
        Role assignedRole = roleRepository.findByName("STUDENT")
                .orElseGet(() -> {
                    Role newRole = new Role(null, "STUDENT");
                    return roleRepository.save(newRole);
                });

        user.setRole(assignedRole);
        user.setCanCreateExams(false);
        user.setCanManageQuestions(false);
        user.setCanManageSubjects(false);
        user.setCanViewSubmissions(false);
        user.setIsActive(true);

        userRepository.save(user);

        return "Registration Successful";
    }

    public AuthenticationResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        if (user.getIsActive() != null && !user.getIsActive()) {
            throw new RuntimeException("Account has been suspended by the Super Administrator. Please contact support.");
        }

        String token = jwtService.generateToken(user.getEmail());

        return AuthenticationResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().getName() : "STUDENT")
                .canCreateExams(user.getCanCreateExams() != null ? user.getCanCreateExams() : true)
                .canManageQuestions(user.getCanManageQuestions() != null ? user.getCanManageQuestions() : true)
                .canManageSubjects(user.getCanManageSubjects() != null ? user.getCanManageSubjects() : true)
                .canViewSubmissions(user.getCanViewSubmissions() != null ? user.getCanViewSubmissions() : true)
                .isActive(user.getIsActive() != null ? user.getIsActive() : true)
                .build();
    }
}