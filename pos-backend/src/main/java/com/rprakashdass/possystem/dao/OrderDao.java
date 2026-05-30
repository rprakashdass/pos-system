package com.rprakashdass.possystem.dao;

import org.springframework.stereotype.Repository;

import com.rprakashdass.possystem.pojo.Order;

@Repository
public class OrderDao extends AbstractDao<Order> {
    public OrderDao() {
        super(Order.class);
    }
}
