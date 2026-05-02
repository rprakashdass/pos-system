package com.rprakashdass.possystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rprakashdass.possystem.api.InventoryApi;
import com.rprakashdass.possystem.models.inventory.InventoryCreateForm;
import com.rprakashdass.possystem.models.inventory.InventoryData;
import com.rprakashdass.possystem.models.inventory.InventoryUpdateForm;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryApi api;

    @PostMapping
    public InventoryData create(@RequestBody InventoryCreateForm form) {
        return api.create(form);
    }

    @GetMapping
    public List<InventoryData> getAll() {
        return api.getAll();
    }

    @GetMapping("/{id}")
    public InventoryData get(@PathVariable Long id) {
        return api.get(id);
    }

    @PutMapping
    public InventoryData update(@RequestBody InventoryUpdateForm form) {
        return api.update(form);
    }
}