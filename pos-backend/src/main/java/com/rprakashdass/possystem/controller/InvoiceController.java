package com.rprakashdass.possystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rprakashdass.possystem.api.InvoiceApi;
import com.rprakashdass.possystem.dto.InvoiceDto;
import com.rprakashdass.possystem.models.invoice.InvoiceForm;

@RestController
@RequestMapping("/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceApi api;

    @PostMapping
    public InvoiceDto add(@RequestBody InvoiceForm form) {
        return api.add(form);
    }

    @GetMapping("/{id}")
    public InvoiceDto get(@PathVariable Long id) {
        return api.get(id);
    }

    @GetMapping
    public List<InvoiceDto> getAll() {
        return api.getAll();
    }
}
