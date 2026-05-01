package com.rprakashdass.possystem.models.product;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ProductForm {
    private String name;
    private String barcode;
    private String description;
    private Double price;
    private Long clientId;
}
