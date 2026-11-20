package com.vibeseekers.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibeseekers.dto.common.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 20;
    private static final long TIME_WINDOW_MS = 60000; // 1 minute

    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static class RequestCounter {
        private int count = 0;
        private long startTime = System.currentTimeMillis();

        synchronized boolean allowRequest(int maxRequests, long timeWindowMs) {
            long now = System.currentTimeMillis();
            if (now - startTime > timeWindowMs) {
                startTime = now;
                count = 1;
                return true;
            }
            if (count < maxRequests) {
                count++;
                return true;
            }
            return false;
        }
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Apply rate limiting specifically on sensitive auth endpoints: login, signup, otp
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/otp") || path.startsWith("/api/auth/forgot-password")) {
            String clientIp = getClientIp(request);
            String key = clientIp + ":" + path;

            RequestCounter counter = requestCounts.computeIfAbsent(key, k -> new RequestCounter());

            if (!counter.allowRequest(MAX_REQUESTS_PER_MINUTE, TIME_WINDOW_MS)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                ErrorResponse errorResponse = new ErrorResponse(
                        HttpStatus.TOO_MANY_REQUESTS.value(),
                        "Too Many Requests",
                        "Rate limit exceeded. Please wait a minute before retrying."
                );
                response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
