package com.vibeseekers.service;

import com.vibeseekers.dto.product.*;
import com.vibeseekers.entity.*;
import com.vibeseekers.exception.BadRequestException;
import com.vibeseekers.exception.ResourceNotFoundException;
import com.vibeseekers.repository.ProductImageRepository;
import com.vibeseekers.repository.ProductRepository;
import com.vibeseekers.repository.ProductSizeStockRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductSizeStockRepository sizeStockRepository;
    private final MediaStorageService mediaStorageService;

    public ProductService(ProductRepository productRepository,
                          ProductImageRepository productImageRepository,
                          ProductSizeStockRepository sizeStockRepository,
                          MediaStorageService mediaStorageService) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.sizeStockRepository = sizeStockRepository;
        this.mediaStorageService = mediaStorageService;
    }

    public Page<ProductResponseDto> getPublicProducts(ProductCategory category,
                                                      BigDecimal minPrice,
                                                      BigDecimal maxPrice,
                                                      String size,
                                                      String color,
                                                      Boolean bestSellerOnly,
                                                      Boolean newArrivalOnly,
                                                      String keyword,
                                                      String sortBy,
                                                      int page,
                                                      int pageSize) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if ("popular".equalsIgnoreCase(sortBy) || "popularity".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "isBestSeller").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, pageSize, sort);
        Page<Product> products = productRepository.findWithFilters(
                true, category, minPrice, maxPrice, size, color, bestSellerOnly, newArrivalOnly, keyword, pageable
        );
        return products.map(this::mapToResponseDto);
    }

    public List<ProductResponseDto> getNewArrivals() {
        return productRepository.findByIsActiveTrueAndIsNewArrivalTrue().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<ProductResponseDto> getBestSellers() {
        return productRepository.findByIsActiveTrueAndIsBestSellerTrue().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<ProductResponseDto> getByCategory(ProductCategory category) {
        return productRepository.findByIsActiveTrueAndCategory(category).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ProductResponseDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapToResponseDto(product);
    }

    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponseDto(product);
    }

    public List<ProductResponseDto> getAllProductsAdmin() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto request, List<MultipartFile> imageFiles) {
        Product product = new Product();
        product.setName(request.getName().trim());
        product.setSlug(generateUniqueSlug(request.getName()));
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setMrp(request.getMrp());
        if (request.getMrp() != null && request.getPrice() != null && request.getMrp().compareTo(request.getPrice()) > 0) {
            BigDecimal diff = request.getMrp().subtract(request.getPrice());
            int disc = diff.multiply(BigDecimal.valueOf(100)).divide(request.getMrp(), 0, RoundingMode.HALF_UP).intValue();
            product.setDiscountPercent(disc);
        } else if (request.getDiscountPercent() != null && request.getDiscountPercent() > 0) {
            product.setDiscountPercent(request.getDiscountPercent());
        } else {
            product.setDiscountPercent(0);
        }
        product.setDescription(request.getDescription());
        product.setFabricDetails(request.getFabricDetails());
        product.setNewArrival(request.isNewArrival());
        product.setBestSeller(request.isBestSeller());
        product.setColors(request.getColors());
        product.setGsm(request.getGsm());
        product.setWashingInstructions(request.getWashingInstructions());
        product.setCollectionName(request.getCollectionName());
        product.setActive(request.isActive());

        Product savedProduct = productRepository.save(product);

        // Save size stocks
        saveSizeStocks(savedProduct, request.getSizeStocks());

        // Save pre-provided image URLs if present
        if (request.getExistingImages() != null && !request.getExistingImages().isEmpty()) {
            for (int i = 0; i < request.getExistingImages().size(); i++) {
                ProductImageDto imgDto = request.getExistingImages().get(i);
                String imgUrl = imgDto.getImageUrl() != null && !imgDto.getImageUrl().trim().isEmpty()
                        ? imgDto.getImageUrl().trim()
                        : (imgDto.getUrl() != null ? imgDto.getUrl().trim() : null);
                if (imgUrl != null && !imgUrl.isEmpty()) {
                    ProductImage pImg = new ProductImage(
                            savedProduct,
                            imgUrl,
                            imgDto.getPublicId(),
                            imgDto.isPrimary() || i == 0,
                            i
                    );
                    productImageRepository.save(pImg);
                }
            }
        }

        // Process uploaded images
        processUploadedImages(savedProduct, imageFiles);

        return mapToResponseDto(productRepository.findById(savedProduct.getId()).get());
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto request, List<MultipartFile> newImageFiles) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(request.getName().trim());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setMrp(request.getMrp());
        if (request.getMrp() != null && request.getPrice() != null && request.getMrp().compareTo(request.getPrice()) > 0) {
            BigDecimal diff = request.getMrp().subtract(request.getPrice());
            int disc = diff.multiply(BigDecimal.valueOf(100)).divide(request.getMrp(), 0, RoundingMode.HALF_UP).intValue();
            product.setDiscountPercent(disc);
        } else if (request.getDiscountPercent() != null && request.getDiscountPercent() > 0) {
            product.setDiscountPercent(request.getDiscountPercent());
        } else {
            product.setDiscountPercent(0);
        }
        product.setDescription(request.getDescription());
        product.setFabricDetails(request.getFabricDetails());
        product.setNewArrival(request.isNewArrival());
        product.setBestSeller(request.isBestSeller());
        product.setColors(request.getColors());
        product.setGsm(request.getGsm());
        product.setWashingInstructions(request.getWashingInstructions());
        product.setCollectionName(request.getCollectionName());
        product.setActive(request.isActive());

        // Update size stocks
        sizeStockRepository.deleteByProductId(product.getId());
        saveSizeStocks(product, request.getSizeStocks());

        // Manage existing images
        if (request.getExistingImages() != null) {
            Set<Long> keepImageIds = request.getExistingImages().stream()
                    .map(ProductImageDto::getId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            List<ProductImage> currentImages = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
            for (ProductImage img : currentImages) {
                if (!keepImageIds.contains(img.getId())) {
                    mediaStorageService.deleteFile(img.getPublicId());
                    productImageRepository.delete(img);
                } else {
                    // Update primary flag if altered
                    request.getExistingImages().stream()
                            .filter(dto -> dto.getId().equals(img.getId()))
                            .findFirst()
                            .ifPresent(dto -> {
                                img.setPrimary(dto.isPrimary());
                                img.setDisplayOrder(dto.getDisplayOrder());
                                productImageRepository.save(img);
                            });
                }
            }
        }

        // Add any new uploaded images
        processUploadedImages(product, newImageFiles);

        Product updatedProduct = productRepository.save(product);
        return mapToResponseDto(productRepository.findById(updatedProduct.getId()).get());
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Delete cloud images
        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
        for (ProductImage img : images) {
            mediaStorageService.deleteFile(img.getPublicId());
        }

        productRepository.delete(product);
    }

    private void saveSizeStocks(Product product, List<SizeStockDto> sizeDtos) {
        List<String> standardSizes = List.of("S", "M", "L", "XL", "XXL");
        Map<String, Integer> sizeMap = new HashMap<>();

        if (sizeDtos != null) {
            for (SizeStockDto dto : sizeDtos) {
                if (dto.getSize() != null) {
                    sizeMap.put(dto.getSize().toUpperCase(), dto.getStock() != null ? dto.getStock() : 0);
                }
            }
        }

        for (String size : standardSizes) {
            int stock = sizeMap.getOrDefault(size, 0);
            ProductSizeStock pss = new ProductSizeStock(product, size, stock);
            sizeStockRepository.save(pss);
        }
    }

    private void processUploadedImages(Product product, List<MultipartFile> imageFiles) {
        if (imageFiles == null || imageFiles.isEmpty()) return;

        List<ProductImage> existing = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
        int startOrder = existing.size();
        boolean hasPrimary = existing.stream().anyMatch(ProductImage::isPrimary);

        for (int i = 0; i < imageFiles.size(); i++) {
            MultipartFile file = imageFiles.get(i);
            if (file.isEmpty()) continue;

            MediaStorageService.UploadResult result = mediaStorageService.storeFile(file, "products");
            boolean isPrimary = !hasPrimary && (i == 0);
            if (isPrimary) hasPrimary = true;

            ProductImage pImg = new ProductImage(
                    product,
                    result.getUrl(),
                    result.getPublicId(),
                    isPrimary,
                    startOrder + i
            );
            productImageRepository.save(pImg);
        }
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (baseSlug.isEmpty()) baseSlug = "product";

        String slug = baseSlug;
        int count = 1;
        while (productRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + count++;
        }
        return slug;
    }

    public ProductResponseDto mapToResponseDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setCategory(product.getCategory());
        dto.setPrice(product.getPrice());
        dto.setMrp(product.getMrp());
        if (product.getDiscountPercent() != null && product.getDiscountPercent() > 0) {
            dto.setDiscountPercent(product.getDiscountPercent());
        } else if (product.getMrp() != null && product.getPrice() != null && product.getMrp().compareTo(product.getPrice()) > 0) {
            BigDecimal diff = product.getMrp().subtract(product.getPrice());
            int disc = diff.multiply(BigDecimal.valueOf(100)).divide(product.getMrp(), 0, RoundingMode.HALF_UP).intValue();
            dto.setDiscountPercent(disc);
        } else {
            dto.setDiscountPercent(0);
        }
        dto.setDescription(product.getDescription());
        dto.setFabricDetails(product.getFabricDetails());
        dto.setNewArrival(product.isNewArrival());
        dto.setBestSeller(product.isBestSeller());
        dto.setColors(product.getColors());
        dto.setGsm(product.getGsm());
        dto.setWashingInstructions(product.getWashingInstructions());
        dto.setCollectionName(product.getCollectionName());
        dto.setActive(product.isActive());
        dto.setCreatedAt(product.getCreatedAt());

        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
        List<ProductImageDto> imageDtos = images.stream()
                .map(img -> new ProductImageDto(img.getId(), img.getImageUrl(), img.getPublicId(), img.isPrimary(), img.getDisplayOrder()))
                .collect(Collectors.toList());
        dto.setImages(imageDtos);

        String primaryUrl = images.stream()
                .filter(ProductImage::isPrimary)
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(images.isEmpty() ? null : images.get(0).getImageUrl());
        dto.setPrimaryImageUrl(primaryUrl);

        List<ProductSizeStock> stocks = sizeStockRepository.findByProductId(product.getId());
        List<SizeStockDto> sizeDtos = stocks.stream()
                .map(s -> new SizeStockDto(s.getSize(), s.getStock()))
                .collect(Collectors.toList());
        dto.setSizeStocks(sizeDtos);

        int total = stocks.stream().mapToInt(ProductSizeStock::getStock).sum();
        dto.setTotalStock(total);

        return dto;
    }
}
