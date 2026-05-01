package com.rprakashdass.possystem.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rprakashdass.possystem.dao.ProductDao;
import com.rprakashdass.possystem.dto.ProductDto;
import com.rprakashdass.possystem.exception.ResourceNotFoundException;
import com.rprakashdass.possystem.models.product.ProductForm;
import com.rprakashdass.possystem.pojo.Product;
import com.rprakashdass.possystem.util.conversion.ProductConversionUtil;

@Service
public class ProductApi {

    @Autowired
    private ProductDao dao;

    @Transactional
    public ProductDto add(ProductForm form) {
        Product product = ProductConversionUtil.convert(form);
        dao.save(product);
        return ProductConversionUtil.convert(product);
    }

    @Transactional(readOnly = true)
    public ProductDto get(Long id) {
        Product product = getProduct(id);
        return ProductConversionUtil.convert(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAll() {
        return dao.findAll().stream()
                .map(ProductConversionUtil::convert)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto update(Long id, ProductForm form) {
        Product existingProduct = getProduct(id);
        ProductConversionUtil.convert(form, existingProduct);
        dao.save(existingProduct);
        return ProductConversionUtil.convert(existingProduct);
    }

    @Transactional
    public void delete(Long id) {
        Product product = getProduct(id);
        dao.delete(product);
    }

    public Product getProduct(Long id) {
        Product product = dao.findById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product with given ID not found: " + id);
        }
        return product;
    }
}
