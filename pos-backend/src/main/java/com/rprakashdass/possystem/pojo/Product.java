package com.rprakashdass.possystem.pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
        name = "products",
        uniqueConstraints = { @UniqueConstraint(name = "uk_product_barcode", columnNames = "barcode")},
        indexes = {
            @Index(name = "idx_product_barcode", columnList = "barcode")
        }
)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long clientId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false,  unique = true)
    private String barcode;

    @Column(nullable = false)
    private Double price;

    private String description;
}