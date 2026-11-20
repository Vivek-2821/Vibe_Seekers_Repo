package com.vibeseekers.repository;

import com.vibeseekers.entity.Order;
import com.vibeseekers.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Optional<Order> findByShiprocketAwb(String shiprocketAwb);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Order> findByOrderStatus(OrderStatus orderStatus, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE (:status IS NULL OR o.orderStatus = :status) ORDER BY o.createdAt DESC")
    Page<Order> findAllWithFilter(OrderStatus status, Pageable pageable);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus NOT IN ('CANCELLED', 'PENDING_PAYMENT')")
    BigDecimal calculateTotalRevenue();

    long countByOrderStatus(OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shiprocketAwb IS NOT NULL AND o.orderStatus = 'SHIPPED'")
    long countActiveShipments();
}
