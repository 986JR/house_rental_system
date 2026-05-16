package com.collincorp.houserental.api.v1;

import com.collincorp.houserental.dto.BookingCreateRequest;
import com.collincorp.houserental.dto.BookingResponse;
import com.collincorp.houserental.dto.BookingUpdateRequest;
import com.collincorp.houserental.service.BookingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponse> list() {
        return bookingService.listMine();
    }

    @PostMapping
    public BookingResponse create(@Valid @RequestBody BookingCreateRequest request) {
        return bookingService.create(request);
    }

    @PutMapping("/{id}")
    public BookingResponse update(@PathVariable long id, @Valid @RequestBody BookingUpdateRequest request) {
        return bookingService.update(id, request);
    }
}
