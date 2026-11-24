package com.vibeseekers.repository;

import com.vibeseekers.entity.Order;
import com.vibeseekers.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "payment", "user"})
    Optional<Order> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = {"items", "payment", "user"})
    Optional<Order> findByShiprocketAwb(String shiprocketAwb);

    @EntityGraph(attributePaths = {"items", "payment", "user"})
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Order> findByOrderStatus(OrderStatus orderStatus, Pageable pageable);

    @Query(value = "SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.payment LEFT JOIN FETCH o.user WHERE (:status IS NULL OR o.orderStatus = :status) ORDER BY o.createdAt DESC",
           countQuery = "SELECT COUNT(o) FROM Order o WHERE (:status IS NULL OR o.orderStatus = :status)")
    Page<Order> findAllWithFilter(OrderStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "payment", "user"})
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdEager(Long id);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus NOT IN ('CANCELLED', 'PENDING_PAYMENT')")
    BigDecimal calculateTotalRevenue();

    long countByOrderStatus(OrderStatus status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shiprocketAwb IS NOT NULL AND o.orderStatus = 'SHIPPED'")
    long countActiveShipments();
}
