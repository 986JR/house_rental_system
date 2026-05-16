package com.collincorp.houserental.entity;

import com.collincorp.houserental.domain.PropertyAvailability;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
public class PropertyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "landlord_id", nullable = false)
    private UserEntity landlord;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false, length = 512)
    private String location;

    @Column(name = "price_per_month", nullable = false, precision = 12, scale = 2)
    private BigDecimal pricePerMonth;

    @Column(nullable = false)
    private int rooms;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private PropertyAvailability availability = PropertyAvailability.available;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PropertyImageEntity> images = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public UserEntity getLandlord() {
        return landlord;
    }

    public void setLandlord(UserEntity landlord) {
        this.landlord = landlord;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getPricePerMonth() {
        return pricePerMonth;
    }

    public void setPricePerMonth(BigDecimal pricePerMonth) {
        this.pricePerMonth = pricePerMonth;
    }

    public int getRooms() {
        return rooms;
    }

    public void setRooms(int rooms) {
        this.rooms = rooms;
    }

    public PropertyAvailability getAvailability() {
        return availability;
    }

    public void setAvailability(PropertyAvailability availability) {
        this.availability = availability;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<PropertyImageEntity> getImages() {
        return images;
    }

    public void addImage(PropertyImageEntity image) {
        images.add(image);
        image.setProperty(this);
    }
}
