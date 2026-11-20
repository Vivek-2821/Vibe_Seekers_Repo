package com.vibeseekers.service;

import com.vibeseekers.dto.order.*;
import com.vibeseekers.entity.*;
import com.vibeseekers.exception.BadRequestException;
import com.vibeseekers.exception.ResourceNotFoundException;
import com.vibeseekers.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final ProductRepository productRepository;
    private final ProductSizeStockRepository sizeStockRepository;
    private final StoreSettingService storeSettingService;
    private final MediaStorageService mediaStorageService;
    private final MailService mailService;
    private final ShiprocketService shiprocketService;

    private static final AtomicInteger orderCounter = new AtomicInteger(1001);

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        PaymentRepository paymentRepository,
                        ProductRepository productRepository,
                        ProductSizeStockRepository sizeStockRepository,
                        StoreSettingService storeSettingService,
                        MediaStorageService mediaStorageService,
                        MailService mailService,
                        ShiprocketService shiprocketService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
        this.sizeStockRepository = sizeStockRepository;
        this.storeSettingService = storeSettingService;
        this.mediaStorageService = mediaStorageService;
        this.mailService = mailService;
        this.shiprocketService = shiprocketService;
    }

    @Transactional
    public OrderResponseDto createOrder(User user, CreateOrderRequest request, MultipartFile screenshotFile) {
        // Enforce Prepaid policy if COD is disabled
        if (request.getPaymentMethod() == PaymentMethod.COD) {
            if (!storeSettingService.isCodEnabled()) {
                throw new BadRequestException("Cash on Delivery is currently unavailable — Prepaid orders only.");
            }
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setCustomerNotes(request.getCustomerNotes());
        order.setOrderStatus(OrderStatus.PENDING_PAYMENT);

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequestDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDto.getProductId()));

            if (!product.isActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is currently unavailable.");
            }

            // Size stock verification
            ProductSizeStock sizeStock = sizeStockRepository.findByProductIdAndSize(product.getId(), itemDto.getSize().toUpperCase())
                    .orElseThrow(() -> new BadRequestException("Size " + itemDto.getSize() + " is not available for " + product.getName()));

            if (sizeStock.getStock() < itemDto.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + product.getName() + " in size " + itemDto.getSize() + ". Available: " + sizeStock.getStock());
            }

            // Decrement stock
            sizeStock.setStock(sizeStock.getStock() - itemDto.getQuantity());
            sizeStockRepository.save(sizeStock);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getName(),
                    itemDto.getSize().toUpperCase(),
                    itemDto.getQuantity(),
                    product.getPrice(),
                    lineTotal,
                    product.getPrimaryImageUrl()
            );
            items.add(orderItem);
        }

        order.setSubtotal(subtotal);
        // Free shipping on prepaid streetwear orders!
        BigDecimal shippingCharge = BigDecimal.ZERO;
        order.setShippingCharge(shippingCharge);
        order.setTotalAmount(subtotal.add(shippingCharge));

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : items) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }
        savedOrder.setItems(items);

        // Create Payment record
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(savedOrder.getTotalAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPayeeUpiId(storeSettingService.getSetting("upiId", "9860498749-2@ybl"));
        payment.setPayeeName(storeSettingService.getSetting("upiPayeeName", "Vivek Ashok Matne"));

        if (request.getUpiTransactionId() != null && !request.getUpiTransactionId().trim().isEmpty()) {
            payment.setUpiTransactionId(request.getUpiTransactionId().trim());
        }

        if (screenshotFile != null && !screenshotFile.isEmpty()) {
            MediaStorageService.UploadResult uploadResult = mediaStorageService.storeFile(screenshotFile, "payments");
            payment.setScreenshotUrl(uploadResult.getUrl());
        }

        paymentRepository.save(payment);
        savedOrder.setPayment(payment);

        // Send order confirmation email
        mailService.sendOrderConfirmationEmail(savedOrder);

        return mapToResponseDto(savedOrder);
    }

    @Transactional
    public OrderResponseDto submitPaymentProof(String orderNumber, PaymentProofRequest request, MultipartFile screenshotFile) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with order number: " + orderNumber));

        Payment payment = order.getPayment();
        if (payment == null) {
            payment = new Payment();
            payment.setOrder(order);
            payment.setAmount(order.getTotalAmount());
            payment.setPaymentMethod(PaymentMethod.UPI_MANUAL);
        }

        payment.setUpiTransactionId(request.getUpiTransactionId().trim());
        payment.setPaymentStatus(PaymentStatus.PENDING_VERIFICATION);

        if (screenshotFile != null && !screenshotFile.isEmpty()) {
            MediaStorageService.UploadResult uploadResult = mediaStorageService.storeFile(screenshotFile, "payments");
            payment.setScreenshotUrl(uploadResult.getUrl());
        } else if (request.getScreenshotUrl() != null && !request.getScreenshotUrl().isEmpty()) {
            payment.setScreenshotUrl(request.getScreenshotUrl());
        }

        paymentRepository.save(payment);
        order.setPayment(payment);

        return mapToResponseDto(order);
    }

    @Transactional
    public OrderResponseDto verifyPaymentByAdmin(Long orderId, PaymentVerificationRequest request, String adminUsername) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        Payment payment = order.getPayment();
        if (payment == null) {
            throw new BadRequestException("Order does not have a payment record to verify");
        }

        if (Boolean.TRUE.equals(request.getApproved())) {
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setVerifiedByAdmin(true);
            payment.setVerifiedAt(LocalDateTime.now());
            payment.setVerifiedByUsername(adminUsername);
            order.setOrderStatus(OrderStatus.PAYMENT_VERIFIED);

            mailService.sendPaymentVerifiedEmail(order);
        } else {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            payment.setVerifiedByAdmin(false);
            payment.setRejectionReason(request.getRejectionReason());
            order.setOrderStatus(OrderStatus.PENDING_PAYMENT);
        }

        paymentRepository.save(payment);
        Order updatedOrder = orderRepository.save(order);
        return mapToResponseDto(updatedOrder);
    }

    @Transactional
    public OrderResponseDto dispatchToShiprocket(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getPayment() != null && order.getPayment().getPaymentStatus() != PaymentStatus.PAID && order.getPayment().getPaymentMethod() != PaymentMethod.COD) {
            throw new BadRequestException("Cannot dispatch order to Shiprocket until payment is verified!");
        }

        Order dispatchedOrder = shiprocketService.pushOrderToShiprocket(order);
        return mapToResponseDto(dispatchedOrder);
    }

    public OrderResponseDto getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("No order found with number: " + orderNumber));
        return mapToResponseDto(order);
    }

    public OrderResponseDto getOrderByAwb(String awb) {
        Order order = orderRepository.findByShiprocketAwb(awb)
                .orElseThrow(() -> new ResourceNotFoundException("No order found with AWB: " + awb));
        return mapToResponseDto(order);
    }

    public List<OrderResponseDto> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public Page<OrderResponseDto> getAllOrdersAdmin(OrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return orderRepository.findAllWithFilter(status, pageable).map(this::mapToResponseDto);
    }

    @Transactional
    public OrderResponseDto updateOrderStatus(Long orderId, OrderStatus status, String adminNotes) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setOrderStatus(status);
        if (adminNotes != null) {
            order.setAdminNotes(adminNotes);
        }
        return mapToResponseDto(orderRepository.save(order));
    }

    private String generateOrderNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        int randPart = 1000 + (int)(Math.random() * 9000);
        return "VS-" + datePart + "-" + randPart;
    }

    public OrderResponseDto mapToResponseDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setCustomerEmail(order.getUser().getEmail());
            dto.setCustomerName(order.getUser().getFullName());
        } else if (order.getShippingAddress() != null) {
            dto.setCustomerEmail(order.getShippingAddress().getEmail());
            dto.setCustomerName(order.getShippingAddress().getFullName());
        }
        dto.setOrderStatus(order.getOrderStatus());
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingCharge(order.getShippingCharge());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setCustomerNotes(order.getCustomerNotes());
        dto.setAdminNotes(order.getAdminNotes());
        dto.setCreatedAt(order.getCreatedAt());

        // Shiprocket
        dto.setShiprocketOrderId(order.getShiprocketOrderId());
        dto.setShiprocketShipmentId(order.getShiprocketShipmentId());
        dto.setShiprocketAwb(order.getShiprocketAwb());
        dto.setCourierName(order.getCourierName());
        dto.setTrackingUrl(order.getTrackingUrl());

        // Items
        if (order.getItems() != null) {
            List<OrderItemResponseDto> itemDtos = order.getItems().stream().map(item -> {
                OrderItemResponseDto itemDto = new OrderItemResponseDto();
                itemDto.setId(item.getId());
                if (item.getProduct() != null) itemDto.setProductId(item.getProduct().getId());
                itemDto.setProductName(item.getProductName());
                itemDto.setSize(item.getSize());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setUnitPrice(item.getUnitPrice());
                itemDto.setTotalPrice(item.getTotalPrice());
                itemDto.setImageUrl(item.getImageUrl());
                return itemDto;
            }).collect(Collectors.toList());
            dto.setItems(itemDtos);
        }

        // Payment
        if (order.getPayment() != null) {
            Payment p = order.getPayment();
            dto.setPaymentMethod(p.getPaymentMethod());
            dto.setPaymentStatus(p.getPaymentStatus());
            dto.setUpiTransactionId(p.getUpiTransactionId());
            dto.setPaymentScreenshotUrl(p.getScreenshotUrl());
            dto.setPaymentVerified(p.isVerifiedByAdmin());
            dto.setPaymentVerifiedAt(p.getVerifiedAt());
            dto.setRejectionReason(p.getRejectionReason());
        }

        return dto;
    }
}
