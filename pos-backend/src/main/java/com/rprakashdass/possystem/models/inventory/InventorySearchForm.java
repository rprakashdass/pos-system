package com.rprakashdass.possystem.models.inventory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventorySearchForm {
    private Long product_id;
    private String barcode;
    private String name;
    private Integer page = 0;
    private Integer pageSize = 10;
}
