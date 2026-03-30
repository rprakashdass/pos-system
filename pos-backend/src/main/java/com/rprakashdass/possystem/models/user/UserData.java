package com.rprakashdass.possystem.models.user;

import com.rprakashdass.possystem.Enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserData {
    private String name;
    private String phoneNumber;
    private String email;
    private UserRole role;
}