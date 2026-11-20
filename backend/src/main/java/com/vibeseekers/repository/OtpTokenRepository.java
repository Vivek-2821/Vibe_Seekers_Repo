package com.vibeseekers.repository;

import com.vibeseekers.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByEmailAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(String email, String purpose);
    Optional<OtpToken> findTopByEmailOrderByCreatedAtDesc(String email);
    void deleteByEmail(String email);
}
