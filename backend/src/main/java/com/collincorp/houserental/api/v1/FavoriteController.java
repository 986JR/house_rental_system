package com.collincorp.houserental.api.v1;

import com.collincorp.houserental.dto.FavoriteRequest;
import com.collincorp.houserental.dto.PropertyResponse;
import com.collincorp.houserental.service.FavoriteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public List<PropertyResponse> list() {
        return favoriteService.list();
    }

    @PostMapping
    public void add(@Valid @RequestBody FavoriteRequest request) {
        favoriteService.add(request);
    }

    @DeleteMapping("/{propertyId}")
    public void remove(@PathVariable long propertyId) {
        favoriteService.remove(propertyId);
    }
}
