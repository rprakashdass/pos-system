package com.rprakashdass.possystem.models.product;

import java.io.Serial;
import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ProductForm implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    private String name;
    private String barcode;
    private String description;
    private Double price;
    private Long clientId;
}
