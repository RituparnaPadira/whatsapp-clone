package org.example.backend.controller;

import lombok.AllArgsConstructor;
import org.example.backend.constants.EditableUserAttribute;
import org.example.backend.exception.UnknownTypeException;
import org.example.backend.exception.UserException;
import org.example.backend.model.user.User;
import org.example.backend.request.UpdateUserRequest;
import org.example.backend.response.ApiResponse;
import org.example.backend.response.UserInfoResponse;
import org.example.backend.service.auth.TokenProviderService;
import org.example.backend.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.example.backend.constants.JwtConstants.JWT_HEADER;

@AllArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    UserService userService;
    TokenProviderService tokenProvider;

    @PostMapping("/update")
    ResponseEntity<ApiResponse> updateUser(@RequestBody UpdateUserRequest request,
                                           @RequestHeader(JWT_HEADER) String jwt) {
        String email = tokenProvider.getEmailFromToken(jwt);
        if(email == null) {
            return new ResponseEntity<>(new ApiResponse("Invalid token"), HttpStatus.UNAUTHORIZED);
        }
        try {
            User user = userService.getUserByEmail(email);
            userService.updateUser(user, request.getAttribute(), request.getValue());
        } catch (UserException e) {
            return new ResponseEntity<>(new ApiResponse("User not found"), HttpStatus.NOT_FOUND);
        } catch (UnknownTypeException e)  {
            return new ResponseEntity<>(new ApiResponse(String.valueOf(e)), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ApiResponse("User updated successfully"), HttpStatus.OK);
    }

    @GetMapping("/get")
    ResponseEntity<User> getUser(@RequestHeader(JWT_HEADER) String jwt) throws UserException {
        String email = tokenProvider.getEmailFromToken(jwt);
        if(email == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        User user = userService.getUserByEmail(email);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    ResponseEntity<ApiResponse> deleteUser(@RequestHeader(JWT_HEADER) String jwt) {
        String email = tokenProvider.getEmailFromToken(jwt);
        if(email == null) {
            return new ResponseEntity<>(new ApiResponse("Invalid token"), HttpStatus.UNAUTHORIZED);
        }
        try {
            User user = userService.getUserByEmail(email);
            userService.deleteUser(user);
        } catch (UserException e) {
            return new ResponseEntity<>(new ApiResponse("User not found"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ApiResponse("User deleted successfully"), HttpStatus.OK);
    }

    @GetMapping("/get/all")
    ResponseEntity<List<UserInfoResponse>> getAllUsersInfo() {
        List<User> allUsers = userService.getAllUsers();
        List<UserInfoResponse> response = UserInfoResponse.bulkConvertUserToUserInfoResponse(allUsers);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/search/{query}")
    ResponseEntity<List<User>> searchUsersByFullName(@PathVariable("query") String query) {
        List<User> users = userService.getAllUsersByFullNameContaining(query);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

}
