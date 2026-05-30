package com.rprakashdass.possystem.models.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserForm {
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank
    private String password;

    private String phoneNumber;
}
