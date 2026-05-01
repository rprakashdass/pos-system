package com.rprakashdass.possystem.dto;

import com.rprakashdass.possystem.models.product.ProductForm;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ProductDto extends ProductForm {
    private Long id;
}
