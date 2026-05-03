package com.rprakashdass.possystem.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rprakashdass.possystem.pojo.User;

import jakarta.persistence.TypedQuery;

@Repository
public class UserDao extends AbstractDao<User> {

    public UserDao() {
        super(User.class);
    }

    public User findByEmail(String email) {
        TypedQuery<User> q = em.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class);
        q.setParameter("email", email);
        List<User> list = q.getResultList();
        return list.isEmpty() ? null : list.get(0);
    }
}
