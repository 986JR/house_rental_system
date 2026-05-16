package com.collincorp.houserental.api.v1;

import com.collincorp.houserental.dto.MessageCreateRequest;
import com.collincorp.houserental.dto.MessageResponse;
import com.collincorp.houserental.service.MessageService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<MessageResponse> list() {
        return messageService.list();
    }

    @PostMapping
    public MessageResponse send(@Valid @RequestBody MessageCreateRequest request) {
        return messageService.send(request);
    }
}
