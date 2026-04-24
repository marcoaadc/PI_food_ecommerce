import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { ShopkeeperLoginPage } from './pages/shopkeeper/ShopkeeperLoginPage';
import { HomePage } from './pages/customer/HomePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shopkeeper/login" element={<ShopkeeperLoginPage />} />

          <Route
            path="/shopkeeper/dashboard"
            element={
              <ProtectedRoute role="SHOPKEEPER">
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Dashboard do Lojista</h1>
                  <p className="text-gray-500 mt-2">Em construção...</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
