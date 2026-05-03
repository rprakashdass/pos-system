package com.rprakashdass.possystem.dto;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.rprakashdass.possystem.Enums.UserRole;
import com.rprakashdass.possystem.dao.UserDao;
import com.rprakashdass.possystem.models.user.UserData;
import com.rprakashdass.possystem.models.user.UserForm;
import com.rprakashdass.possystem.pojo.User;

@Component
public class UserDto {

    @Autowired
    private UserDao userDao;

    public UserData signup(UserForm form) {
        if (userDao.findByEmail(form.getEmail()) != null) {
            throw new IllegalArgumentException("email already in use");
        }

        User user = new User();
        user.setName(form.getName());
        user.setEmail(form.getEmail());
        user.setPhoneNumber(form.getPhoneNumber());
        user.setPasswordHash(hashPassword(form.getPassword()));
        user.setRole(UserRole.OPERATOR.name());

        return toData(userDao.save(user));
    }

    public UserData login(UserForm form) {
        User user = userDao.findByEmail(form.getEmail());
        if (user == null) {
            throw new IllegalArgumentException("invalid credentials");
        }
        if (!hashPassword(form.getPassword()).equals(user.getPasswordHash())) {
            throw new IllegalArgumentException("invalid credentials");
        }
        return toData(user);
    }

    public UserData toData(User user) {
        UserData data = new UserData();
        data.setId(user.getId());
        data.setName(user.getName());
        data.setPhoneNumber(user.getPhoneNumber());
        data.setEmail(user.getEmail());
        data.setRole(user.getRole() == null ? UserRole.OPERATOR : UserRole.valueOf(user.getRole()));
        return data;
    }

    public User findById(Long id) {
        return userDao.findById(id);
    }

    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashed);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash password", ex);
        }
    }
}