package com.rprakashdass.possystem.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.rprakashdass.possystem.dao.InventoryDao;
import com.rprakashdass.possystem.dao.ProductDao;
import com.rprakashdass.possystem.exception.ResourceNotFoundException;
import com.rprakashdass.possystem.models.inventory.InventoryCreateForm;
import com.rprakashdass.possystem.models.inventory.InventoryData;
import com.rprakashdass.possystem.models.inventory.InventoryUpdateForm;
import com.rprakashdass.possystem.pojo.Inventory;
import com.rprakashdass.possystem.pojo.Product;

@Service
public class InventoryApi {

    @Autowired
    private InventoryDao inventoryDao;

    @Autowired
    private ProductDao productDao;

    @Transactional
    public InventoryData create(InventoryCreateForm form) {
        Product product = getProduct(form.getProductId());
        List<Inventory> existing = inventoryDao.findByProductId(product.getId().intValue());
        if (!existing.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Inventory already exists for product ID " + product.getId());
        }

        Inventory inventory = new Inventory();
        inventory.setProduct(product);
        inventory.setQuantity(form.getQuantity().longValue());
        inventoryDao.save(inventory);
        return convert(inventory);
    }

    @Transactional(readOnly = true)
    public List<InventoryData> getAll() {
        return inventoryDao.findAll().stream()
                .map(this::convert)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InventoryData get(Long id) {
        Inventory inventory = getInventory(id);
        return convert(inventory);
    }

    @Transactional
    public InventoryData update(InventoryUpdateForm form) {
        Inventory inventory = getInventory(form.getId());
        inventory.setQuantity(form.getQuantity());
        inventoryDao.save(inventory);
        return convert(inventory);
    }

    private Inventory getInventory(Long id) {
        Inventory inventory = inventoryDao.findById(id);
        if (inventory == null) {
            throw new ResourceNotFoundException("Inventory with given ID not found: " + id);
        }
        return inventory;
    }

    private Product getProduct(Long id) {
        Product product = productDao.findById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product with given ID not found: " + id);
        }
        return product;
    }

    private InventoryData convert(Inventory inventory) {
        InventoryData data = new InventoryData();
        data.setId(inventory.getId());
        data.setQuantity(inventory.getQuantity());
        return data;
    }
}