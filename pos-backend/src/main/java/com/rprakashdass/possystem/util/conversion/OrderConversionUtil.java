package com.rprakashdass.possystem.util.conversion;

import com.rprakashdass.possystem.dto.OrderDto;
import com.rprakashdass.possystem.dto.OrderItemDto;
import com.rprakashdass.possystem.pojo.Order;
import com.rprakashdass.possystem.pojo.OrderItem;

import java.util.stream.Collectors;

public class OrderConversionUtil {

    public static OrderDto convert(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setClientId(order.getClient().getId());
        dto.setStatus(order.getStatus());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setItems(order.getItems().stream().map(OrderConversionUtil::convert).collect(Collectors.toList()));
        return dto;
    }

    public static OrderItemDto convert(OrderItem orderItem) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(orderItem.getId());
        dto.setProductId(orderItem.getProduct().getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setSellingPrice(orderItem.getSellingPrice());
        return dto;
    }
}
