package com.collincorp.houserental.repository;

import com.collincorp.houserental.entity.PropertyImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImageEntity, Long> {
}
