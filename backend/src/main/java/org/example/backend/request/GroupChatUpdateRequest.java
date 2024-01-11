package org.example.backend.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class GroupChatUpdateRequest {
    Long id;
    String GroupImage;
    String groupName;
    String description;
}
