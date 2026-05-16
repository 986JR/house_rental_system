package com.collincorp.houserental.repository;

import com.collincorp.houserental.entity.BookingEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

    @Query(
            """
            select b from BookingEntity b
            join fetch b.property p
            join fetch p.landlord
            join fetch b.tenant
            where b.tenant.id = :userId or p.landlord.id = :userId
            order by b.createdAt desc
            """)
    List<BookingEntity> findAllForUser(@Param("userId") Long userId);
}
