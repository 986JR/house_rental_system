package com.collincorp.houserental.repository;

import com.collincorp.houserental.entity.FavoriteEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {

    @Query(
            """
            select f from FavoriteEntity f
            join fetch f.property p
            join fetch p.landlord
            left join fetch p.images
            where f.user.id = :userId
            order by f.createdAt desc
            """)
    List<FavoriteEntity> findByUserId(@Param("userId") Long userId);

    Optional<FavoriteEntity> findByUser_IdAndProperty_Id(Long userId, Long propertyId);

    void deleteByUser_IdAndProperty_Id(Long userId, Long propertyId);
}
