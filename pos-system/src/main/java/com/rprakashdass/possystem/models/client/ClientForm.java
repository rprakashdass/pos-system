package com.rprakashdass.possystem.models.client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientForm {
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Email(message = "Invalid email format")
    private String email;
    private String phoneNumber;
}
