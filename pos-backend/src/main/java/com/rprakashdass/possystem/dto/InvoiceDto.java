package com.rprakashdass.possystem.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class InvoiceDto {
    private Long id;
    private Long orderId;
    private LocalDateTime createdAt;
}
