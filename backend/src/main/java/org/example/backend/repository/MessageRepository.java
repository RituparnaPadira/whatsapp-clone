package org.example.backend.repository;

import lombok.NonNull;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.message.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Message getMessageById(Long id);
    List<Message> getMessagesByChat(Chat chat);
    void deleteMessageById(Long id);
}
