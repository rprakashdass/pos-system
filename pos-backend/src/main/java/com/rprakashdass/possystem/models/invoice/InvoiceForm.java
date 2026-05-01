package com.rprakashdass.possystem.models.invoice;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class InvoiceForm {
    private Long orderId;
}
