package org.example.backend.controller;

import lombok.AllArgsConstructor;
import org.example.backend.exception.UserException;
import org.example.backend.model.user.User;
import org.example.backend.request.SignupRequest;
import org.example.backend.service.auth.TokenProviderService;
import org.example.backend.request.LoginRequest;
import org.example.backend.response.AuthResponse;
import org.example.backend.service.CustomUserDetailService;
import org.example.backend.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    UserService userService;
    PasswordEncoder passwordEncoder;
    TokenProviderService tokenProvider;
    CustomUserDetailService userDetailService;

    @PostMapping(value="/signup")
    ResponseEntity<AuthResponse> signupHandler(@RequestBody SignupRequest request) throws Exception {
        try {
            User user = userService.getUserByEmail(request.getEmail());
            if(user !=null) {
                return new ResponseEntity<>(new AuthResponse(null, "User with this email already exists"),
                        HttpStatus.BAD_REQUEST);
            }
        } catch (UserException e) {
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        userService.createUser(request.getFullName(), request.getEmail(),
                encodedPassword, request.getUserType());
        Authentication authentication = new UsernamePasswordAuthenticationToken(request.getEmail(),
                request.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        return new ResponseEntity<>(new AuthResponse(jwt, null), HttpStatus.OK);
    }


    @PostMapping("/login")
    ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest request) {
        UserDetails userDetails = null;
        try {
            userDetails = userDetailService.loadUserByUsername(request.getEmail());
        } catch (Exception e) {
            System.out.println("Found exception "+e);
        }
        if(userDetails == null || userDetails.getUsername() == null) {
            return new ResponseEntity<>(new AuthResponse(null, "No user with this email exists"), HttpStatus.UNAUTHORIZED);
        }
        if(!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            return new ResponseEntity<>(new AuthResponse(null, "Wrong email or password"), HttpStatus.UNAUTHORIZED);
        }
        Authentication authentication = new UsernamePasswordAuthenticationToken(request.getEmail(), null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        return new ResponseEntity<>(new AuthResponse(jwt, null), HttpStatus.OK);
    }
}
