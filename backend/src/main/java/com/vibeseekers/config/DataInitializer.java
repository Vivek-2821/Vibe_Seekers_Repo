package com.vibeseekers.config;

import com.vibeseekers.entity.*;
import com.vibeseekers.repository.*;
import com.vibeseekers.service.StoreSettingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductSizeStockRepository sizeStockRepository;
    private final StoreSettingService storeSettingService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:vibeseekers09@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@Vibe2026!}")
    private String adminPassword;

    @Value("${app.admin.name:Vivek Ashok Matne}")
    private String adminName;
    private final com.vibeseekers.repository.CouponRepository couponRepository;

    public DataInitializer(UserRepository userRepository,
                           ProductRepository productRepository,
                           ProductImageRepository productImageRepository,
                           ProductSizeStockRepository sizeStockRepository,
                           StoreSettingService storeSettingService,
                           PasswordEncoder passwordEncoder,
                           com.vibeseekers.repository.CouponRepository couponRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.sizeStockRepository = sizeStockRepository;
        this.storeSettingService = storeSettingService;
        this.passwordEncoder = passwordEncoder;
        this.couponRepository = couponRepository;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedStoreSettings();
        seedSampleProducts();
        seedCoupons();
    }

    private void seedCoupons() {
        if (!couponRepository.existsByCodeIgnoreCase("VIBE10")) {
            couponRepository.save(new com.vibeseekers.entity.Coupon("VIBE10", 10, new BigDecimal("999.00"), new BigDecimal("300.00"), java.time.LocalDateTime.now().plusMonths(6)));
        }
        if (!couponRepository.existsByCodeIgnoreCase("STREET20")) {
            couponRepository.save(new com.vibeseekers.entity.Coupon("STREET20", 20, new BigDecimal("2499.00"), new BigDecimal("600.00"), java.time.LocalDateTime.now().plusMonths(6)));
        }
        if (!couponRepository.existsByCodeIgnoreCase("FIRSTVIBE")) {
            couponRepository.save(new com.vibeseekers.entity.Coupon("FIRSTVIBE", 15, new BigDecimal("1499.00"), new BigDecimal("400.00"), java.time.LocalDateTime.now().plusMonths(6)));
        }
        log.info("Initialized default streetwear promo coupons.");
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail(adminEmail.toLowerCase().trim())) {
            User admin = new User(
                    adminEmail.toLowerCase().trim(),
                    passwordEncoder.encode(adminPassword),
                    adminName,
                    "+91 9860498749",
                    Role.ROLE_ADMIN,
                    true
            );
            userRepository.save(admin);
            log.info("Initialized default administrator account: {}", adminEmail);
        }
    }

    private void seedStoreSettings() {
        storeSettingService.setSetting("codEnabled", "false", "Cash on Delivery Availability (Prepaid only default)");
        storeSettingService.setSetting("returnsEnabled", "false", "Returns Policy Toggle (Returns currently disabled)");
        storeSettingService.setSetting("upiId", "9860498749-2@ybl", "Official Store UPI ID for prepaid orders");
        storeSettingService.setSetting("upiPayeeName", "Vivek Ashok Matne", "Official Payee Name for UPI transactions");
        storeSettingService.setSetting("supportPhone", "+91 9860498749", "Customer Support Phone & WhatsApp");
        storeSettingService.setSetting("storeEmail", "vibeseekers09@gmail.com", "Official Store Support Email");
        storeSettingService.setSetting("instagramUrl", "https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr", "Instagram Handle");
        storeSettingService.setSetting("phonePeQrUrl", "/assets/phonepe-qr.jpg", "Static PhonePe QR code path");
        log.info("Initialized default store policies and payment settings.");
    }

    private void seedSampleProducts() {
        if (productRepository.count() > 0) {
            // Enrich existing products with best-seller flags and luxury attributes
            List<Product> existing = productRepository.findAll();
            for (Product p : existing) {
                boolean changed = false;
                if (p.getColors() == null || p.getColors().isEmpty()) {
                    p.setColors("Acid Black, Vintage White, Washed Charcoal");
                    changed = true;
                }
                if (p.getGsm() == null || p.getGsm().isEmpty()) {
                    p.setGsm(p.getCategory() == ProductCategory.HOODIES ? "420 GSM Luxury Heavyweight Fleece" :
                             (p.getCategory() == ProductCategory.JACKETS ? "380 GSM Japanese Twill" : "240 GSM Combed Luxury Cotton"));
                    changed = true;
                }
                if (p.getWashingInstructions() == null || p.getWashingInstructions().isEmpty()) {
                    p.setWashingInstructions("Cold gentle machine wash inside out with dark colors. Do not bleach. Hang dry in shade. Do not iron directly on graphics.");
                    changed = true;
                }
                if (p.getCollectionName() == null || p.getCollectionName().isEmpty()) {
                    p.setCollectionName("Underground Genesis Drop 01");
                    changed = true;
                }
                if (p.isBestSeller() == null || !p.isBestSeller()) {
                    if (p.getSlug() != null && (p.getSlug().contains("glyph") || p.getSlug().contains("tokyo") || p.getSlug().contains("hoodie") || p.getSlug().contains("fleece"))) {
                        p.setBestSeller(true);
                        changed = true;
                    }
                }
                if (changed) {
                    productRepository.save(p);
                }
            }
            return;
        }

        // ================= T-SHIRTS =================
        createStreetwearProduct(
                "Shadow Glyph Oversized Tee",
                "shadow-glyph-oversized-tee",
                ProductCategory.TSHIRTS,
                new BigDecimal("1299.00"),
                new BigDecimal("1899.00"),
                "Cut from heavyweight 240 GSM luxury cotton, the Shadow Glyph Oversized Tee features high-density distressed screen graphics, dropped shoulders, and ribbed collar detailing. Built for effortless Indian streetwear styling.",
                "240 GSM Heavyweight Terry Cotton | Boxy Dropped Shoulder Fit | Pre-shrunk & Bio-washed",
                true,
                List.of(
                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
                )
        );

        createStreetwearProduct(
                "Tokyo Acid Wash Graphic Tee",
                "tokyo-acid-wash-graphic-tee",
                ProductCategory.TSHIRTS,
                new BigDecimal("1399.00"),
                new BigDecimal("1999.00"),
                "Vintage mineral wash finish paired with futuristic cyberpunk typography. Each piece undergoes a hand-crafted acid wash technique giving unique vintage charcoal distress to every t-shirt.",
                "250 GSM French Terry | Mineral Acid Wash | Raw Edge Detailing",
                true,
                List.of(
                        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80"
                )
        );

        createStreetwearProduct(
                "Cyber Matrix Heavyweight Tee",
                "cyber-matrix-heavyweight-tee",
                ProductCategory.TSHIRTS,
                new BigDecimal("1199.00"),
                new BigDecimal("1699.00"),
                "Minimalist front logo with an aggressive metallic back print inspired by underground cyber aesthetics. Relaxed boxy streetwear silhouette.",
                "240 GSM 100% Combed Cotton | Ribbed Crew Neck | Anti-pilling",
                false,
                List.of(
                        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80"
                )
        );

        // ================= HOODIES =================
        createStreetwearProduct(
                "Vibe Seekers Core Heavyweight Hoodie",
                "vibe-seekers-core-heavyweight-hoodie",
                ProductCategory.HOODIES,
                new BigDecimal("2499.00"),
                new BigDecimal("3499.00"),
                "The flagship hoodie of Vibe Seekers. Crafted with ultra-plush 400 GSM fleece, double-layered drawstring-free hood, seamless kangaroo pocket, and signature tonal high-density brand embroidery.",
                "400 GSM Ultra-Fleece Cotton | Double Layer Hood | Pre-washed Heavyweight",
                true,
                List.of(
                        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80"
                )
        );

        createStreetwearProduct(
                "Nocturnal Phantom Zip Hoodie",
                "nocturnal-phantom-zip-hoodie",
                ProductCategory.HOODIES,
                new BigDecimal("2799.00"),
                new BigDecimal("3899.00"),
                "Two-way custom YKK gunmetal zippers, oversized drop-shoulder fit, custom distressing, and thermal brushed interior for cold evening street rides.",
                "380 GSM Brushed Loopback Cotton | 2-Way Heavy Duty Metal Zipper",
                true,
                List.of(
                        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"
                )
        );

        createStreetwearProduct(
                "Industrial Rust Distressed Hoodie",
                "industrial-rust-distressed-hoodie",
                ProductCategory.HOODIES,
                new BigDecimal("2599.00"),
                new BigDecimal("3599.00"),
                "Earthy terracotta/rust washed hue with micro-abrasions along cuffs and hem. Featuring the iconic VIBE SEEKERS distressed stencil graphic on the back.",
                "400 GSM Heavyweight Terry | Enzyme Vintage Wash | Relaxed Street Cut",
                false,
                List.of(
                        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80"
                )
        );

        // ================= JACKETS =================
        createStreetwearProduct(
                "Urban Tactical Cargo Bomber Jacket",
                "urban-tactical-cargo-bomber-jacket",
                ProductCategory.JACKETS,
                new BigDecimal("3499.00"),
                new BigDecimal("4999.00"),
                "Engineered from high-density water-resistant technical nylon shell with contrast orange quilted lining. Features 6 modular 3D utility cargo pockets, heavy-gauge zip hardware, and magnetic snap collar.",
                "Weather-Resistant Ballistic Twill Nylon | Insulated Quilted Lining | Multi-Pocket Utility",
                true,
                List.of(
                        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&auto=format&fit=crop&q=80"
                )
        );

        createStreetwearProduct(
                "Subversive Corduroy Coach Jacket",
                "subversive-corduroy-coach-jacket",
                ProductCategory.JACKETS,
                new BigDecimal("3199.00"),
                new BigDecimal("4499.00"),
                "Heavy-wale vintage black corduroy with custom branded brass snap fasteners, welt front pockets, adjustable drawstring hem, and oversized street drape.",
                "12-Wale Heavy Pure Cotton Corduroy | Matte Satin Lining | Custom Brass Snaps",
                true,
                List.of(
                        "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&auto=format&fit=crop&q=80"
                )
        );

        createStreetwearProduct(
                "Vandal Denim Trucker Jacket",
                "vandal-denim-trucker-jacket",
                ProductCategory.JACKETS,
                new BigDecimal("2999.00"),
                new BigDecimal("4299.00"),
                "14.5 oz rigid indigo denim washed down to a faded charcoal wash with hand-applied paint spatter detailing and raw selvedge accents.",
                "14.5 oz Selvedge Cotton Denim | Stone Washed | Custom Metal Buttons",
                false,
                List.of(
                        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=80"
                )
        );

        log.info("Initialized sample streetwear products across T-Shirts, Hoodies, and Jackets.");
    }

    private void createStreetwearProduct(String name, String slug, ProductCategory category,
                                         BigDecimal price, BigDecimal mrp, String description,
                                         String fabric, boolean isNewArrival, List<String> imageUrls) {
        Product product = new Product();
        product.setName(name);
        product.setSlug(slug);
        product.setCategory(category);
        product.setPrice(price);
        product.setMrp(mrp);
        product.setDescription(description);
        product.setFabricDetails(fabric);
        product.setNewArrival(isNewArrival);
        product.setBestSeller(slug.contains("glyph") || slug.contains("tokyo") || slug.contains("cyber") || slug.contains("fleece"));
        product.setColors("Acid Black, Vintage White, Olive, Charcoal");
        product.setGsm(fabric != null && fabric.contains("GSM") ? fabric.split("\\|")[0].trim() : (category == ProductCategory.HOODIES ? "400 GSM" : "240 GSM"));
        product.setWashingInstructions("Machine wash cold inside-out with like colors. Do not iron directly on print. Flat dry in shade.");
        product.setCollectionName("Monochrome Drop 01");
        product.setActive(true);

        Product savedProduct = productRepository.save(product);

        // Size stocks: S:12, M:20, L:25, XL:15, XXL:8
        List<String> sizes = List.of("S", "M", "L", "XL", "XXL");
        int[] stocks = {12, 20, 25, 15, 8};
        for (int i = 0; i < sizes.size(); i++) {
            ProductSizeStock pss = new ProductSizeStock(savedProduct, sizes.get(i), stocks[i]);
            sizeStockRepository.save(pss);
        }

        // Images
        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage img = new ProductImage(
                    savedProduct,
                    imageUrls.get(i),
                    "seed_" + slug + "_" + i,
                    i == 0,
                    i
            );
            productImageRepository.save(img);
        }
    }
}
