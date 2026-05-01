package com.rprakashdass.possystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rprakashdass.possystem.api.ProductApi;
import com.rprakashdass.possystem.dto.ProductDto;
import com.rprakashdass.possystem.models.product.ProductForm;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductApi api;

    @PostMapping
    public ProductDto add(@RequestBody ProductForm form) {
        return api.add(form);
    }

    @GetMapping("/{id}")
    public ProductDto get(@PathVariable Long id) {
        return api.get(id);
    }

    @GetMapping
    public List<ProductDto> getAll() {
        return api.getAll();
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Long id, @RequestBody ProductForm form) {
        return api.update(id, form);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        api.delete(id);
    }
}
