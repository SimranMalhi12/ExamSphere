package com.examsphere.backend.controller;

import com.examsphere.backend.dto.LoginRequest;
import com.examsphere.backend.dto.RegisterRequest;
import com.examsphere.backend.response.AuthenticationResponse;
import com.examsphere.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return userService.register(request);

    }
    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody LoginRequest request) {

        return userService.login(request);

    }

}