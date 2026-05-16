package com.collincorp.houserental.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Serves {@code index.html} for client-side routes (React Router) while leaving API and file URLs untouched.
 */
@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class SpaWebFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (!"GET".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        String path = request.getRequestURI();
        String context = request.getContextPath();
        if (context != null && !context.isEmpty() && path.startsWith(context)) {
            path = path.substring(context.length());
        }
        if (path.startsWith("/api") || path.startsWith("/uploads")) {
            filterChain.doFilter(request, response);
            return;
        }
        if (looksLikeStaticAsset(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        String accept = request.getHeader("Accept");
        if (accept != null && accept.contains(MediaType.TEXT_HTML_VALUE)) {
            request.getRequestDispatcher("/index.html").forward(request, response);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private static boolean looksLikeStaticAsset(String path) {
        int slash = path.lastIndexOf('/');
        String name = slash >= 0 ? path.substring(slash + 1) : path;
        if (!StringUtils.hasText(name)) {
            return false;
        }
        int dot = name.lastIndexOf('.');
        return dot > 0 && dot < name.length() - 1;
    }
}
