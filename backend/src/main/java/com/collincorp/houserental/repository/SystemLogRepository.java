package com.collincorp.houserental.repository;

import com.collincorp.houserental.entity.SystemLogEntity;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SystemLogRepository extends JpaRepository<SystemLogEntity, Long> {

    @Query("SELECT l FROM SystemLogEntity l ORDER BY l.createdAt DESC")
    List<SystemLogEntity> findAllOrderByCreatedAtDesc();

    @Query("SELECT l FROM SystemLogEntity l WHERE l.createdAt >= :since ORDER BY l.createdAt DESC")
    List<SystemLogEntity> findRecentLogs(@Param("since") Instant since);

    @Query("SELECT COUNT(l) FROM SystemLogEntity l WHERE l.action = :action")
    long countByAction(@Param("action") String action);
}
