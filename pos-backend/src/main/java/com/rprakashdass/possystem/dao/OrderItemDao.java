package com.rprakashdass.possystem.dao;

import org.springframework.stereotype.Repository;

import com.rprakashdass.possystem.pojo.OrderItem;

@Repository
public class OrderItemDao extends AbstractDao<OrderItem> {
    public OrderItemDao() {
        super(OrderItem.class);
    }
}
