package com.rprakashdass.possystem.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class OrderItemDto {
    private Long id;
    private Long productId;
    private Long quantity;
    private Double sellingPrice;
}
