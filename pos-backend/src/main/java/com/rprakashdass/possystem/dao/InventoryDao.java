package com.rprakashdass.possystem.dao;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.rprakashdass.possystem.pojo.Inventory;

import jakarta.persistence.TypedQuery;

@Repository
public class InventoryDao extends AbstractDao<Inventory> {

    private static final Logger logger = LogManager.getLogger(InventoryDao.class);

    public InventoryDao() {
        super(Inventory.class);
    }

    public List<Inventory> findByProductId(int productId) {
        logger.info("Finding inventory by product ID: {}", productId);
        String jpql = "select i from Inventory i where i.product.id = :productId";
        TypedQuery<Inventory> query = em.createQuery(jpql, Inventory.class);
        query.setParameter("productId", productId);
        List<Inventory> results = query.getResultList();
        logger.debug("Found {} inventory entries for product ID: {}", results.size(), productId);
        return results;
    }

}
