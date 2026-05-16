package com.collincorp.houserental.support;

import com.collincorp.houserental.api.ApiException;
import com.collincorp.houserental.entity.UserEntity;
import com.collincorp.houserental.security.AppUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static UserEntity currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AppUserDetails details)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "not_authenticated");
        }
        return details.getUser();
    }
}
