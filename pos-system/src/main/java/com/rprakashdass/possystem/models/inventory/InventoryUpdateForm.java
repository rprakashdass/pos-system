package com.rprakashdass.possystem.models.inventory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryUpdateForm {
    @NotNull
    private Long id;

    @NotNull
    @Min(value = 1, message = "Quantity cannot be less than 1")
    private Long quantity;
}
