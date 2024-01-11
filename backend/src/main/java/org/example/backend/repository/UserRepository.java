package org.example.backend.repository;

import lombok.NonNull;
import org.example.backend.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {

    User getUserByEmail(String username);
    User getUserById(Long id);

    void delete(@NonNull User entity);

    List<User> findUsersByFullNameContainingIgnoreCase(String query);

    @Query("select u from User u")
    List<User> getAllUsers();
}
