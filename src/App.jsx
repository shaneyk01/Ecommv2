import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { logoutUser } from "./services/authService";

export default function App() {
  const { user, initializing } = useAuth();

  if (initializing) return <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>Loading...</div>;

  async function handleLogout() {
    await logoutUser();
  }

  return (
    <ErrorBoundary>
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
      <nav
        style={{
          display: "flex",
          gap: "1.5rem",
          padding: "1rem 2rem",
          borderBottom: "2px solid #e9ecef",
          alignItems: "center",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}
      >
        <Link to="/" style={{ 
          fontWeight: "bold", 
          fontSize: "20px",
          textDecoration: "none",
          color: "#007bff",
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🛍️ Ecomm v2
        </Link>
        <Link to="/" style={{ textDecoration: 'none', color: '#495057', fontWeight: '500' }}>
          Products
        </Link>
        {user && (
          <>
            <Link to="/profile" style={{ textDecoration: 'none', color: '#495057', fontWeight: '500' }}>
              Profile
            </Link>
            <Link to="/orders" style={{ textDecoration: 'none', color: '#495057', fontWeight: '500' }}>
              My Orders
            </Link>
            <Link to="/wishlist" style={{ textDecoration: 'none', color: '#495057', fontWeight: '500' }}>
              💝 Wishlist
            </Link>
          </>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {!user && (
            <>
              <Link to="/login" style={{ 
                padding: '8px 16px',
                textDecoration: 'none', 
                color: '#007bff',
                border: '1px solid #007bff',
                borderRadius: '4px',
                fontWeight: '500'
              }}>
                Login
              </Link>
              <Link to="/register" style={{ 
                padding: '8px 16px',
                textDecoration: 'none', 
                color: 'white',
                backgroundColor: '#007bff',
                borderRadius: '4px',
                fontWeight: '500'
              }}>
                Register
              </Link>
            </>
          )}
          {user && (
            <>
              <span style={{ color: '#6c757d', fontSize: '14px' }}>
                👤 {user.email}
              </span>
              <button 
                onClick={handleLogout} 
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={user ? <OrdersPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/wishlist"
            element={user ? <WishlistPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
    </ErrorBoundary>
  );
}
