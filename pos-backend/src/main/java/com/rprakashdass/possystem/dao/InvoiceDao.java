package com.rprakashdass.possystem.dao;

import org.springframework.stereotype.Repository;

import com.rprakashdass.possystem.pojo.Invoice;

@Repository
public class InvoiceDao extends AbstractDao<Invoice> {
    public InvoiceDao() {
        super(Invoice.class);
    }
}
