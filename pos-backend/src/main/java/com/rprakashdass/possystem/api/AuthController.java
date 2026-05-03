package com.rprakashdass.possystem.api;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rprakashdass.possystem.dto.UserDto;
import com.rprakashdass.possystem.models.user.UserData;
import com.rprakashdass.possystem.models.user.UserForm;
import com.rprakashdass.possystem.pojo.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserDto userDto;

    @PostMapping("/signup")
    public UserData signup(@Valid @RequestBody UserForm form) {
        return userDto.signup(form);
    }

    @PostMapping("/login")
    public UserData login(@RequestBody UserForm form, HttpServletRequest request) {
        UserData user = userDto.login(form);
        HttpSession session = request.getSession(true);
        session.setAttribute("userId", user.getId());
        session.setAttribute("role", user.getRole());
        session.setAttribute("lastAccess", Instant.now());
        return user;
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "not authenticated"));
        }

        Object userId = session.getAttribute("userId");
        if (!(userId instanceof Long)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "not authenticated"));
        }

        User user = userDto.findById((Long) userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("error", "not authenticated"));
        }

        return ResponseEntity.ok(userDto.toData(user));
    }
}
