package com.rprakashdass.possystem.api;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.rprakashdass.possystem.Enums.OrderStatus;
import com.rprakashdass.possystem.dao.ClientDao;
import com.rprakashdass.possystem.dao.InventoryDao;
import com.rprakashdass.possystem.dao.OrderDao;
import com.rprakashdass.possystem.dao.OrderItemDao;
import com.rprakashdass.possystem.dao.ProductDao;
import com.rprakashdass.possystem.dto.OrderDto;
import com.rprakashdass.possystem.exception.ResourceNotFoundException;
import com.rprakashdass.possystem.models.order.OrderForm;
import com.rprakashdass.possystem.models.order.OrderItemForm;
import com.rprakashdass.possystem.pojo.Client;
import com.rprakashdass.possystem.pojo.Inventory;
import com.rprakashdass.possystem.pojo.Order;
import com.rprakashdass.possystem.pojo.OrderItem;
import com.rprakashdass.possystem.pojo.Product;
import com.rprakashdass.possystem.util.conversion.OrderConversionUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Service
public class OrderApi {

    private static final Logger logger = LogManager.getLogger(OrderApi.class);

    @Autowired
    private OrderDao orderDao;
    @Autowired
    private OrderItemDao orderItemDao;
    @Autowired
    private ProductDao productDao;
    @Autowired
    private ClientDao clientDao;
    @Autowired
    private InventoryDao inventoryDao;

    @Transactional
    public OrderDto add(OrderForm form) {
        logger.info("Creating new order for client ID: {}", form.getClientId());
        Client client = getClient(form.getClientId());
        Order order = new Order();
        order.setClient(client);
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalPrice = 0;

        for (OrderItemForm itemForm : form.getItems()) {
            logger.debug("Processing order item for product ID: {} with quantity: {}", itemForm.getProductId(), itemForm.getQuantity());
            Product product = getProduct(itemForm.getProductId());
            Inventory inventory = getInventoryForProduct(product.getId());

            if (inventory.getQuantity() < itemForm.getQuantity()) {
                logger.warn("Insufficient inventory for product ID: {}. Required: {}, Available: {}", product.getId(), itemForm.getQuantity(), inventory.getQuantity());
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Insufficient inventory for product ID " + product.getId());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemForm.getQuantity());
            orderItem.setSellingPrice(product.getPrice());
            orderItems.add(orderItem);
            totalPrice += itemForm.getQuantity() * product.getPrice();

            inventory.setQuantity(inventory.getQuantity() - itemForm.getQuantity());
            inventoryDao.save(inventory);
        }

        order.setTotalPrice(totalPrice);
        order.setItems(orderItems);
        orderDao.save(order);
        
        for(OrderItem item: orderItems)
        {
            orderItemDao.save(item);
        }
        logger.info("Successfully created order with ID: {} for client ID: {}", order.getId(), client.getId());
        return OrderConversionUtil.convert(order);
    }

    @Transactional(readOnly = true)
    public OrderDto get(Long id) {
        logger.info("Fetching order with ID: {}", id);
        Order order = getOrder(id);
        return OrderConversionUtil.convert(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAll() {
        logger.info("Fetching all orders.");
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

    @Transactional
    public OrderDto updateStatus(Long id, OrderStatus status) {
        Order order = getOrder(id);
        order.setStatus(status);
        orderDao.save(order);
        return OrderConversionUtil.convert(order);
    }

    @Transactional
    public void delete(Long id) {
        Order order = getOrder(id);
        orderDao.delete(order);
    }

    public Order getOrder(Long id) {
        Order order = orderDao.findById(id);
        if (order == null) {
            logger.error("Order with ID: {} not found.", id);
            throw new ResourceNotFoundException("Order with given ID not found: " + id);
        }
        return order;
    }

    private Product getProduct(Long id) {
        Product product = productDao.findById(id);
        if (product == null) {
            logger.error("Product with ID: {} not found while creating order.", id);
            throw new ResourceNotFoundException("Product with given ID not found: " + id);
        }
        return product;
    }

    private Client getClient(Long id) {
        Client client = clientDao.findById(id);
        if (client == null) {
            logger.error("Client with ID: {} not found while creating order.", id);
            throw new ResourceNotFoundException("Client with given ID not found: " + id);
        }
        return client;
    }

    private Inventory getInventoryForProduct(Long productId) {
        List<Inventory> inventoryList = inventoryDao.findByProductId(productId.intValue());
        if (inventoryList.isEmpty()) {
            logger.error("Inventory not found for product ID: {}", productId);
            throw new ResourceNotFoundException("Inventory not found for product ID: " + productId);
        }
        return inventoryList.get(0);
    }
}
