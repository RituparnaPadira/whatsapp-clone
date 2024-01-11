package org.example.backend.service.user;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.example.backend.constants.EditableUserAttribute;
import org.example.backend.constants.UserType;
import org.example.backend.exception.UnknownTypeException;
import org.example.backend.exception.UserException;
import org.example.backend.model.user.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.request.UpdateUserRequest;
import org.example.backend.service.auth.TokenProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.example.backend.constants.EditableUserAttribute.*;


@Service
@AllArgsConstructor
@NoArgsConstructor
public class UserService {

    @Autowired
    UserFactory factory;

    @Autowired
    protected UserRepository repository;

    @Autowired
    TokenProviderService tokenProviderService;

    public User createUser(String fullName, String email, String password, UserType type) throws Exception {
        User newUser = factory.createUser(fullName, email, password, type);
        System.out.println("Created new user with email"+ newUser.getEmail());
        repository.save(newUser);
        return newUser;
    }

    public User getUserByEmail(String email) throws UserException {
        User user = repository.getUserByEmail(email);
        if(user == null) {
            throw new UserException("User not found with given email");
        }
        return user;
    }

    public List<User> getAllUsers() {
        return repository.getAllUsers();
    }

    public void deleteUser(User user) {
        //TODO: Remove the user from all chats
        repository.delete(user);
    }

    public List<User> getAllUsersByFullNameContaining(String query) {
        return repository.findUsersByFullNameContainingIgnoreCase(query);
    }

    public User getUserByToken(String jwt) throws UserException {
        String email = tokenProviderService.getEmailFromToken(jwt);
        return getUserByEmail(email);
    }

    public void updateUser(User user, EditableUserAttribute attribute, String newValue) throws UnknownTypeException {
        if(attribute ==FULL_NAME) {
            user.setFullName(newValue);
        } else if(attribute == IMAGE) {
            user.setImage(newValue);
        } else if(attribute == STATUS_TEXT) {
            user.setStatusText(newValue);
        } else {
            throw new UnknownTypeException("Unknown attribute "+attribute+" for general user");
        }
        this.repository.save(user);
    }

    public void updateUser(User user, List<UpdateUserRequest> updatedList) {
        updatedList.stream().forEach(request -> {
            try {
                 updateUser(user, request.getAttribute(), request.getValue());
            } catch (UnknownTypeException e) {
                System.out.println(e);
            }
        });
    }

    public User getUserById(Long id) throws UserException {
        User user = repository.getUserById(id);
        if(user == null) {
            throw new UserException("User not found with given email");
        }
        return user;
    }
}
