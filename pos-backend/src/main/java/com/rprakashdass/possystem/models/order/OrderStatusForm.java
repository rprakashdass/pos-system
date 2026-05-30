package com.rprakashdass.possystem.models.order;

import com.rprakashdass.possystem.Enums.OrderStatus;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class OrderStatusForm {
    private OrderStatus status;
}