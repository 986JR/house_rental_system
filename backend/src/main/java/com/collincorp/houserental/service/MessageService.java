package com.collincorp.houserental.service;

import com.collincorp.houserental.api.ApiException;
import com.collincorp.houserental.dto.MessageCreateRequest;
import com.collincorp.houserental.dto.MessageResponse;
import com.collincorp.houserental.entity.MessageEntity;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.repository.MessageRepository;
import com.collincorp.houserental.repository.UserRepository;
import com.collincorp.houserental.support.SecurityUtils;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> list() {
        UserEntity u = SecurityUtils.currentUser();
        return messageRepository.findForUser(u.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional
    public MessageResponse send(MessageCreateRequest req) {
        UserEntity sender = SecurityUtils.currentUser();
        UserEntity recipient = userRepository
                .findById(req.recipientId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "recipient_not_found"));
        if (recipient.getId().equals(sender.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "cannot_message_self");
        }
        MessageEntity m = new MessageEntity();
        m.setSender(sender);
        m.setRecipient(recipient);
        m.setBody(req.body());
        return toResponse(messageRepository.save(m));
    }

    private MessageResponse toResponse(MessageEntity m) {
        return new MessageResponse(
                m.getId(), m.getSender().getId(), m.getRecipient().getId(), m.getBody(), m.getCreatedAt());
    }
}
