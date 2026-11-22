package com.vibeseekers.service;

import com.vibeseekers.dto.product.ProductResponseDto;
import com.vibeseekers.entity.Product;
import com.vibeseekers.entity.User;
import com.vibeseekers.entity.WishlistItem;
import com.vibeseekers.exception.ResourceNotFoundException;
import com.vibeseekers.repository.ProductRepository;
import com.vibeseekers.repository.UserRepository;
import com.vibeseekers.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public WishlistService(WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           ProductService productService) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    public List<ProductResponseDto> getWishlist(Long userId) {
        List<WishlistItem> items = wishlistItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return items.stream()
                .map(item -> productService.mapToResponseDto(item.getProduct()))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (wishlistItemRepository.existsByUserIdAndProductId(userId, productId)) {
            wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
            return false; // Removed
        } else {
            WishlistItem item = new WishlistItem(user, product);
            wishlistItemRepository.save(item);
            return true; // Added
        }
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistItemRepository.existsByUserIdAndProductId(userId, productId);
    }
}
