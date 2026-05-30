package com.rprakashdass.possystem.dto;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.rprakashdass.possystem.api.ClientApi;
import com.rprakashdass.possystem.models.client.ClientData;
import com.rprakashdass.possystem.models.client.ClientForm;
import com.rprakashdass.possystem.pojo.Client;
import com.rprakashdass.possystem.util.conversion.EntityToData;

@Component
public class ClientDto {

    @Autowired
    private ClientApi clientApi;

    public List<Client> getClients() {
        return clientApi.getClients();
    }

    public ClientData create(ClientForm clientForm) {
        String name = clientForm.getName();
        String email = clientForm.getEmail();
        String phoneNumber = clientForm.getPhoneNumber();
        return EntityToData.convertClientEntityToData(clientApi.createClient(name, email, phoneNumber));
    }

    public ClientData getById(Long id) {
        return EntityToData.convertClientEntityToData(clientApi.getById(id));
    }

    public ClientData update(Long id, ClientForm form) {
        String name = form.getName();
        String email = form.getEmail();
        String phoneNumber = form.getPhoneNumber();
        return EntityToData.convertClientEntityToData(clientApi.update(id, name, phoneNumber, email));
    }

    public List<ClientData> searchClients(ClientForm form) {
        Long id = form.getId();
        String name = form.getName();
        String email = form.getEmail();
        String phoneNumber = form.getPhoneNumber();
        List<Client> clients = clientApi.searchClients(id, name, phoneNumber, email);
        return clients.stream().map(EntityToData::convertClientEntityToData).toList();
    }

    public void delete(Long id) {
        clientApi.delete(id);
    }
}
