package org.example.backend.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.backend.constants.ChatType;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.chat.DirectChat;
import org.example.backend.model.chat.GroupChat;
import org.example.backend.model.message.Message;
import org.example.backend.model.user.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ChatInfoResponse {
    Long id;
    ChatType chatType;
    MessageInfo lastMessage;
    String image;
    String chatName;

    private static MessageInfo convertMessageToInfo(Message message, Long chatId) {
        return new MessageInfo(message.getContent(), message.getTimestamp(), chatId, message.getSender().getFullName());
    }

    public static List<ChatInfoResponse> bulkConvertChatToChatInfo(List<Chat> chats, User curUser) {
        return chats.stream().map(chat -> {
            ChatInfoResponse res = new ChatInfoResponse();
            res.setId(chat.getChatId());
            res.setChatType(chat.getType());
            int numberOfMessages = chat.getMessages().size();
            System.out.println("numMessages"+ numberOfMessages);
            if(numberOfMessages > 0) {
                Message last = chat.getMessages().get(numberOfMessages - 1);
                res.setLastMessage(convertMessageToInfo(last, chat.getChatId()));
            }
            if(chat instanceof GroupChat groupChat) {
                res.setImage(groupChat.getGroupImage());
                res.setChatName(groupChat.getGroupName());
            } else if(chat instanceof DirectChat directChat) {
                for(User user: directChat.getMembers()) {
                    if(user!=curUser) {
                        res.setImage(user.getImage());
                        res.setChatName(user.getFullName());
                    }
                }
            }
            return res;
        }).collect(Collectors.toList());
    }
}

@Data
@AllArgsConstructor
class MessageInfo {
    String content;
    LocalDateTime timestamp;
    Long chatId;
    String senderName;

}

