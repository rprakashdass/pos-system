package com.rprakashdass.possystem.models.order;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class OrderItemForm {
    private Long productId;
    private Long quantity;
}
