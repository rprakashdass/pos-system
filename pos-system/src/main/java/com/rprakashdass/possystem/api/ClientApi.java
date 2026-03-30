package com.rprakashdass.possystem.api;

import com.rprakashdass.possystem.dao.ClientDao;
import com.rprakashdass.possystem.pojo.Client;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ClientApi {

    @Autowired
    private ClientDao clientDao;

    public List<Client> getClients() {
        return clientDao.getClients();
    }

    public Client createClient(String name, String email, String phoneNumber) {
        Client client = new Client();
        client.setName(name);
        client.setEmail(email);
        client.setPhoneNumber(phoneNumber);
        return clientDao.save(client);
    }

    public Client getById(Long id) {
        return clientDao.getClientById(id);
    }

    public Client update(Long id, String name, String email, String phoneNumber) {
        Client client = getById(id);
        if(name != null) {
            client.setName(name);
        }
        if(email != null) {
            client.setEmail(email);
        }
        if(phoneNumber != null) {
            client.setPhoneNumber(phoneNumber);
        }
        return clientDao.save(client);
    }

    public List<Client> searchClients(Long id, String name, String email, String phoneNumber) {
        return clientDao.searchClients(id, name, email, phoneNumber);
    }
}
