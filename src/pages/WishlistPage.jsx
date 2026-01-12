import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getUserWishlist, removeFromWishlist } from '../services/wishlistService.js';
import { getProduct } from '../services/productService.js';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [user]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const wishlistItems = await getUserWishlist(user.uid);
      
      // Fetch full product details for each wishlist item
      const productPromises = wishlistItems.map(item => 
        getProduct(item.productId)
      );
      
      const productsData = await Promise.all(productPromises);
      setProducts(productsData.filter(p => p !== null));
      setWishlist(wishlistItems);
    } catch (err) {
      setError('Failed to load wishlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(user.uid, productId);
      setProducts(products.filter(p => p.id !== productId));
      setWishlist(wishlist.filter(w => w.productId !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your wishlist..." />;
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          padding: '16px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '24px' }}>My Wishlist</h1>

      {products.length === 0 ? (
        <EmptyState
          icon="💝"
          title="Your wishlist is empty"
          message="Save your favorite products here to view them later."
          action={() => navigate('/')}
          actionLabel="Browse Products"
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {products.map(product => (
            <div
              key={product.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div 
                onClick={() => handleViewProduct(product.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '18px',
                    color: '#333'
                  }}>
                    {product.title}
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    fontSize: '14px', 
                    margin: '0 0 12px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#28a745',
                    marginBottom: '12px'
                  }}>
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div style={{
                padding: '0 16px 16px',
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => handleViewProduct(product.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleRemove(product.id)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
