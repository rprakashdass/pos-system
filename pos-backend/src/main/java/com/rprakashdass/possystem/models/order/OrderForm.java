package com.rprakashdass.possystem.models.order;

import java.util.List;

import com.rprakashdass.possystem.Enums.OrderStatus;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class OrderForm {
    private Long clientId;
    private List<OrderItemForm> items;
    private OrderStatus status;
}
