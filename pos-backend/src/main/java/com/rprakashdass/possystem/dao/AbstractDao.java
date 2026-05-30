package com.rprakashdass.possystem.dao;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractDao<T> {

    private static final Logger logger = LogManager.getLogger(AbstractDao.class);

    @PersistenceContext
    protected EntityManager em;

    protected final Class<T> entityClass;
    protected AbstractDao(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    public T findById(Long id) {
        logger.debug("Finding entity {} with ID: {}", entityClass.getSimpleName(), id);
        return em.find(entityClass, id);
    }

    public List<T> findAll() {
        logger.debug("Finding all entities for {}", entityClass.getSimpleName());
        return em.createQuery("SELECT e FROM " + entityClass.getSimpleName() + " e", entityClass).getResultList();
    }

    @Transactional
    public T save(T entity) {
        logger.debug("Saving entity of type {}", entityClass.getSimpleName());
        if (isNew(entity)) {
            em.persist(entity);
            logger.info("Persisted new entity: {}", entity);
            return entity;
        }
        T mergedEntity = em.merge(entity);
        logger.info("Merged existing entity: {}", mergedEntity);
        return mergedEntity;
    }

    @Transactional
    public void delete(T entity) {
        logger.debug("Deleting entity of type {}", entityClass.getSimpleName());
        if (entity == null) {
            logger.warn("Attempted to delete a null entity.");
            return;
        }
        T managedEntity = em.contains(entity) ? entity : em.merge(entity);
        em.remove(managedEntity);
        logger.info("Removed entity: {}", managedEntity);
    }

    @Transactional
    public void deleteById(Long id) {
        logger.debug("Deleting entity of type {} with ID: {}", entityClass.getSimpleName(), id);
        if (id == null) {
            logger.warn("Attempted to delete an entity with a null ID.");
            return;
        }
        T entity = findById(id);
        if (entity != null) {
            em.remove(entity);
            logger.info("Removed entity with ID: {}", id);
        } else {
            logger.warn("Attempted to delete a non-existent entity of type {} with ID: {}", entityClass.getSimpleName(), id);
        }
    }

    private boolean isNew(T entity) {
        try {
            Object id = entity.getClass().getMethod("getId").invoke(entity);
            return id == null;
        } catch (Exception e) {
            return true;
        }
    }
}
