package org.example.backend.model.chat;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.example.backend.model.user.User;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class GroupChat extends Chat{

    @ManyToMany
    Set<User> admins;

    @ManyToOne
    User createdBy;

    String GroupImage;
    String groupName;
    String description;
}
