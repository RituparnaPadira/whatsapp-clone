package org.example.backend.model.message;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.user.User;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    String content;

    @CreationTimestamp
    LocalDateTime timestamp;

    @NonNull
    @ManyToOne(cascade = CascadeType.ALL)
    Chat chat;

    @NonNull
    @ManyToOne
    User sender;
}
