# ⚡ VIBE SEEKERS — Full-Stack Indian Streetwear E-Commerce Platform

> Production-ready, deployment-safe full-stack e-commerce web application for **VIBE SEEKERS**, an Indian streetwear clothing brand founded by **Vivek Ashok Matne**.

![VIBE SEEKERS Logo](frontend/public/assets/logo.png)

---

## 📌 Brand & Business Identity
- **Brand Name**: VIBE SEEKERS
- **Owner / Payee Name**: Vivek Ashok Matne
- **Store Phone / WhatsApp Support**: [+91 9860498749](https://wa.me/919860498749)
- **Store Email**: vibeseekers09@gmail.com
- **Official Instagram**: [@vibe_seekers_09](https://www.instagram.com/vibe_seekers_09?cnvx=enZ5NDYwM2doN2ll&utm_source=qr)
- **Official UPI ID**: `9860498749-2@ybl`
- **PhonePe QR Code Asset**: Static QR at `frontend/public/assets/phonepe-qr.jpg`
- **Logistics Partner**: Shiprocket API (`SHIPROCKET_EMAIL=vivekmatne@gmail.com`)
- **Core Policy**: **100% Prepaid Orders Only** • **No Returns Currently Available**

---

## 🏗 Monorepo Architecture

```
Vibe_Seekers_Project/
├── frontend/                              # React (Vite) + Tailwind CSS + React Router + Lucide Icons
│   ├── public/
│   │   ├── _redirects                     # Netlify SPA rewrite (/* /index.html 200)
│   │   └── assets/
│   │       ├── logo.png                   # Official Vibe Seekers brand logo
│   │       └── phonepe-qr.jpg             # Official PhonePe UPI QR code
│   ├── src/
│   │   ├── api/axiosInstance.js           # JWT interceptors & token refresh
│   │   ├── context/                       # AuthContext.jsx, CartContext.jsx
│   │   ├── routes/                        # ProtectedRoute.jsx, AdminRoute.jsx
│   │   ├── components/
│   │   │   ├── common/                    # Navbar.jsx, Footer.jsx, WhatsAppButton.jsx
│   │   │   ├── shop/                      # ProductCard.jsx, SizeGuideModal.jsx
│   │   │   └── admin/                     # AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── customer/                  # Home, Shop, ProductDetail, Cart, Checkout,
│   │   │   │                              # TrackOrder, About, Contact, FAQ, OrderPolicy, Auth
│   │   │   └── admin/                     # AdminLogin, Dashboard, Products, Orders,
│   │   │                                  # Shiprocket, Customers, Settings
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json                        # Vercel SPA rewrite
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── backend/                               # Java 17+, Spring Boot 3, Spring Security 6, JPA, Mail
│   ├── src/main/java/com/vibeseekers/
│   │   ├── config/                        # SecurityConfig, CorsConfig, CloudinaryConfig, DataInitializer
│   │   ├── security/                      # JwtService, JwtAuthFilter, RateLimitFilter, UserPrincipal
│   │   ├── entity/                        # User, Product, ProductImage, ProductSizeStock, Order, Payment...
│   │   ├── repository/                    # Spring Data JPA repositories
│   │   ├── dto/                           # Bean-validated DTOs (@Valid)
│   │   ├── service/                       # AuthService, OtpService, MailService, OrderService, ShiprocketService...
│   │   ├── controller/                    # publicapi/, customer/, admin/
│   │   ├── exception/                     # GlobalExceptionHandler, Custom exceptions
│   │   └── VibeSeekersApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties         # Shared configuration & dynamic port
│   │   ├── application-dev.properties     # Zero-dependency local dev (H2 file DB / auto-seed)
│   │   └── application-prod.properties    # PostgreSQL HikariCP + Cloudinary + Mail
│   ├── Dockerfile                         # Multi-stage Maven 3.9 + Temurin 17 Alpine
│   ├── .env.example
│   └── pom.xml
├── docker-compose.yml                     # Full-stack local setup: PostgreSQL + Backend + Frontend
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### 1. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 2. Run Backend
The backend comes pre-configured with a zero-dependency H2 database in dev mode:
```bash
cd backend
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`
Actuator health check: `http://localhost:8080/actuator/health`

### 3. Run Everything via Docker Compose (PostgreSQL + Backend + Frontend)
```bash
docker-compose up --build
```

---

## 🔐 Default Credentials & Seeding

On initial startup, `DataInitializer.java` automatically seeds:
- **Default Admin Account**:
  - Email: `vibeseekers09@gmail.com`
  - Password: `Admin@Vibe2026!`
  - Role: `ROLE_ADMIN`
- **Store Settings**:
  - `returnsEnabled=false` (Returns currently unavailable)
  - `codEnabled=false` (Prepaid orders only)
  - `upiId=9860498749-2@ybl`
  - `upiPayeeName=Vivek Ashok Matne`
  - `supportPhone=+91 9860498749`
- **Sample Streetwear Catalog**:
  - **T-Shirts**: *Shadow Glyph Oversized Tee*, *Tokyo Acid Wash Graphic Tee*, *Cyber Matrix Heavyweight Tee*
  - **Hoodies**: *Vibe Seekers Core Heavyweight Hoodie*, *Nocturnal Phantom Zip Hoodie*, *Industrial Rust Distressed Hoodie*
  - **Jackets**: *Urban Tactical Cargo Bomber Jacket*, *Subversive Corduroy Coach Jacket*, *Vandal Denim Trucker Jacket*
  - Fully populated with S, M, L, XL, XXL stocks and HD streetwear imagery!

---

## 📦 Shiprocket Logistics Integration

- **Authentication**: Automated login and JWT token caching with automatic renewal.
- **Serviceability**: Live courier and estimated delivery timeline check on pincode entry.
- **Order Dispatch**: 1-click dispatch pushes verified orders to `POST /v1/external/orders/create/adhoc` to generate AWB codes.
- **Live Tracking**: Queries live courier events for customer & admin order tracking.
- **Webhook**: `POST /api/webhooks/shiprocket` secured with header `X-Shiprocket-Secret`.

---

## 💳 Prepaid UPI Checkout Workflow

1. Customer selects size (S, M, L, XL, XXL) with live stock check.
2. During checkout, customer views PhonePe QR code (`phonepe-qr.jpg`) and verified payee name: **Vivek Ashok Matne**.
3. Customer transfers the exact order amount via PhonePe/GPay/Paytm and enters the **12-digit UPI UTR ID**.
4. Customer uploads an optional screenshot for faster review.
5. In `/admin/orders`, admin reviews the UTR and screenshot, and clicks **1-Click Approve Payment**.
6. The order is automatically tagged `PAYMENT_VERIFIED` and ready for 1-click Shiprocket dispatch.

---

## 🚢 Production Deployment

### Backend (Render / Railway / AWS / DigitalOcean)
- Set environment variable `SPRING_PROFILES_ACTIVE=prod`.
- Provide environment variables as described in `backend/.env.example`:
  - `PORT=8080`
  - `DB_URL=jdbc:postgresql://<host>:5432/<dbname>`
  - `DB_USERNAME=<user>`
  - `DB_PASSWORD=<password>`
  - `JWT_SECRET=<strong-256-bit-key>`
  - `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com`
  - `SHIPROCKET_PASSWORD=<password>`
  - `CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud_name>`

### Frontend (Vercel / Netlify / Cloudflare Pages)
- Connect repository and set root directory to `frontend`.
- Set Environment Variable: `VITE_API_BASE_URL=https://your-backend-api.com`.
- Build Command: `npm run build`.
- Output Directory: `dist`.
- `public/_redirects` and `vercel.json` ensure single-page-app client-side routing never returns 404 on page refresh!
