package com.vibeseekers.repository;

import com.vibeseekers.entity.Payment;
import com.vibeseekers.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByUpiTransactionId(String upiTransactionId);
    long countByPaymentStatus(PaymentStatus status);
    Page<Payment> findByPaymentStatus(PaymentStatus status, Pageable pageable);
}
