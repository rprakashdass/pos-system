package com.rprakashdass.possystem.api;

import com.rprakashdass.possystem.dao.InvoiceDao;
import com.rprakashdass.possystem.dao.OrderDao;
import com.rprakashdass.possystem.dto.InvoiceDto;
import com.rprakashdass.possystem.Enums.OrderStatus;
import com.rprakashdass.possystem.exception.ResourceNotFoundException;
import com.rprakashdass.possystem.models.invoice.InvoiceForm;
import com.rprakashdass.possystem.pojo.Invoice;
import com.rprakashdass.possystem.pojo.Order;
import com.rprakashdass.possystem.util.conversion.InvoiceConversionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceApi {

    @Autowired
    private InvoiceDao invoiceDao;

    @Autowired
    private OrderDao orderDao;

    @Transactional
    public InvoiceDto add(InvoiceForm form) {
        Order order = getOrder(form.getOrderId());
        Invoice invoice = new Invoice();
        invoice.setOrder(order);
        invoiceDao.save(invoice);
        order.setStatus(OrderStatus.INVOICED);
        orderDao.save(order);
        return InvoiceConversionUtil.convert(invoice);
    }

    @Transactional(readOnly = true)
    public InvoiceDto get(Long id) {
        Invoice invoice = getInvoice(id);
        return InvoiceConversionUtil.convert(invoice);
    }

    @Transactional(readOnly = true)
    public List<InvoiceDto> getAll() {
        return invoiceDao.findAll().stream()
                .map(InvoiceConversionUtil::convert)
                .collect(Collectors.toList());
    }

    private Order getOrder(Long id) {
        Order order = orderDao.findById(id);
        if (order == null) {
            throw new ResourceNotFoundException("Order with given ID not found: " + id);
        }
        return order;
    }

    private Invoice getInvoice(Long id) {
        Invoice invoice = invoiceDao.findById(id);
        if (invoice == null) {
            throw new ResourceNotFoundException("Invoice with given ID not found: " + id);
        }
        return invoice;
    }
}
