import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { ShopkeeperLayout } from './components/layout/ShopkeeperLayout';
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrdersPage as CustomerOrdersPage } from './pages/customer/OrdersPage';
import { ShopkeeperLoginPage } from './pages/shopkeeper/ShopkeeperLoginPage';
import { DashboardPage } from './pages/shopkeeper/DashboardPage';
import { OrdersPage as ShopkeeperOrdersPage } from './pages/shopkeeper/OrdersPage';
import { HomePage } from './pages/customer/HomePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <CustomerOrdersPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shopkeeper/login" element={<ShopkeeperLoginPage />} />

          <Route
            element={
              <ProtectedRoute role="SHOPKEEPER">
                <ShopkeeperLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/shopkeeper/dashboard" element={<DashboardPage />} />
            <Route path="/shopkeeper/orders" element={<ShopkeeperOrdersPage />} />
          </Route>
        </Routes>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
