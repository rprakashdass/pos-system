package com.rprakashdass.possystem.dao;

import org.springframework.stereotype.Repository;

import com.rprakashdass.possystem.pojo.Product;

@Repository
public class ProductDao extends AbstractDao<Product> {
    public ProductDao() {
        super(Product.class);
    }
}
