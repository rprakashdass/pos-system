package com.rprakashdass.possystem.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;

import com.rprakashdass.possystem.dao.ClientDao;
import com.rprakashdass.possystem.dao.ProductDao;
import com.rprakashdass.possystem.dto.ProductDto;
import com.rprakashdass.possystem.exception.ResourceNotFoundException;
import com.rprakashdass.possystem.models.product.ProductForm;
import com.rprakashdass.possystem.pojo.Client;
import com.rprakashdass.possystem.pojo.Product;
import com.rprakashdass.possystem.util.conversion.ProductConversionUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Service
public class ProductApi {

    private static final Logger logger = LogManager.getLogger(ProductApi.class);

    @Autowired
    private ProductDao dao;
    @Autowired
    private ClientDao clientDao;

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto add(ProductForm form) {
        logger.info("Adding new product for client: {}", form.getClientId());
        getClient(form.getClientId());
        Product product = ProductConversionUtil.convert(form);
        dao.save(product);
        logger.info("Successfully added product with ID: {}", product.getId());
        return ProductConversionUtil.convert(product);
    }

    @Transactional(readOnly = true)
    public ProductDto get(Long id) {
        logger.info("Fetching product with ID: {}", id);
        Product product = getProduct(id);
        return ProductConversionUtil.convert(product);
    }

    @Transactional(readOnly = true)
    @Cacheable("products")
    public List<ProductDto> getAll() {
        logger.info("Fetching all products.");
        return dao.findAll().stream()
                .map(ProductConversionUtil::convert)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto update(Long id, ProductForm form) {
        logger.info("Updating product with ID: {}", id);
        Product existingProduct = getProduct(id);
        getClient(form.getClientId());
        ProductConversionUtil.convert(form, existingProduct);
        dao.save(existingProduct);
        logger.info("Successfully updated product with ID: {}", id);
        return ProductConversionUtil.convert(existingProduct);
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public void delete(Long id) {
        logger.info("Deleting product with ID: {}", id);
        Product product = getProduct(id);
        dao.delete(product);
        logger.info("Successfully deleted product with ID: {}", id);
    }

    public Product getProduct(Long id) {
        Product product = dao.findById(id);
        if (product == null) {
            logger.error("Product with ID: {} not found.", id);
            throw new ResourceNotFoundException("Product with given ID not found: " + id);
        }
        return product;
    }

    private Client getClient(Long id) {
        Client client = clientDao.findById(id);
        if (client == null) {
            logger.error("Client with ID: {} not found.", id);
            throw new ResourceNotFoundException("Client with given ID not found: " + id);
        }
        return client;
    }
}
