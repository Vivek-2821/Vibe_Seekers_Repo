package com.vibeseekers.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibeseekers.dto.auth.AuthResponse;
import com.vibeseekers.dto.contact.ContactMessageDto;
import com.vibeseekers.dto.order.PaymentVerificationRequest;
import com.vibeseekers.dto.product.ProductImageDto;
import com.vibeseekers.dto.product.ProductRequestDto;
import com.vibeseekers.dto.product.ProductResponseDto;
import com.vibeseekers.dto.shiprocket.ShiprocketCourierCheckDto;
import com.vibeseekers.entity.Coupon;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JacksonDtoMappingTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testProductRequestDtoDeserializationWithIsPrefixes() throws Exception {
        String json = """
            {
              "name": "Oversized Tee",
              "category": "TSHIRTS",
              "price": 1299.0,
              "description": "Premium Heavyweight Tee",
              "isBestSeller": true,
              "isNewArrival": true,
              "isActive": true,
              "unrecognizedExtraField": "should be safely ignored",
              "existingImages": [
                {
                  "id": 1,
                  "imageUrl": "https://res.cloudinary.com/demo/image.jpg",
                  "isPrimary": true,
                  "displayOrder": 0
                }
              ]
            }
            """;

        ProductRequestDto dto = objectMapper.readValue(json, ProductRequestDto.class);
        assertNotNull(dto);
        assertEquals("Oversized Tee", dto.getName());
        assertTrue(dto.isBestSeller());
        assertTrue(dto.isNewArrival());
        assertTrue(dto.isActive());
        assertEquals(1, dto.getExistingImages().size());
        assertTrue(dto.getExistingImages().get(0).isPrimary());

        // Prove serialization does not throw InvalidDefinitionException
        String serialized = objectMapper.writeValueAsString(dto);
        assertNotNull(serialized);
    }

    @Test
    public void testProductRequestDtoDeserializationWithoutIsPrefixes() throws Exception {
        String json = """
            {
              "name": "Street Hoodie",
              "category": "HOODIES",
              "price": 2499.0,
              "description": "French Terry Cotton",
              "bestSeller": false,
              "newArrival": true,
              "active": true,
              "existingImages": [
                {
                  "id": 2,
                  "imageUrl": "https://res.cloudinary.com/demo/image2.jpg",
                  "primary": true,
                  "displayOrder": 1
                }
              ]
            }
            """;

        ProductRequestDto dto = objectMapper.readValue(json, ProductRequestDto.class);
        assertNotNull(dto);
        assertFalse(dto.isBestSeller());
        assertTrue(dto.isNewArrival());
        assertTrue(dto.isActive());
        assertEquals(1, dto.getExistingImages().size());
        assertTrue(dto.getExistingImages().get(0).isPrimary());
    }

    @Test
    public void testProductResponseDtoSerializationAndDeserialization() throws Exception {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(10L);
        dto.setName("Cyber Matrix Heavyweight Tee");
        dto.setBestSeller(true);
        dto.setNewArrival(true);
        dto.setActive(true);

        String json = objectMapper.writeValueAsString(dto);
        assertNotNull(json);

        ProductResponseDto deserialized = objectMapper.readValue(json, ProductResponseDto.class);
        assertNotNull(deserialized);
        assertEquals(10L, deserialized.getId());
        assertTrue(deserialized.isBestSeller());
        assertTrue(deserialized.isNewArrival());
        assertTrue(deserialized.isActive());
    }

    @Test
    public void testPaymentVerificationRequestBothNames() throws Exception {
        String json1 = "{\"approved\": true}";
        PaymentVerificationRequest req1 = objectMapper.readValue(json1, PaymentVerificationRequest.class);
        assertTrue(req1.getApproved());

        String json2 = "{\"isApproved\": true}";
        PaymentVerificationRequest req2 = objectMapper.readValue(json2, PaymentVerificationRequest.class);
        assertTrue(req2.getApproved());
    }

    @Test
    public void testContactMessageDtoBothNames() throws Exception {
        String json = "{\"name\": \"John\", \"email\": \"j@b.com\", \"subject\": \"Hi\", \"message\": \"Msg\", \"isRead\": true}";
        ContactMessageDto dto = objectMapper.readValue(json, ContactMessageDto.class);
        assertTrue(dto.isRead());
    }

    @Test
    public void testShiprocketCourierCheckDtoBothNames() throws Exception {
        String json = "{\"deliveryPincode\": \"400001\", \"isCod\": true}";
        ShiprocketCourierCheckDto dto = objectMapper.readValue(json, ShiprocketCourierCheckDto.class);
        assertTrue(dto.isCod());
    }

    @Test
    public void testCouponBothNames() throws Exception {
        String json = "{\"code\": \"DROP10\", \"discountPercent\": 10, \"isActive\": true}";
        Coupon coupon = objectMapper.readValue(json, Coupon.class);
        assertTrue(coupon.isActive());
    }

    @Test
    public void testAuthResponseBothNames() throws Exception {
        String json = "{\"accessToken\": \"token\", \"refreshToken\": \"ref\", \"isVerified\": true}";
        AuthResponse res = objectMapper.readValue(json, AuthResponse.class);
        assertTrue(res.isVerified());
    }

    @Test
    public void testProductImageDtoUrls() throws Exception {
        // Deserialization with "url"
        String jsonWithUrl = "{\"id\": 1, \"url\": \"https://res.cloudinary.com/test/img1.jpg\", \"primary\": true}";
        ProductImageDto dto1 = objectMapper.readValue(jsonWithUrl, ProductImageDto.class);
        assertEquals("https://res.cloudinary.com/test/img1.jpg", dto1.getImageUrl());
        assertEquals("https://res.cloudinary.com/test/img1.jpg", dto1.getUrl());

        // Deserialization with "secure_url"
        String jsonWithSecureUrl = "{\"id\": 2, \"secure_url\": \"https://res.cloudinary.com/test/img2.jpg\", \"primary\": false}";
        ProductImageDto dto2 = objectMapper.readValue(jsonWithSecureUrl, ProductImageDto.class);
        assertEquals("https://res.cloudinary.com/test/img2.jpg", dto2.getImageUrl());
        assertEquals("https://res.cloudinary.com/test/img2.jpg", dto2.getUrl());

        // Serialization produces both imageUrl and url
        String serialized = objectMapper.writeValueAsString(dto1);
        assertTrue(serialized.contains("\"imageUrl\""));
        assertTrue(serialized.contains("\"url\""));
    }

    @Test
    public void testProductResponseDtoImageUrls() throws Exception {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(25L);
        dto.setName("Retro Baggy Denim");
        dto.setPrimaryImageUrl("https://res.cloudinary.com/test/denim.jpg");

        String serialized = objectMapper.writeValueAsString(dto);
        assertTrue(serialized.contains("\"primaryImageUrl\""));
        assertTrue(serialized.contains("\"imageUrl\""));
        assertTrue(serialized.contains("\"url\""));

        ProductResponseDto deserialized = objectMapper.readValue(serialized, ProductResponseDto.class);
        assertEquals("https://res.cloudinary.com/test/denim.jpg", deserialized.getPrimaryImageUrl());
        assertEquals("https://res.cloudinary.com/test/denim.jpg", deserialized.getImageUrl());
        assertEquals("https://res.cloudinary.com/test/denim.jpg", deserialized.getUrl());
    }

    @Test
    public void testProductRequestDtoImagesAlias() throws Exception {
        String json = """
            {
              "name": "Cargo Pants",
              "category": "JACKETS",
              "price": 1999.0,
              "description": "Tactical Cargo Pants",
              "images": [
                {
                  "url": "https://res.cloudinary.com/test/cargo.jpg",
                  "primary": true
                }
              ]
            }
            """;
        ProductRequestDto dto = objectMapper.readValue(json, ProductRequestDto.class);
        assertNotNull(dto.getExistingImages());
        assertEquals(1, dto.getExistingImages().size());
        assertEquals("https://res.cloudinary.com/test/cargo.jpg", dto.getExistingImages().get(0).getImageUrl());
    }
}
