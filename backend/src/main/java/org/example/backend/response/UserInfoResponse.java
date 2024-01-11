package org.example.backend.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.backend.model.user.User;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class UserInfoResponse {

    Long id;
    String fullName;
    String image;
    String statusText;

    public static List<UserInfoResponse> bulkConvertUserToUserInfoResponse(List<User> users) {
        return users.stream().map(user -> {
            return new UserInfoResponse(user.getId(), user.getFullName(), user.getImage(), user.getStatusText());
        }).collect(Collectors.toList());
    }
}
