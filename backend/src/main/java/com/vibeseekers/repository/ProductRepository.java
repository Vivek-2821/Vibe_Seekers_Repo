package com.vibeseekers.repository;

import com.vibeseekers.entity.Product;
import com.vibeseekers.entity.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    @Query("SELECT p FROM Product p WHERE p.isActive = true OR p.isActive IS NULL")
    List<Product> findByIsActiveTrue();

    @Query("SELECT p FROM Product p WHERE (p.isActive = true OR p.isActive IS NULL) AND p.isNewArrival = true")
    List<Product> findByIsActiveTrueAndIsNewArrivalTrue();

    @Query("SELECT p FROM Product p WHERE (p.isActive = true OR p.isActive IS NULL) AND p.isBestSeller = true")
    List<Product> findByIsActiveTrueAndIsBestSellerTrue();

    @Query("SELECT p FROM Product p WHERE (p.isActive = true OR p.isActive IS NULL) AND p.category = :category")
    List<Product> findByIsActiveTrueAndCategory(@Param("category") ProductCategory category);

    @Query("SELECT DISTINCT p FROM Product p " +
           "LEFT JOIN p.sizeStocks s " +
           "WHERE (:activeOnly = false OR p.isActive = true OR p.isActive IS NULL) " +
           "AND (:category IS NULL OR p.category = :category) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:size IS NULL OR (s.size = :size AND s.stock > 0)) " +
           "AND (:color IS NULL OR LOWER(p.colors) LIKE LOWER(CONCAT('%', :color, '%'))) " +
           "AND (:bestSellerOnly IS NULL OR :bestSellerOnly = false OR p.isBestSeller = true) " +
           "AND (:newArrivalOnly IS NULL OR :newArrivalOnly = false OR p.isNewArrival = true) " +
           "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.colors) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.fabricDetails) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.collectionName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.gsm) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> findWithFilters(@Param("activeOnly") boolean activeOnly,
                                  @Param("category") ProductCategory category,
                                  @Param("minPrice") BigDecimal minPrice,
                                  @Param("maxPrice") BigDecimal maxPrice,
                                  @Param("size") String size,
                                  @Param("color") String color,
                                  @Param("bestSellerOnly") Boolean bestSellerOnly,
                                  @Param("newArrivalOnly") Boolean newArrivalOnly,
                                  @Param("keyword") String keyword,
                                  Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.sizeStocks s WHERE s.stock <= :threshold AND (p.isActive = true OR p.isActive IS NULL) GROUP BY p")
    List<Product> findLowStockProducts(@Param("threshold") int threshold);

    @Modifying
    @Transactional
    @Query(value = "UPDATE products SET is_active = TRUE WHERE is_active IS NULL", nativeQuery = true)
    int updateNullIsActiveToTrue();
}
