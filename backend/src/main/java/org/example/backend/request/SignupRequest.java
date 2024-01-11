package org.example.backend.request;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import org.example.backend.constants.UserType;

@AllArgsConstructor
@Data
public class SignupRequest {
    @NonNull
    String email;
    @NonNull
    String fullName;
    @NonNull
    String password;

    @NonNull
    UserType userType;
}
