package org.example.backend.service.chat;

import org.example.backend.constants.ChatType;
import org.example.backend.exception.UnknownTypeException;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.chat.DirectChat;
import org.example.backend.model.chat.GroupChat;
import org.example.backend.model.user.User;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Component
public class ChatFactory {

    public Chat getChat(ChatType type, User createdBy, Set<User> members, String chatName, String groupImage) throws UnknownTypeException {
        if(type == ChatType.GROUP_CHAT) {
            GroupChat chat = new GroupChat();
            chat.setCreatedBy(createdBy);
            members.add(createdBy);
            chat.setMembers(members);
            chat.setType(ChatType.GROUP_CHAT);
            chat.setGroupName(chatName);
            chat.setGroupImage(groupImage);
            Set<User> admins = new HashSet<>();
            admins.add(createdBy);
            chat.setAdmins(admins);
            chat.setMessages(new ArrayList<>());
            return chat;
        } else if (type == ChatType.DIRECT_CHAT) {
            DirectChat chat = new DirectChat();
            members.add(createdBy);
            chat.setMembers(members);
            chat.setType(ChatType.DIRECT_CHAT);
            chat.setMessages(new ArrayList<>());
            return chat;
        } else {
            throw new UnknownTypeException("Chat type "+type+" not known");
        }
    }

}
