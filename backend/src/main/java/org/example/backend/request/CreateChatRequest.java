package org.example.backend.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.example.backend.constants.ChatType;

import java.util.List;
import java.util.Set;

@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class CreateChatRequest {
    @NonNull
    ChatType type;

    @NonNull
    List<Long> memberIds;

    String groupName;
    String groupImage;
}
