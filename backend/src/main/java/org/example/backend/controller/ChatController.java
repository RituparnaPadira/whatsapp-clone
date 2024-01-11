package org.example.backend.controller;

import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.example.backend.constants.ChatType;
import org.example.backend.constants.GroupMemberType;
import org.example.backend.constants.OperationType;
import org.example.backend.exception.ChatException;
import org.example.backend.exception.UnknownTypeException;
import org.example.backend.exception.UserException;
import org.example.backend.model.chat.Chat;
import org.example.backend.model.chat.GroupChat;
import org.example.backend.model.user.User;
import org.example.backend.request.CreateChatRequest;
import org.example.backend.request.GroupChatUpdateRequest;
import org.example.backend.response.ApiResponse;
import org.example.backend.response.ChatInfoResponse;
import org.example.backend.service.chat.ChatService;
import org.example.backend.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.example.backend.constants.JwtConstants.JWT_HEADER;

@RestController
@AllArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    UserService userService;
    ChatService chatService;

    @PostMapping("/create")
    public ResponseEntity<Chat> createChat(@RequestHeader(JWT_HEADER) String jwt,
                                           @RequestBody CreateChatRequest request) {
        try {
            User user = userService.getUserByToken(jwt);
            Chat chat = chatService.createChat(request.getType(), user, request.getMemberIds(), request.getGroupName(), request.getGroupImage());
            return new ResponseEntity<>(chat, HttpStatus.OK);
        }catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (UnknownTypeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get/{chatId}")
    public ResponseEntity<Chat> getChatById(@PathVariable("chatId") Long chatId,
                                            @RequestHeader(JWT_HEADER) String jwt) {
        try {
            User user = userService.getUserByToken(jwt);
            Chat chat = chatService.getChatById(chatId, user);
            return new ResponseEntity<>(chat, HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (ChatException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/get-all/user")
    public ResponseEntity<List<ChatInfoResponse>> getAllChatsInfoByUser(@RequestHeader(JWT_HEADER) String jwt) {
        try {
            User user = userService.getUserByToken(jwt);
            List<Chat> chats =  chatService.getAllChatsByUser(user);
            List<ChatInfoResponse> responseList = ChatInfoResponse.bulkConvertChatToChatInfo(chats, user);
            System.out.println("response list"+responseList);
            return new ResponseEntity<>(responseList, HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/update-group")
    public ResponseEntity<GroupChat> updateChat(@RequestHeader(JWT_HEADER) String jwt,
                                           @RequestBody @NonNull GroupChatUpdateRequest request) {
        try {
            User user = userService.getUserByToken(jwt);
            GroupChat chat = chatService.updateGroupChat(user, request.getId(),
                    request.getGroupName(), request.getGroupImage(), request.getDescription());
            return new ResponseEntity<>(chat, HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (ChatException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/update-group/users")
    public ResponseEntity<GroupChat> updateGroupMembersList(@RequestHeader(JWT_HEADER) String jwt,
                                                            @RequestBody Long updateUserId,
                                                            @RequestBody Long chatId,
                                                            @RequestBody OperationType type,
                                                            @RequestBody GroupMemberType memberType) {

        User updateUser;
        try {
            updateUser = userService.getUserById(updateUserId);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        try {
            User user = userService.getUserByToken(jwt);
            GroupChat groupChat = chatService.updateMembers(user, updateUser, chatId, type, memberType);
            return new ResponseEntity<>(groupChat, HttpStatus.OK);
        } catch (UnknownTypeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (UserException e) {
            return  new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (ChatException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/get-or-create/{userId}")
    public ResponseEntity<ChatInfoResponse> getOrCreateDirectChatByUserId(@RequestHeader(JWT_HEADER) String jwt,
                                                                    @PathVariable("userId") Long userId) {
        User requestedBy, user2;
        try {
            requestedBy = userService.getUserByToken(jwt);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try {
            user2 = userService.getUserById(userId);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Chat chat = chatService.getDirectChatByUser(requestedBy, user2);
        if(chat==null) {
            try {
                Chat newChat =  chatService.createChat(ChatType.DIRECT_CHAT, requestedBy, Collections.singletonList(user2.getId()), null, null);
                ChatInfoResponse res = ChatInfoResponse
                        .bulkConvertChatToChatInfo(Collections.singletonList(newChat), requestedBy).get(0);
                return new ResponseEntity<>(res, HttpStatus.CREATED);
            } catch (Exception e) {
                System.out.println(e);
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        ChatInfoResponse res = ChatInfoResponse
                .bulkConvertChatToChatInfo(Collections.singletonList(chat), requestedBy).get(0);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<ApiResponse> deleteChatById(@RequestHeader(JWT_HEADER) String jwt,
                                                      @PathVariable("chatId") Long chatId) {
        try {
            User user = userService.getUserByToken(jwt);
            chatService.deleteChat(chatId, user);
            return new ResponseEntity<>(new ApiResponse("Successfully deleted chat"), HttpStatus.OK);
        } catch (UserException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } catch (ChatException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
