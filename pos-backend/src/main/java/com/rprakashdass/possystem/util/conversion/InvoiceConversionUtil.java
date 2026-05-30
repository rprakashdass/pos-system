package com.rprakashdass.possystem.util.conversion;

import com.rprakashdass.possystem.dto.InvoiceDto;
import com.rprakashdass.possystem.pojo.Invoice;

public class InvoiceConversionUtil {

    public static InvoiceDto convert(Invoice invoice) {
        InvoiceDto dto = new InvoiceDto();
        dto.setId(invoice.getId());
        dto.setOrderId(invoice.getOrder().getId());
        dto.setCreatedAt(invoice.getCreatedAt());
        return dto;
    }
}
