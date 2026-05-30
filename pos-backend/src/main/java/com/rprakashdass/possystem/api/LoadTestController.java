package com.rprakashdass.possystem.api;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rprakashdass.possystem.models.client.ClientForm;
import com.rprakashdass.possystem.models.inventory.InventoryCreateForm;
import com.rprakashdass.possystem.models.invoice.InvoiceForm;
import com.rprakashdass.possystem.models.order.OrderForm;
import com.rprakashdass.possystem.models.order.OrderItemForm;
import com.rprakashdass.possystem.models.product.ProductForm;

@RestController
@RequestMapping("/load/test")
public class LoadTestController {

    @Autowired
    private ClientApi clientApi;

    @Autowired
    private ProductApi productApi;

    @Autowired
    private InventoryApi inventoryApi;

    @Autowired
    private OrderApi orderApi;

    @Autowired
    private InvoiceApi invoiceApi;


    @GetMapping("/simple")
    public Map<String, Object> simple() {
        Map<String, Object> m = new HashMap<>();
        m.put("status", "ok");
        m.put("timestamp", Instant.now().toString());
        return m;
    }

    @GetMapping("/delay")
    public Map<String, Object> delay(@RequestParam(defaultValue = "100") long ms) throws InterruptedException {
        long start = System.currentTimeMillis();
        Thread.sleep(ms);
        Map<String, Object> m = new HashMap<>();
        m.put("status", "ok");
        m.put("delayMs", ms);
        m.put("elapsed", System.currentTimeMillis() - start);
        return m;
    }

    @GetMapping("/random")
    public List<Map<String, Object>> random(@RequestParam(defaultValue = "100") int size) {
        Random r = new Random();
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            Map<String, Object> obj = new HashMap<>();
            obj.put("id", i + 1);
            obj.put("name", "item-" + r.nextInt(100000));
            obj.put("price", Math.round(r.nextDouble() * 10000) / 100.0);
            list.add(obj);
        }
        return list;
    }

    @PostMapping("/order")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> body) {
        int items = Optional.ofNullable((List<?>) body.get("items")).map(List::size).orElse(0);
        double acc = 0;
        for (int i = 0; i < Math.min(items, 1000); i++) {
            acc += Math.sqrt(i) * Math.random();
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("received", body);
        resp.put("processedItems", items);
        resp.put("processingScore", acc);
        resp.put("timestamp", Instant.now().toString());
        return resp;
    }

    @PostMapping("/bulk")
    public Map<String, Object> bulk(@RequestBody Map<String, Object> body) {
        int count = Optional.ofNullable(body.get("count")).map(Object::toString).map(Integer::parseInt).orElse(10);
        List<Map<String, Object>> results = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            Map<String, Object> entry = new HashMap<>();
            int cycle = i + 1;
            String seed = String.valueOf(Instant.now().toEpochMilli()) + "-" + cycle;
            try {
                // create client
                ClientForm cf = new ClientForm();
                cf.setName("Load Client " + seed);
                cf.setEmail("load-" + seed + "@example.com");
                cf.setPhoneNumber("+1555" + (1000 + cycle));
                var createdClient = clientApi.createClient(cf.getName(), cf.getEmail(), cf.getPhoneNumber());

                // create product
                ProductForm pf = new ProductForm();
                pf.setName("Load Product " + seed);
                pf.setBarcode("LB-" + seed);
                pf.setDescription("Bulk load product for " + seed);
                pf.setPrice(10.0 + cycle);
                pf.setClientId(createdClient.getId());
                var createdProduct = productApi.add(pf);

                // create inventory
                InventoryCreateForm inv = new InventoryCreateForm();
                inv.setProductId(createdProduct.getId());
                inv.setQuantity(25);
                var createdInventory = inventoryApi.create(inv);

                // create order
                OrderForm of = new OrderForm();
                of.setClientId(createdClient.getId());
                OrderItemForm item = new OrderItemForm();
                item.setProductId(createdProduct.getId());
                item.setQuantity(1L);
                of.setItems(java.util.List.of(item));
                var createdOrder = orderApi.add(of);

                // create invoice
                InvoiceForm invoiceForm = new InvoiceForm();
                invoiceForm.setOrderId(createdOrder.getId());
                var createdInvoice = invoiceApi.add(invoiceForm);

                entry.put("cycle", cycle);
                entry.put("clientId", createdClient.getId());
                entry.put("productId", createdProduct.getId());
                entry.put("inventoryId", createdInventory.getId());
                entry.put("orderId", createdOrder.getId());
                entry.put("invoiceId", createdInvoice.getId());
                entry.put("status", "success");
            } catch (Exception ex) {
                entry.put("cycle", cycle);
                entry.put("status", "error");
                entry.put("error", ex.getMessage());
            }
            results.add(entry);
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("requested", count);
        resp.put("results", results);
        resp.put("timestamp", Instant.now().toString());
        return resp;
    }

}
