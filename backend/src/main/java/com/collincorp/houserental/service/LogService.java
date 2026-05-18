package com.collincorp.houserental.service;

import com.collincorp.houserental.domain.LogAction;
import com.collincorp.houserental.entity.SystemLogEntity;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.repository.SystemLogRepository;
import com.collincorp.houserental.support.SecurityUtils;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LogService {

    private final SystemLogRepository systemLogRepository;

    public LogService(SystemLogRepository systemLogRepository) {
        this.systemLogRepository = systemLogRepository;
    }

    @Transactional
    public void log(LogAction action, String entityType, Long entityId, String details) {
        UserEntity user = SecurityUtils.currentUser();
        SystemLogEntity log = new SystemLogEntity();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setUserId(user.getId());
        log.setUserEmail(user.getEmail());
        log.setDetails(details);
        systemLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<SystemLogEntity> getAllLogs() {
        return systemLogRepository.findAllOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<SystemLogEntity> getRecentLogs(int days) {
        Instant since = Instant.now().minusSeconds(days * 24L * 60 * 60);
        return systemLogRepository.findRecentLogs(since);
    }
}
