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

import com.rprakashdass.possystem.api.OrderApi;
import com.rprakashdass.possystem.dto.OrderDto;
import com.rprakashdass.possystem.models.order.OrderForm;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderApi api;

    @PostMapping
    public OrderDto add(@RequestBody OrderForm form) {
        return api.add(form);
    }

    @GetMapping("/{id}")
    public OrderDto get(@PathVariable Long id) {
        return api.get(id);
    }

    @GetMapping
    public List<OrderDto> getAll() {
        return api.getAll();
    }

    @PutMapping("/{id}")
    public OrderDto update(@PathVariable Long id, @RequestBody OrderForm form) {
        return api.update(id, form);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        api.delete(id);
    }
}
