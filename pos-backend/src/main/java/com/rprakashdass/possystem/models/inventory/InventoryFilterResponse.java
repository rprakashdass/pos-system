package com.rprakashdass.possystem.models.inventory;

import lombok.Getter;

@Getter
public class InventoryFilterResponse {
    private String productId;
    private String clientId;
    private String productName;
    private String barcode;
    private Double price;
    private Long quantity;
}
