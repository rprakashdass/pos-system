package com.rprakashdass.possystem.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.rprakashdass.possystem.Enums.OrderStatus;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class OrderDto {
    private Long id;
    private Long clientId;
    private OrderStatus status;
    private Double totalPrice;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items;
}
