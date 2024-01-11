package org.example.backend.response;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.message.Message;
import org.example.backend.model.user.User;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class MessageInfoResponse {
    Long id;
    String content;
    LocalDateTime timestamp;
    Long chatId;
    Long senderId;
    String senderName;

    public static List<MessageInfoResponse> bulkConvertMessageToMessageInfoResponse(List<Message> messages) {
        return messages.stream().map(message -> new MessageInfoResponse(message.getId(), message.getContent(),
                message.getTimestamp(), message.getChat().getChatId(), message.getSender().getId(),
                message.getSender().getFullName())).collect(Collectors.toList());
    }
}
