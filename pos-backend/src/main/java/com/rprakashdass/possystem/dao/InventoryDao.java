package com.rprakashdass.possystem.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.rprakashdass.possystem.pojo.Inventory;

import jakarta.persistence.TypedQuery;

@Repository
public class InventoryDao extends AbstractDao<Inventory> {

    public InventoryDao() {
        super(Inventory.class);
    }

    public List<Inventory> findByProductId(int productId) {
        String jpql = "select i from Inventory i where i.product.id = :productId";
        TypedQuery<Inventory> query = em.createQuery(jpql, Inventory.class);
        query.setParameter("productId", productId);
        return query.getResultList();
    }

}
