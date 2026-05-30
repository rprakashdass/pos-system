package com.rprakashdass.possystem.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rprakashdass.possystem.dao.ClientDao;
import com.rprakashdass.possystem.pojo.Client;

import jakarta.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Service
@Transactional
public class ClientApi {

    private static final Logger logger = LogManager.getLogger(ClientApi.class);

    @Autowired
    private ClientDao clientDao;

    public List<Client> getClients() {
        logger.info("Fetching all clients");
        return clientDao.getClients();
    }

    public Client createClient(String name, String email, String phoneNumber) {
        logger.info("Creating new client with name: {}", name);
        Client client = new Client();
        client.setName(name);
        client.setEmail(email);
        client.setPhoneNumber(phoneNumber);
        Client savedClient = clientDao.save(client);
        logger.info("Successfully created client with ID: {}", savedClient.getId());
        return savedClient;
    }

    public Client getById(Long id) {
        logger.info("Fetching client with ID: {}", id);
        return clientDao.getClientById(id);
    }

    public Client update(Long id, String name, String email, String phoneNumber) {
        logger.info("Updating client with ID: {}", id);
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
        Client updatedClient = clientDao.save(client);
        logger.info("Successfully updated client with ID: {}", updatedClient.getId());
        return updatedClient;
    }

    public List<Client> searchClients(Long id, String name, String email, String phoneNumber) {
        logger.info("Searching for clients with criteria - ID: {}, Name: {}, Email: {}, Phone: {}", id, name, email, phoneNumber);
        return clientDao.searchClients(id, name, email, phoneNumber);
    }

    public void delete(Long id) {
        logger.info("Deleting client with ID: {}", id);
        Client client = getById(id);
        clientDao.delete(client);
        logger.info("Successfully deleted client with ID: {}", id);
    }
}
