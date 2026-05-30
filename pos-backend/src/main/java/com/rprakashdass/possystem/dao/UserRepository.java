package com.rprakashdass.possystem.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rprakashdass.possystem.pojo.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
}
