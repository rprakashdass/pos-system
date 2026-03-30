package com.rprakashdass.possystem.models.inventory;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryCreateForm {
    @NotNull
    private Long productId;
    @NotNull
    private Integer quantity;
}
