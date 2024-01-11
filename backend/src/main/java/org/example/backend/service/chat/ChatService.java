package org.example.backend.service.chat;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.example.backend.constants.ChatType;
import org.example.backend.constants.GroupMemberType;
import org.example.backend.constants.OperationType;
import org.example.backend.exception.ChatException;
import org.example.backend.exception.UnknownTypeException;
import org.example.backend.exception.UserException;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.chat.GroupChat;
import org.example.backend.model.message.Message;
import org.example.backend.model.user.User;
import org.example.backend.repository.ChatRepository;
import org.example.backend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
@AllArgsConstructor
public class ChatService {

    ChatRepository chatRepository;
    ChatFactory factory;
    UserService userService;

    public Chat getChatById(Long chatId) throws ChatException {
        Chat chat = chatRepository.getChatByChatId(chatId);
        if(chat == null) {
            throw new ChatException("Chat not found");
        }
        return chat;
    }

    public Chat getChatById(Long chatId, User user) throws ChatException, UserException {
        Chat chat = getChatById(chatId);
        if(chat.getMembers().contains(user)) {
            return chat;
        } else {
            throw new UserException("User not authorized to get this chat");
        }
    }

    public List<Long> getAllChatIdsByUser(User user) {
        return chatRepository.getAllChatIdsContainingUser(user);
    }

    public List<Chat> getAllChatsByUser(User user) {
        return chatRepository.getAllChatsContainingUser(user);
    }

    public Chat createChat(ChatType type, User createdBy, List<Long> memberIds, String chatName, String groupImage) throws UnknownTypeException {
        Set<User> members = new HashSet<>();
        memberIds.forEach(id -> {
            try {
                members.add(userService.getUserById(id));
            } catch (UserException e) {
                System.out.println("Member with id "+id+" not found");
            }
        });
        Chat chat = factory.getChat(type, createdBy, members, chatName, groupImage);
        return chatRepository.save(chat);
    }

    public Chat getDirectChatByUser(User requestedBy, User user2) {
        List<Long> reqUserChats = getAllChatIdsByUser(requestedBy);
        List<Long> user2Chats = getAllChatIdsByUser(user2);
        reqUserChats.retainAll(user2Chats);
        Chat reqChat = null;
        for(Long chatId: reqUserChats) {
            try {
                Chat chat = getChatById(chatId);
                if (chat.getType() == ChatType.DIRECT_CHAT) {
                    reqChat = chat;
                    break;
                }
            } catch (ChatException e) {
                System.out.println(e);
            }
        }
        if(reqChat!= null) {
            return reqChat;
        }
        return null;
    }

    public void addMessage(Message message, @NonNull Chat chat) {
        chat.getMessages().add(message);
        chatRepository.save(chat);
    }
    public void removeMessage(Message message, @NonNull Chat chat) {
        chat.getMessages().remove(message);
        chatRepository.save(chat);
    }

    public GroupChat updateGroupChat(User user, Long chatId , String name, String image, String desc)
            throws ChatException, UserException {
        Chat chat = getChatById(chatId);
        if(chat instanceof GroupChat groupChat) {
            if(groupChat.getAdmins().contains(user)) {
                return updateGroupChat(groupChat, name, image, desc);
            } else {
                throw new UserException("User not an admin of this group");
            }
        }
        throw new ChatException("Chat not of type group chat");
    }

    public GroupChat updateGroupChat(GroupChat chat,String name, String image, String desc) {
        if(name != null) {
            chat.setGroupName(name);
        }
        if(image != null) {
            chat.setGroupImage(image);
        }
        if(desc != null) {
            chat.setDescription(desc);
        }
        chatRepository.save(chat);
        return chat;
    }

    public GroupChat addUser(User user, GroupChat chat, GroupMemberType type) {
        chat.getMembers().add(user);
        if(type == GroupMemberType.ADMIN) {
            chat.getAdmins().add(user);
        }
        chatRepository.save(chat);
        return chat;
    }

    public GroupChat removeUser(User user, GroupChat chat, GroupMemberType type) {
        chat.getAdmins().remove(user);
        if(type == GroupMemberType.MEMBER) {
            chat.getMembers().remove(user);
        }
        chatRepository.save(chat);
        return chat;
    }

    public GroupChat updateMembers(User requestedBy, User updateUser, Long chatId,
                                   OperationType type, GroupMemberType memberType)
            throws ChatException, UserException, UnknownTypeException {

        Chat chat = getChatById(chatId);
        if (chat instanceof GroupChat groupChat) {
            if (groupChat.getAdmins().contains(requestedBy)) {
                if (type == OperationType.ADD) {
                    return addUser(updateUser, groupChat, memberType);
                } else if (type == OperationType.REMOVE) {
                    return removeUser(updateUser, groupChat, memberType);
                } else {
                    throw new UnknownTypeException("Unknown Operation type " + type);
                }
            } else {
                throw new UserException("User not an admin in this group");
            }
        }
        throw new ChatException("Chat not of type group");
    }

    public void deleteChat(Long chatId, User user) throws ChatException, UserException {
        Chat chat = getChatById(chatId);
        if(!(chat instanceof GroupChat groupChat && !groupChat.getAdmins().contains(user))) {
            chatRepository.delete(chat);
        } else {
            throw new UserException("User not authorized");
        }
    }
}
