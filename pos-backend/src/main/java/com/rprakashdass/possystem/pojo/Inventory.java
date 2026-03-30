package com.rprakashdass.possystem.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
        name = "products",
        uniqueConstraints = { @UniqueConstraint(name = "uk_product_id", columnNames = "product_id")},
        indexes = {
                @Index(name = "idx_product_id", columnList = "product_id")
        }
)
public class Inventory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Long quantity;
}