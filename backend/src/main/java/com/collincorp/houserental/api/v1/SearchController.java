package com.collincorp.houserental.api.v1;

import com.collincorp.houserental.domain.PropertyAvailability;
import com.collincorp.houserental.dto.PagedResponse;
import com.collincorp.houserental.dto.PropertyResponse;
import com.collincorp.houserental.service.PropertyService;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final PropertyService propertyService;

    public SearchController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping
    public PagedResponse<PropertyResponse> search(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) Integer rooms,
            @RequestParam(required = false) PropertyAvailability availability,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<PropertyResponse> result = propertyService.search(location, price, rooms, availability, pageable);
        return new PagedResponse<>(
                result.getContent(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.getNumber(),
                result.getSize());
    }
}
