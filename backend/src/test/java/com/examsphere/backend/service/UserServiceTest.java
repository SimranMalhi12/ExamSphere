package com.examsphere.backend.service;

import com.examsphere.backend.dto.LoginRequest;
import com.examsphere.backend.dto.RegisterRequest;
import com.examsphere.backend.entity.Role;
import com.examsphere.backend.entity.User;
import com.examsphere.backend.repository.RoleRepository;
import com.examsphere.backend.repository.UserRepository;
import com.examsphere.backend.response.AuthenticationResponse;
import com.examsphere.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    private User adminUser;
    private User studentUser;
    private Role adminRole;
    private Role studentRole;

    @BeforeEach
    void setUp() {
        adminRole = new Role(1L, "ADMIN");
        studentRole = new Role(2L, "STUDENT");

        adminUser = new User(1L, "Admin User", "admin@examsphere.com", "encodedAdminPass", adminRole);
        studentUser = new User(2L, "Student User", "student@examsphere.com", "encodedStudentPass", studentRole);
    }

    @Test
    void testAdminLogin_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@examsphere.com");
        request.setPassword("Admin@123");

        when(userRepository.findByEmail("admin@examsphere.com")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("Admin@123", "encodedAdminPass")).thenReturn(true);
        when(jwtService.generateToken("admin@examsphere.com", "ADMIN", 1L)).thenReturn("mocked-jwt-token");

        AuthenticationResponse response = userService.adminLogin(request);

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.getToken());
        assertEquals("ADMIN", response.getRole());
        assertEquals("Admin User", response.getFullName());
        assertEquals("admin@examsphere.com", response.getEmail());
        assertEquals(1L, response.getUserId());
    }

    @Test
    void testAdminLogin_ForbiddenForNormalUser() {
        LoginRequest request = new LoginRequest();
        request.setEmail("student@examsphere.com");
        request.setPassword("Student@123");

        when(userRepository.findByEmail("student@examsphere.com")).thenReturn(Optional.of(studentUser));
        when(passwordEncoder.matches("Student@123", "encodedStudentPass")).thenReturn(true);

        assertThrows(AccessDeniedException.class, () -> userService.adminLogin(request));
    }

    @Test
    void testAdminLogin_BadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@examsphere.com");
        request.setPassword("WrongPassword");

        when(userRepository.findByEmail("admin@examsphere.com")).thenReturn(Optional.of(adminUser));
        when(passwordEncoder.matches("WrongPassword", "encodedAdminPass")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> userService.adminLogin(request));
    }

    @Test
    void testPublicRegister_AlwaysAssignsStudentRole() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@examsphere.com");
        request.setFullName("New Candidate");
        request.setPassword("Secret123");
        request.setRole("ADMIN"); // Attacker attempting privilege escalation

        when(userRepository.findByEmail("newuser@examsphere.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Secret123")).thenReturn("encodedSecret");
        when(roleRepository.findByName("STUDENT")).thenReturn(Optional.of(studentRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String result = userService.register(request);

        assertEquals("Registration Successful", result);
        verify(userRepository).save(argThat(u -> "STUDENT".equals(u.getRole().getName())));
    }
}
