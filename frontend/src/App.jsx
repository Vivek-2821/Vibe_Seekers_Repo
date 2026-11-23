import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { AdminLayout } from './components/admin/AdminLayout';

// Customer Pages
import { Home } from './pages/customer/Home';
import { Shop } from './pages/customer/Shop';
import { ProductDetail } from './pages/customer/ProductDetail';
import { Cart } from './pages/customer/Cart';
import { Checkout } from './pages/customer/Checkout';
import { TrackOrder } from './pages/customer/TrackOrder';
import { About } from './pages/customer/About';
import { Contact } from './pages/customer/Contact';
import { FAQ } from './pages/customer/FAQ';
import { OrderPolicy } from './pages/customer/OrderPolicy';
import { Auth } from './pages/customer/Auth';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { Products } from './pages/admin/Products';
import { Orders } from './pages/admin/Orders';
import { Shiprocket } from './pages/admin/Shiprocket';
import { Customers } from './pages/admin/Customers';
import { StoreSettings } from './pages/admin/Settings';
import { Coupons } from './pages/admin/Coupons';

// Customer Storefront Layout with Global Navbar & Footer
const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#f4f4f5]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Customer Storefront Routes */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/order-policy" element={<OrderPolicy />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/forgot-password" element={<Auth />} />
              </Route>

              {/* Admin Dedicated Authentication Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Dashboard Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="coupons" element={<Coupons />} />
                <Route path="shiprocket" element={<Shiprocket />} />
                <Route path="customers" element={<Customers />} />
                <Route path="settings" element={<StoreSettings />} />
              </Route>

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;
