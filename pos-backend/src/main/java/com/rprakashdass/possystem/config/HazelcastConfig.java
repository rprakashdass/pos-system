package com.rprakashdass.possystem.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnCloudPlatform;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.cloud.CloudPlatform;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.hazelcast.config.Config;
import com.hazelcast.config.EvictionPolicy;
import com.hazelcast.config.JoinConfig;
import com.hazelcast.config.MapConfig;
import com.hazelcast.config.MaxSizePolicy;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;

@Configuration
public class HazelcastConfig {

    @Configuration
    @ConditionalOnCloudPlatform(CloudPlatform.KUBERNETES)
    static class Kubernetes {
        @Bean
        public HazelcastInstance kubernetesHazelcastInstance(
                @Value("${hazelcast.k8s.namespace}") String namespace,
                @Value("${hazelcast.k8s.service-name}") String serviceName) {
            Config config = new Config();
            config.setInstanceName("pos-hazelcast-instance");

            JoinConfig join = config.getNetworkConfig().getJoin();
            join.getMulticastConfig().setEnabled(false);
            join.getTcpIpConfig().setEnabled(false);
            join.getKubernetesConfig()
                .setEnabled(true)
                .setProperty("namespace", namespace)
                .setProperty("service-name", serviceName);

            config.addMapConfig(productsMapConfig());
            return Hazelcast.newHazelcastInstance(config);
        }
    }

    @Configuration
    @ConditionalOnMissingBean(HazelcastInstance.class)
    static class Local {
        @Bean
        public HazelcastInstance localHazelcastInstance() {
            Config config = new Config();
            config.setInstanceName("pos-hazelcast-instance");

            JoinConfig join = config.getNetworkConfig().getJoin();
            join.getMulticastConfig().setEnabled(false);
            join.getTcpIpConfig()
                .setEnabled(true)
                .addMember("127.0.0.1");

            config.addMapConfig(productsMapConfig());
            return Hazelcast.newHazelcastInstance(config);
        }
    }

    private static MapConfig productsMapConfig() {
        MapConfig products = new MapConfig("products")
            .setTimeToLiveSeconds(300)
            .setMaxIdleSeconds(60);
        products.getEvictionConfig()
            .setEvictionPolicy(EvictionPolicy.LRU)
            .setMaxSizePolicy(MaxSizePolicy.PER_NODE)
            .setSize(500);
        return products;
    }
}
