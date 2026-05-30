package com.rprakashdass.possystem.dao;


import com.rprakashdass.possystem.pojo.Client;
import org.springframework.stereotype.Repository;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

@Repository
public class ClientDao extends AbstractDao<Client> {

    private static final Logger logger = LogManager.getLogger(ClientDao.class);

    static final String SEARCH_QUERY = """
        SELECT c from Client c
        WHERE (:id IS NULL OR c.id = :id)
            AND (:name IS NULL OR c.name=:name)
            AND (:email IS NULL OR c.email=:email)
            AND (:phoneNumber IS NULL OR c.phoneNumber=:phoneNumber)
        ORDER BY c.id ASC
        """;

    public ClientDao() {
        super(Client.class);
    }

    public List<Client> getClients () {
        logger.info("Fetching all clients from database.");
        return findAll();
    }

    public Client getClientById (Long id) {
        logger.info("Fetching client with ID: {}", id);
        return findById(id);
    }

    public List<Client> searchClients (Long id, String name, String email, String phoneNumber) {
        logger.info("Searching clients with criteria - ID: {}, Name: {}, Email: {}, Phone: {}", id, name, email, phoneNumber);
        return em.createQuery(SEARCH_QUERY, Client.class)
                .setParameter("id", id)
                .setParameter("name", name)
                .setParameter("phoneNumber", phoneNumber)
                .setParameter("email", email)
                .getResultList();
    }
}
