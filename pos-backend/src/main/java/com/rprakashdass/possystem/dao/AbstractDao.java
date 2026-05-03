package com.rprakashdass.possystem.dao;

import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public T save(T entity) {
        if (isNew(entity)) {
            em.persist(entity);
            return entity;
        }
        return em.merge(entity);
    }

    @Transactional
    public void delete(T entity) {
        if (entity == null) {
            return;
        }
        T managedEntity = em.contains(entity) ? entity : em.merge(entity);
        em.remove(managedEntity);
    }

    @Transactional
    public void deleteById(Long id) {
        if (id == null) {
            return;
        }
        T entity = findById(id);
        if (entity != null) {
            em.remove(entity);
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
