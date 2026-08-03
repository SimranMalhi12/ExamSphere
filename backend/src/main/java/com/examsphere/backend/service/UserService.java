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

    public UserService(UserRepository userRepository ,RoleRepository roleRepository,BCryptPasswordEncoder passwordEncoder, JwtService jwtService) {
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

        // Password encryption
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Every new user is STUDENT
        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("Student role not found"));

        user.setRole(studentRole);

        userRepository.save(user);

        return "Registration Successful";


    }

    public AuthenticationResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthenticationResponse(
                token,
                user.getFullName(),
                user.getRole().getName()
        );
    }


}