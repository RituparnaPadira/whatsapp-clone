package org.example.backend.service;

import lombok.AllArgsConstructor;
import org.example.backend.exception.ChatException;
import org.example.backend.exception.MessageException;
import org.example.backend.exception.UserException;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.message.Message;
import org.example.backend.model.user.User;
import org.example.backend.repository.MessageRepository;
import org.example.backend.service.chat.ChatService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class MessageService {

    MessageRepository repository;
    ChatService chatService;
    public Message getMessageById(Long id) {
        return repository.getMessageById(id);
    }

    public List<Message> getAllMessagesByChatId(Long chatId, User user) throws UserException, ChatException {
        Chat chat = chatService.getChatById(chatId);
        if(chat.getMembers().contains(user)) {
            return repository.getMessagesByChat(chat);
        } else {
            throw new UserException("User is not part of this chat");
        }
    }

    public Message createMessage(User createdBy, String content, Chat parentChat) {
        Message newMessage = new Message(parentChat, createdBy);
        newMessage.setContent(content);
        newMessage.setTimestamp(LocalDateTime.now());
        repository.save(newMessage);
        chatService.addMessage(newMessage, parentChat);
        return newMessage;
    }

    public void updateMessageContent(User user, Long messageId, String content) throws MessageException, UserException {
        Message message = getMessageById(messageId);
        if(message == null) {
            throw new MessageException("Message not found");
        }
        if(message.getSender() == user) {
            message.setContent(content);
            repository.save(message);
        } else {
            throw new UserException("User not authorized to edit this message");
        }
    }

    public void deleteMessageById(Long messageId, User user) throws MessageException, UserException {
        if(repository.existsById(messageId)) {
            Message message = getMessageById(messageId);
            if (message.getSender() == user) {
                repository.deleteMessageById(messageId);
                chatService.removeMessage(message, message.getChat());
            } else {
                throw new UserException("User unauthorised to delete the message");
            }
        } else {
            throw new MessageException("Message not found");
        }
    }

}
