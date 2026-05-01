package com.rprakashdass.possystem.api;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rprakashdass.possystem.Enums.OrderStatus;
import com.rprakashdass.possystem.dao.ClientDao;
import com.rprakashdass.possystem.dao.OrderDao;
import com.rprakashdass.possystem.dao.OrderItemDao;
import com.rprakashdass.possystem.dao.ProductDao;
import com.rprakashdass.possystem.dto.OrderDto;
import com.rprakashdass.possystem.exception.ResourceNotFoundException;
import com.rprakashdass.possystem.models.order.OrderForm;
import com.rprakashdass.possystem.models.order.OrderItemForm;
import com.rprakashdass.possystem.pojo.Client;
import com.rprakashdass.possystem.pojo.Order;
import com.rprakashdass.possystem.pojo.OrderItem;
import com.rprakashdass.possystem.pojo.Product;
import com.rprakashdass.possystem.util.conversion.OrderConversionUtil;

@Service
public class OrderApi {

    @Autowired
    private OrderDao orderDao;
    @Autowired
    private OrderItemDao orderItemDao;
    @Autowired
    private ProductDao productDao;
    @Autowired
    private ClientDao clientDao;

    @Transactional
    public OrderDto add(OrderForm form) {
        Client client = getClient(form.getClientId());
        Order order = new Order();
        order.setClient(client);
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalPrice = 0;

        for (OrderItemForm itemForm : form.getItems()) {
            Product product = getProduct(itemForm.getProductId());
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemForm.getQuantity());
            orderItem.setSellingPrice(product.getPrice());
            orderItems.add(orderItem);
            totalPrice += itemForm.getQuantity() * product.getPrice();
        }

        order.setTotalPrice(totalPrice);
        order.setItems(orderItems);
        orderDao.save(order);
        
        for(OrderItem item: orderItems)
        {
            orderItemDao.save(item);
        }

        return OrderConversionUtil.convert(order);
    }

    @Transactional(readOnly = true)
    public OrderDto get(Long id) {
        Order order = getOrder(id);
        return OrderConversionUtil.convert(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAll() {
        return orderDao.findAll().stream()
                .map(OrderConversionUtil::convert)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto update(Long id, OrderForm form) {
        Order order = getOrder(id);
        // For now, we only support updating status.
        // A more complex update would involve updating items, which can get complicated.
        order.setStatus(form.getStatus());
        orderDao.save(order);
        return OrderConversionUtil.convert(order);
    }

    public Order getOrder(Long id) {
        Order order = orderDao.findById(id);
        if (order == null) {
            throw new ResourceNotFoundException("Order with given ID not found: " + id);
        }
        return order;
    }

    private Product getProduct(Long id) {
        Product product = productDao.findById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product with given ID not found: " + id);
        }
        return product;
    }

    private Client getClient(Long id) {
        Client client = clientDao.findById(id);
        if (client == null) {
            throw new ResourceNotFoundException("Client with given ID not found: " + id);
        }
        return client;
    }
}
