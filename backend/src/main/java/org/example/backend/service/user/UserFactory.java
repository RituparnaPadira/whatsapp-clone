package org.example.backend.service.user;

import org.example.backend.constants.UserType;
import org.example.backend.model.user.AdminUser;
import org.example.backend.model.user.GeneralUser;
import org.example.backend.model.user.User;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class UserFactory {

    private static UserFactory factory;

    private UserFactory() {
    }

    public static UserFactory getFactory() {
        if(factory==null) {
            synchronized (UserFactory.class) {
                if(factory==null) {
                    factory = new UserFactory();
                }
            }
        }
        return factory;
    }

    public User createUser(String fullName, String email, String password, UserType type) throws Exception {
        User user;
        if(type==UserType.GENERAL) {
            user = new GeneralUser();
        } else if(type==UserType.ADMIN) {
            user = new AdminUser();
        } else throw new Exception("User of type "+type+" is not defined");

        user.setUserType(UserType.GENERAL);
        user.setFullName(fullName);
        user.setPassword(password);
        user.setEmail(email);
        return user;
    }
}
