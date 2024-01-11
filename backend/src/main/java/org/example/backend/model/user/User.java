package org.example.backend.model.user;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.constants.UserType;
import org.example.backend.model.chat.Chat;

import java.util.List;

@Entity
@NoArgsConstructor
@Data
@EqualsAndHashCode
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected Long id;

    @NonNull
    String email;
    @NonNull
    String fullName;
    @NonNull
    String password;

    @NonNull
    @Enumerated(EnumType.STRING)
    UserType userType;

    String image;
    String statusText;

    @ManyToMany
    List<Chat> chats;
}
