package org.example.backend.controller;

import lombok.AllArgsConstructor;
import org.example.backend.exception.ChatException;
import org.example.backend.exception.MessageException;
import org.example.backend.exception.UserException;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.message.Message;
import org.example.backend.model.user.User;
import org.example.backend.response.ApiResponse;
import org.example.backend.response.MessageInfoResponse;
import org.example.backend.service.MessageService;
import org.example.backend.service.chat.ChatService;
import org.example.backend.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

import static org.example.backend.constants.JwtConstants.JWT_HEADER;

@AllArgsConstructor
@RestController
@RequestMapping("/api/message")
public class MessageController {

    MessageService service;
    UserService userService;
    ChatService chatService;

    @GetMapping("/get/{messageId}")
    public ResponseEntity<Message> getMessageById(@RequestHeader(JWT_HEADER) String jwt,
                                                  @PathVariable("messageId") Long messageId) {
        Message message = service.getMessageById(messageId);
        if(message==null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @GetMapping("/get/all/{chatId}")
    public ResponseEntity<List<MessageInfoResponse>> getAllMessagesByChatId(@RequestHeader(JWT_HEADER) String jwt,
                                                                @PathVariable("chatId") Long chatId) {
        try {
            User user = userService.getUserByToken(jwt);
            List<Message> messages = service.getAllMessagesByChatId(chatId, user);
            List<MessageInfoResponse> responseList = MessageInfoResponse.bulkConvertMessageToMessageInfoResponse(messages);
            return new ResponseEntity<>(responseList, HttpStatus.OK);
        } catch (ChatException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/create/{chatId}")
    public ResponseEntity<MessageInfoResponse> createMessage(@PathVariable("chatId") Long chatId,
                                                 @RequestBody String content,
                                                 @RequestHeader(JWT_HEADER) String jwt) {
        try {
            User user = userService.getUserByToken(jwt);
            Chat chat = chatService.getChatById(chatId);
            Message message = service.createMessage(user, content, chat);
            MessageInfoResponse response = MessageInfoResponse.
                    bulkConvertMessageToMessageInfoResponse(Collections.singletonList(message)).get(0);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (ChatException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/update/{messageId}")
    public ResponseEntity<ApiResponse> editMessage(@RequestHeader(JWT_HEADER) String jwt,
                                                   @RequestBody String content,
                                                   @PathVariable("messageId") Long messageId) {
        try{
            User user = userService.getUserByToken(jwt);
            service.updateMessageContent(user, messageId, content);
            return new ResponseEntity<>(new ApiResponse("Message updated successfully"), HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage()),HttpStatus.UNAUTHORIZED);
        } catch (MessageException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage()),HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessage(@RequestHeader(JWT_HEADER) String jwt,
                                                     @PathVariable("messageId") Long messageId) {
        try {
            User user = userService.getUserByToken(jwt);
            service.deleteMessageById(messageId, user);
            return new ResponseEntity<>(new ApiResponse("Message deleted successfully"), HttpStatus.OK);
        } catch (MessageException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage()), HttpStatus.NOT_FOUND);
        } catch (UserException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage()), HttpStatus.UNAUTHORIZED);
        }
    }
}
