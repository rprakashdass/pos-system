package com.rprakashdass.possystem.dao;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

public abstract class AbstractDao<T> {

    @PersistenceContext
    protected EntityManager em;

    protected final Class<T> entityClass;
    protected AbstractDao(Class<T> entityClass) {
        this.entityClass = entityClass;
    }

    public T findById(Long id) {
        return em.find(entityClass, id);
    }

    public List<T> findAll() {
        return em.createQuery("SELECT e FROM " + entityClass.getSimpleName() + " e", entityClass).getResultList();
    }

    public T save(T entity) {
        if (isNew(entity)) {
            em.persist(entity);
            return entity;
        }
        return em.merge(entity);
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
