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

import com.rprakashdass.possystem.dto.ClientDto;
import com.rprakashdass.possystem.models.client.ClientData;
import com.rprakashdass.possystem.models.client.ClientForm;
import com.rprakashdass.possystem.pojo.Client;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    ClientDto clientDto;

    @GetMapping
    public List<Client> getClients() {
        return clientDto.getClients();
    }

    @PostMapping
    public ClientData createClient(@Valid @RequestBody ClientForm clientForm) {
        return clientDto.create(clientForm);
    }

    @GetMapping("/{id}")
    public ClientData getById(@PathVariable Long id) {
        return clientDto.getById(id);
    }

    @PutMapping("/{id}")
    public ClientData update(@PathVariable Long id, @Valid @RequestBody ClientForm form) {
        return clientDto.update(id, form);
    }

    @GetMapping("/search")
    public List<ClientData> searchClients(ClientForm form) {
        return clientDto.searchClients(form);
    }

}
