package org.example.backend.model.chat;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.constants.ChatType;
import org.example.backend.model.message.Message;
import org.example.backend.model.user.User;

import java.util.List;
import java.util.Set;

import static jakarta.persistence.GenerationType.AUTO;


@Entity
@Data
@RequiredArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class Chat {

    @Id
    @GeneratedValue(strategy = AUTO)
    Long chatId;

    @NonNull
    @ManyToMany
    Set<User> members;

    @OneToMany
    List<Message> messages;

    @NonNull
    ChatType type;
}
