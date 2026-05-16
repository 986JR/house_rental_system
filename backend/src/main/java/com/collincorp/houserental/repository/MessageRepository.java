package com.collincorp.houserental.repository;

import com.collincorp.houserental.entity.MessageEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    @Query(
            """
            select m from MessageEntity m
            join fetch m.sender
            join fetch m.recipient
            where m.sender.id = :userId or m.recipient.id = :userId
            order by m.createdAt desc
            """)
    List<MessageEntity> findForUser(@Param("userId") Long userId);
}
