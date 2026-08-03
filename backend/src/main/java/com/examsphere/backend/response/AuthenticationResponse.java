package com.examsphere.backend.response;

public class AuthenticationResponse {

    private String token;
    private String fullName;
    private String role;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String token, String fullName, String role) {
        this.token = token;
        this.fullName = fullName;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
