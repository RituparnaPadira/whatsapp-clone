package org.example.backend.repository;

import org.example.backend.model.chat.Chat;
import org.example.backend.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface ChatRepository extends JpaRepository<Chat, Long> {

    Chat getChatByChatId(Long id);

    @Query("select c.chatId from Chat c where :user member of c.members")
    List<Long> getAllChatIdsContainingUser(@Param("user") User user);

    @Query("select c from Chat c where :user member of c.members")
    List<Chat> getAllChatsContainingUser(@Param("user") User user);
}
