package com.rprakashdass.possystem.pojo;

import jakarta.persistence.*;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@MappedSuperclass
public abstract class BaseEntity {

    @Version
    private Long version;

    @Column(nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(nullable = false)
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        ZonedDateTime now = ZonedDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }

}