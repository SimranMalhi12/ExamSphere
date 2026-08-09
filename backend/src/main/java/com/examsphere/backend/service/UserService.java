package com.examsphere.backend.service;

import com.examsphere.backend.dto.LoginRequest;
import com.examsphere.backend.dto.RegisterRequest;
import com.examsphere.backend.entity.Role;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.exception.DuplicateResourceException;
import com.examsphere.backend.repository.RoleRepository;
import com.examsphere.backend.repository.UserRepository;
import com.examsphere.backend.response.AuthenticationResponse;
import com.examsphere.backend.security.JwtService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Public registration always assigns regular STUDENT/USER role to prevent privilege escalation
        Role assignedRole = roleRepository.findByName("STUDENT")
                .orElseGet(() -> roleRepository.findByName("USER")
                        .orElseGet(() -> roleRepository.save(new Role(null, "STUDENT"))));

        user.setRole(assignedRole);
        userRepository.save(user);

        return "Registration Successful";
    }

    public AuthenticationResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String roleName = user.getRole() != null ? user.getRole().getName() : "STUDENT";
        String token = jwtService.generateToken(user.getEmail(), roleName, user.getId());

        return new AuthenticationResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                roleName
        );
    }

    public AuthenticationResponse adminLogin(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        // Strict Backend Role Check: Only ADMIN role is permitted
        if (user.getRole() == null || !user.getRole().getName().equalsIgnoreCase("ADMIN")) {
            throw new AccessDeniedException("Access denied: User does not have administrator privileges");
        }

        String token = jwtService.generateToken(user.getEmail(), "ADMIN", user.getId());

        return new AuthenticationResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                "ADMIN"
        );
    }
}