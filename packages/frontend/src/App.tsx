import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { ShopkeeperLoginPage } from './pages/shopkeeper/ShopkeeperLoginPage';
import { HomePage } from './pages/customer/HomePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shopkeeper/login" element={<ShopkeeperLoginPage />} />
          <Route
            path="/shopkeeper/dashboard"
            element={
              <ProtectedRoute role="SHOPKEEPER">
                <div style={{ padding: '2rem' }}>
                  <h1>Dashboard do Lojista</h1>
                  <p>Em construção...</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
