package org.example.backend.controller;

import org.example.backend.model.message.Message;
import org.example.backend.response.MessageInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketMessagingController {

    @Autowired
    SimpMessagingTemplate template;

    // mapped as /app/message
    @MessageMapping("/message")
    public MessageInfoResponse sendMessage(MessageInfoResponse message) {
        template.convertAndSend("/group/"+message.getChatId(),message);
        return message;
    }
}
