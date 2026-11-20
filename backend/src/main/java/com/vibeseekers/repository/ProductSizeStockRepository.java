package com.vibeseekers.repository;

import com.vibeseekers.entity.ProductSizeStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductSizeStockRepository extends JpaRepository<ProductSizeStock, Long> {
    List<ProductSizeStock> findByProductId(Long productId);
    Optional<ProductSizeStock> findByProductIdAndSize(Long productId, String size);
    void deleteByProductId(Long productId);
}
