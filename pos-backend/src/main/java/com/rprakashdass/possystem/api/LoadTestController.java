package com.rprakashdass.possystem.api;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/load/test")
public class LoadTestController {

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

}
