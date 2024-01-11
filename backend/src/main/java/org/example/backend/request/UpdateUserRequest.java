package org.example.backend.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.backend.constants.EditableUserAttribute;

@Data
@AllArgsConstructor
public class UpdateUserRequest {
    EditableUserAttribute attribute;
    String value;
}
