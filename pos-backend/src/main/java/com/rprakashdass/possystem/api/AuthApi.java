package com.rprakashdass.possystem.api;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rprakashdass.possystem.config.JwtService;
import com.rprakashdass.possystem.dao.UserRepository;
import com.rprakashdass.possystem.dto.AuthenticationRequest;
import com.rprakashdass.possystem.dto.AuthenticationResponse;
import com.rprakashdass.possystem.dto.RegisterRequest;
import com.rprakashdass.possystem.pojo.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthApi {

    private static final Logger logger = LogManager.getLogger(AuthApi.class);
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        logger.info("Registering new user with email: {}", request.getEmail());
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        repository.save(user);
        logger.info("User registered successfully: {}", user.getEmail());
        return AuthenticationResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        logger.info("Authenticating user with email: {}", request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        logger.info("User authenticated successfully: {}", user.getEmail());
        return AuthenticationResponse.builder()
                .accessToken(jwtService.generateToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .build();
    }
}
