package com.rprakashdass.possystem.util.conversion;

import com.rprakashdass.possystem.dto.ProductDto;
import com.rprakashdass.possystem.models.product.ProductForm;
import com.rprakashdass.possystem.pojo.Product;

public class ProductConversionUtil {

    public static Product convert(ProductForm form) {
        Product product = new Product();
        product.setName(form.getName());
        product.setBarcode(form.getBarcode());
        product.setDescription(form.getDescription());
        product.setPrice(form.getPrice());
        product.setClientId(form.getClientId());
        return product;
    }

    public static void convert(ProductForm form, Product product) {
        product.setName(form.getName());
        product.setBarcode(form.getBarcode());
        product.setDescription(form.getDescription());
        product.setPrice(form.getPrice());
        product.setClientId(form.getClientId());
    }

    public static ProductDto convert(Product product) {
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setBarcode(product.getBarcode());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setClientId(product.getClientId());
        return dto;
    }
}
