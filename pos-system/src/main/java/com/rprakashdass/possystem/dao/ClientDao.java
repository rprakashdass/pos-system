package com.rprakashdass.possystem.dao;


import com.rprakashdass.possystem.pojo.Client;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ClientDao extends AbstractDao<Client> {

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
        return findAll();
    }

    public Client getClientById (Long id) {return findById(id);}

    public List<Client> searchClients (Long id, String name, String email, String phoneNumber) {
        return em.createQuery(SEARCH_QUERY, Client.class)
                .setParameter("id", id)
                .setParameter("name", name)
                .setParameter("phoneNumber", phoneNumber)
                .setParameter("email", email)
                .getResultList();
    }
}
