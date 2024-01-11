package org.example.backend.service.user;

import lombok.AllArgsConstructor;
import org.example.backend.constants.EditableUserAttribute;
import org.example.backend.exception.UnknownTypeException;
import org.example.backend.model.user.AdminUser;
import org.example.backend.model.user.User;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.auth.TokenProviderService;

import static org.example.backend.constants.EditableUserAttribute.*;

@AllArgsConstructor
public class AdminUserService extends UserService{

    @Override
    public void updateUser(User user, EditableUserAttribute attribute, String newValue) throws UnknownTypeException {
        AdminUser adminUser = (AdminUser) user;
        if(attribute ==FULL_NAME) {
            adminUser.setFullName(newValue);
        } else if(attribute == IMAGE) {
            adminUser.setImage(newValue);
        } else if(attribute == STATUS_TEXT) {
            adminUser.setStatusText(newValue);
        } else if(attribute == DEPARTMENT){
            adminUser.setDepartment(newValue);
        } else {
            throw new UnknownTypeException("Unknown attribute "+attribute+" for adminUser");
        }
        repository.save(adminUser);
    }
}
